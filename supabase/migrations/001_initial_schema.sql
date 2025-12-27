-- RMG Insights Database Schema
-- Phase 1: Foundation - News Articles and Basic Infrastructure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- News Articles Table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  source TEXT NOT NULL,
  source_url TEXT NOT NULL UNIQUE,
  image_url TEXT,
  category TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  relevance_score DECIMAL(5,2) DEFAULT 0,
  quality_score DECIMAL(5,2) DEFAULT 0,
  timeliness_score DECIMAL(5,2) DEFAULT 0,
  overall_score DECIMAL(5,2) DEFAULT 0,
  ai_summary TEXT,
  ai_insights JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Article Categories/Tags
CREATE TABLE IF NOT EXISTS article_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES news_articles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  confidence DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- News Sources Configuration
CREATE TABLE IF NOT EXISTS news_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rss', 'api', 'scraper')),
  api_key TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 0,
  last_fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Preferences Table (migrate from KV store)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  profession TEXT,
  interests TEXT[],
  language TEXT DEFAULT 'english',
  ai_learning_enabled BOOLEAN DEFAULT TRUE,
  notification_preferences JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'business')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')) DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reading Patterns Table (for Pro/Business tiers)
CREATE TABLE IF NOT EXISTS reading_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES news_articles(id) ON DELETE CASCADE,
  time_spent_seconds INTEGER,
  read_percentage DECIMAL(5,2),
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  saved BOOLEAN DEFAULT FALSE,
  shared BOOLEAN DEFAULT FALSE,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Saved Articles Table
CREATE TABLE IF NOT EXISTS saved_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES news_articles(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, article_id)
);

-- AI Analysis Cache Table
CREATE TABLE IF NOT EXISTS ai_analysis_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES news_articles(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  analysis_result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(article_id, analysis_type)
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_overall_score ON news_articles(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_source_url ON news_articles(source_url);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON news_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reading_patterns_user_id ON reading_patterns(user_id, clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_reading_patterns_article_id ON reading_patterns(article_id);
CREATE INDEX IF NOT EXISTS idx_saved_articles_user_id ON saved_articles(user_id, saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_article_categories_article_id ON article_categories(article_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_sources_updated_at BEFORE UPDATE ON news_sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;

-- News articles are public (readable by all)
CREATE POLICY "News articles are viewable by everyone" ON news_articles
    FOR SELECT USING (true);

-- User preferences are private
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions are private
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Reading patterns are private
CREATE POLICY "Users can manage own reading patterns" ON reading_patterns
    FOR ALL USING (auth.uid() = user_id);

-- Saved articles are private
CREATE POLICY "Users can manage own saved articles" ON saved_articles
    FOR ALL USING (auth.uid() = user_id);

-- Insert default free subscription for existing users (via trigger)
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO subscriptions (user_id, tier, status)
    VALUES (NEW.id, 'free', 'active')
    ON CONFLICT DO NOTHING;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_default_subscription();

-- Insert initial news sources
INSERT INTO news_sources (name, url, type, enabled, priority) VALUES
    ('Google News - RMG Bangladesh', 'https://news.google.com/rss/search?q=RMG+Bangladesh+garment+manufacturing&hl=en-US&gl=US&ceid=US:en', 'rss', true, 1),
    ('Google News - Textile Industry', 'https://news.google.com/rss/search?q=textile+industry+Bangladesh&hl=en-US&gl=US&ceid=US:en', 'rss', true, 2),
    ('Google News - Garment Manufacturing', 'https://news.google.com/rss/search?q=garment+manufacturing+apparel&hl=en-US&gl=US&ceid=US:en', 'rss', true, 3)
ON CONFLICT DO NOTHING;



