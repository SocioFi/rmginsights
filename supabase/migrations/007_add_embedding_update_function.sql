-- Add SQL function to update article embeddings
-- This function handles the vector type conversion properly

CREATE OR REPLACE FUNCTION update_article_embedding(
  p_article_id uuid,
  p_embedding text, -- JSON array string like "[1,2,3,...]"
  p_model text DEFAULT 'text-embedding-3-small'
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE news_articles
  SET 
    embedding = p_embedding::vector,
    embedding_model = p_model,
    embedding_generated_at = NOW()
  WHERE id = p_article_id;
END;
$$;

