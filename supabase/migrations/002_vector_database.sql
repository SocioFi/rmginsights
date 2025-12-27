-- Vector Database Schema Migration
-- Phase 2: AI Scoring & Vector Embeddings
-- Enables semantic search and vector-based personalization using pgvector

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add vector embedding column to news_articles table
ALTER TABLE news_articles 
ADD COLUMN IF NOT EXISTS embedding vector(1536),
ADD COLUMN IF NOT EXISTS embedding_model TEXT DEFAULT 'text-embedding-3-small',
ADD COLUMN IF NOT EXISTS embedding_generated_at TIMESTAMPTZ;

-- User Activity Vectors (Individual vector database per user)
CREATE TABLE IF NOT EXISTS user_activity_vectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Vector representation of user's reading pattern/preference
  activity_embedding vector(1536),
  -- Aggregated user preference vector (updated periodically)
  preference_embedding vector(1536),
  -- User's interest categories as vectors
  category_preferences JSONB, -- {category: embedding, weight}
  -- Reading pattern metadata
  total_articles_read INTEGER DEFAULT 0,
  average_time_spent DECIMAL(10,2),
  preferred_categories TEXT[],
  preferred_sources TEXT[],
  reading_time_pattern JSONB, -- {hour_of_day: count}
  -- Vector generation metadata
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Article Category Vectors (Pre-computed category embeddings)
CREATE TABLE IF NOT EXISTS category_vectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL UNIQUE,
  category_embedding vector(1536),
  -- Category metadata
  description TEXT,
  keywords TEXT[],
  article_count INTEGER DEFAULT 0,
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Time-based Article Vector Collections
CREATE TABLE IF NOT EXISTS article_vector_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_type TEXT NOT NULL CHECK (collection_type IN ('daily', 'weekly', 'monthly')),
  collection_date DATE NOT NULL,
  -- Aggregated vector for articles in this time period
  collection_embedding vector(1536),
  article_ids UUID[],
  category_distribution JSONB, -- {category: count}
  total_articles INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(collection_type, collection_date)
);

-- Vector similarity indexes (using HNSW for fast approximate nearest neighbor search)
CREATE INDEX IF NOT EXISTS idx_articles_embedding ON news_articles 
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64)
  WHERE embedding IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_activity_embedding ON user_activity_vectors 
  USING hnsw (activity_embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64)
  WHERE activity_embedding IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_preference_embedding ON user_activity_vectors 
  USING hnsw (preference_embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64)
  WHERE preference_embedding IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_category_embedding ON category_vectors 
  USING hnsw (category_embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64)
  WHERE category_embedding IS NOT NULL;

-- Composite indexes for filtered vector search
CREATE INDEX IF NOT EXISTS idx_articles_category_embedding ON news_articles(category) 
  WHERE embedding IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_articles_time_embedding ON news_articles(published_at DESC) 
  WHERE embedding IS NOT NULL;

