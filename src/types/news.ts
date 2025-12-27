// TypeScript types for news articles and related data

export interface NewsArticle {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  source: string;
  source_url: string;
  image_url: string | null;
  category: string;
  published_at: string;
  fetched_at: string;
  relevance_score: number;
  quality_score: number;
  timeliness_score: number;
  overall_score: number;
  ai_summary: string | null;
  ai_insights: Record<string, any> | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface NewsFeedResponse {
  articles: NewsArticle[];
  total: number;
  has_more: boolean;
}

export interface NewsCategory {
  category: string;
  count: number;
}

export interface ReadingPattern {
  id: string;
  user_id: string;
  article_id: string;
  time_spent_seconds: number | null;
  read_percentage: number | null;
  clicked_at: string;
  saved: boolean;
  shared: boolean;
  category: string | null;
  created_at: string;
}

export interface SavedArticle {
  id: string;
  user_id: string;
  article_id: string;
  saved_at: string;
  notes: string | null;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'api' | 'scraper';
  api_key: string | null;
  enabled: boolean;
  priority: number;
  last_fetched_at: string | null;
  created_at: string;
  updated_at: string;
}



