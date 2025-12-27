// News Service - Handles API calls for news articles
// Uses Direct Supabase queries (no Edge Functions needed - eliminates CORS issues)

import { supabase } from '../utils/supabase/client';
import type { NewsArticle, NewsFeedResponse, NewsCategory } from '../types/news';

export class NewsService {

  /**
   * Get news feed with pagination
   */
  static async getFeed(
    options: {
      limit?: number;
      offset?: number;
      category?: string;
      forYou?: boolean;
    } = {},
    accessToken?: string | null
  ): Promise<NewsFeedResponse> {
    try {
      const limit = options.limit || 20;
      const offset = options.offset || 0;

      let query = supabase
        .from('news_articles')
        .select('*', { count: 'exact' })
        .order('overall_score', { ascending: false })
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Filter by category if provided
      if (options.category && options.category !== 'all') {
        query = query.eq('category', options.category);
      }

      // For "For You" feed, we'll implement personalization in Phase 5
      // For now, just return top articles
      // TODO: Implement personalization based on user preferences

      const { data: articles, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        articles: (articles as NewsArticle[]) || [],
        total: count || 0,
        has_more: (count || 0) > offset + limit,
      };
    } catch (error: any) {
      console.error('Failed to load articles:', error);
      throw error;
    }
  }

  /**
   * Get a single article by ID
   */
  static async getArticle(
    articleId: string,
    accessToken?: string | null
  ): Promise<NewsArticle> {
    try {
      const { data: article, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', articleId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!article) {
        throw new Error('Article not found');
      }

      // Track reading pattern if user is authenticated (Pro/Business tier)
      if (accessToken) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Check subscription tier (will be implemented in Phase 3)
            // For now, just log the view
            await supabase.from('reading_patterns').insert({
              user_id: user.id,
              article_id: articleId,
              category: article.category,
            });
          }
        } catch (trackError) {
          // Don't fail if tracking fails
          console.warn('Failed to track reading pattern:', trackError);
        }
      }

      return article as NewsArticle;
    } catch (error: any) {
      console.error('Failed to load article:', error);
      throw error;
    }
  }

  /**
   * Search articles
   */
  static async searchArticles(
    searchQuery: string,
    options: {
      category?: string;
      limit?: number;
      offset?: number;
    } = {},
    accessToken?: string | null
  ): Promise<NewsFeedResponse> {
    try {
      if (!searchQuery) {
        throw new Error('Search query required');
      }

      const limit = options.limit || 20;
      const offset = options.offset || 0;

      let dbQuery = supabase
        .from('news_articles')
        .select('*', { count: 'exact' })
        .or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%`)
        .order('overall_score', { ascending: false })
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (options.category && options.category !== 'all') {
        dbQuery = dbQuery.eq('category', options.category);
      }

      const { data: articles, error, count } = await dbQuery;

      if (error) {
        throw new Error(error.message);
      }

      return {
        articles: (articles as NewsArticle[]) || [],
        total: count || 0,
        has_more: (count || 0) > offset + limit,
      };
    } catch (error: any) {
      console.error('Failed to search articles:', error);
      throw error;
    }
  }

  /**
   * Get available categories with counts
   */
  static async getCategories(): Promise<NewsCategory[]> {
    try {
      const { data: categories, error } = await supabase
        .from('news_articles')
        .select('category')
        .order('category');

      if (error) {
        throw new Error(error.message);
      }

      // Get unique categories with counts
      const categoryMap = new Map<string, number>();
      categories?.forEach((item) => {
        categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
      });

      const categoryList: NewsCategory[] = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
      }));

      return categoryList;
    } catch (error: any) {
      console.error('Failed to load categories:', error);
      throw error;
    }
  }
}