-- Row Level Security for user_activity_vectors
ALTER TABLE user_activity_vectors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own activity vectors" ON user_activity_vectors;
CREATE POLICY "Users can view own activity vectors" ON user_activity_vectors
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own activity vectors" ON user_activity_vectors;
CREATE POLICY "Users can update own activity vectors" ON user_activity_vectors
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own activity vectors" ON user_activity_vectors;
CREATE POLICY "Users can insert own activity vectors" ON user_activity_vectors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function for vector similarity search
CREATE OR REPLACE FUNCTION match_articles(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_category text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  category text,
  similarity float,
  overall_score decimal
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    news_articles.id,
    news_articles.title,
    news_articles.category,
    1 - (news_articles.embedding <=> query_embedding) as similarity,
    news_articles.overall_score
  FROM news_articles
  WHERE 
    news_articles.embedding IS NOT NULL
    AND (filter_category IS NULL OR news_articles.category = filter_category)
    AND 1 - (news_articles.embedding <=> query_embedding) > match_threshold
  ORDER BY news_articles.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function for user personalized feed using vector similarity
CREATE OR REPLACE FUNCTION get_personalized_feed(
  p_user_id uuid,
  p_limit int DEFAULT 20,
  p_offset int DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  category text,
  overall_score decimal,
  user_similarity float,
  combined_score float
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_preference_embedding vector(1536);
BEGIN
  -- Get user preference embedding
  SELECT preference_embedding INTO v_preference_embedding
  FROM user_activity_vectors
  WHERE user_id = p_user_id;
  
  -- If no user vector exists, return top articles by score
  IF v_preference_embedding IS NULL THEN
    RETURN QUERY
    SELECT
      na.id,
      na.title,
      na.category,
      na.overall_score,
      0.0::float as user_similarity,
      na.overall_score::float as combined_score
    FROM news_articles na
    WHERE na.embedding IS NOT NULL
    ORDER BY na.overall_score DESC, na.published_at DESC
    LIMIT p_limit OFFSET p_offset;
  ELSE
    -- Return articles with combined score (overall_score + vector similarity)
    RETURN QUERY
    SELECT
      na.id,
      na.title,
      na.category,
      na.overall_score,
      1 - (na.embedding <=> v_preference_embedding) as user_similarity,
      (na.overall_score * 0.4) + ((1 - (na.embedding <=> v_preference_embedding)) * 100 * 0.6) as combined_score
    FROM news_articles na
    WHERE na.embedding IS NOT NULL
    ORDER BY combined_score DESC, na.published_at DESC
    LIMIT p_limit OFFSET p_offset;
  END IF;
END;
$$;

-- Function to update user activity vector
CREATE OR REPLACE FUNCTION update_user_activity_vector(
  p_user_id uuid,
  p_preference_embedding vector(1536),
  p_activity_embedding vector(1536) DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO user_activity_vectors (
    user_id,
    preference_embedding,
    activity_embedding,
    last_updated_at
  )
  VALUES (
    p_user_id,
    p_preference_embedding,
    COALESCE(p_activity_embedding, p_preference_embedding),
    NOW()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    preference_embedding = EXCLUDED.preference_embedding,
    activity_embedding = COALESCE(EXCLUDED.activity_embedding, user_activity_vectors.activity_embedding),
    last_updated_at = NOW();
END;
$$;

-- Function to find similar articles
CREATE OR REPLACE FUNCTION find_similar_articles(
  p_article_id uuid,
  p_limit int DEFAULT 5,
  p_similarity_threshold float DEFAULT 0.75
)
RETURNS TABLE (
  id uuid,
  title text,
  category text,
  similarity float
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_article_embedding vector(1536);
BEGIN
  -- Get article embedding
  SELECT embedding INTO v_article_embedding
  FROM news_articles
  WHERE id = p_article_id;
  
  IF v_article_embedding IS NULL THEN
    RETURN;
  END IF;
  
  -- Find similar articles (excluding the original)
  RETURN QUERY
  SELECT
    na.id,
    na.title,
    na.category,
    1 - (na.embedding <=> v_article_embedding) as similarity
  FROM news_articles na
  WHERE 
    na.id != p_article_id
    AND na.embedding IS NOT NULL
    AND 1 - (na.embedding <=> v_article_embedding) > p_similarity_threshold
  ORDER BY na.embedding <=> v_article_embedding
  LIMIT p_limit;
END;
$$;

-- Comments for documentation
COMMENT ON TABLE user_activity_vectors IS 'Individual vector database per user for tracking reading patterns and preferences';
COMMENT ON TABLE category_vectors IS 'Pre-computed category embeddings for fast category-based semantic search';
COMMENT ON TABLE article_vector_collections IS 'Time-based vector collections for temporal article clustering';
COMMENT ON FUNCTION match_articles IS 'Find articles similar to a query embedding using cosine similarity';
COMMENT ON FUNCTION get_personalized_feed IS 'Get personalized feed for user combining vector similarity with article scores';
COMMENT ON FUNCTION update_user_activity_vector IS 'Update or create user activity vector from reading patterns';
COMMENT ON FUNCTION find_similar_articles IS 'Find articles similar to a given article using vector similarity';



