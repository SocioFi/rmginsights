// News Service - Handles API calls for news articles

import { projectId } from '../utils/supabase/info';
import type { NewsArticle, NewsFeedResponse, NewsCategory } from '../types/news';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/news-api`;

export class NewsService {
  private static async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {},
    accessToken?: string | null
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

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
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.category && options.category !== 'all') {
      params.append('category', options.category);
    }
    if (options.forYou) {
      params.append('for_you', 'true');
    }

    return this.fetchWithAuth<NewsFeedResponse>(
      `/feed?${params.toString()}`,
      { method: 'GET' },
      accessToken
    );
  }

  /**
   * Get a single article by ID
   */
  static async getArticle(
    articleId: string,
    accessToken?: string | null
  ): Promise<NewsArticle> {
    return this.fetchWithAuth<NewsArticle>(
      `/articles/${articleId}`,
      { method: 'GET' },
      accessToken
    );
  }

  /**
   * Search articles
   */
  static async searchArticles(
    query: string,
    options: {
      category?: string;
      limit?: number;
      offset?: number;
    } = {},
    accessToken?: string | null
  ): Promise<NewsFeedResponse> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (options.category && options.category !== 'all') {
      params.append('category', options.category);
    }
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());

    return this.fetchWithAuth<NewsFeedResponse>(
      `/search?${params.toString()}`,
      { method: 'GET' },
      accessToken
    );
  }

  /**
   * Get available categories with counts
   */
  static async getCategories(): Promise<NewsCategory[]> {
    return this.fetchWithAuth<NewsCategory[]>(
      '/categories',
      { method: 'GET' }
    );
  }
}



