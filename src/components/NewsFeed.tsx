import { motion } from 'motion/react';
import { useState, useMemo, useEffect } from 'react';
import { Clock, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { NewsService } from '../services/newsService';
import type { NewsArticle } from '../types/news';

interface NewsFeedProps {
  user?: any | null;
  userPreferences?: any;
  accessToken?: string | null;
  onReadStory?: (storyId: string) => void;
}

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
  'AI in RMG': '#EAB308',
  'Production': '#57ACAF',
  'Compliance': '#6F83A7',
  'Buyer Trends': '#EAB308',
  'Sustainability': '#57ACAF',
  'Workforce': '#6F83A7',
  'Policy': '#EAB308',
  'Innovation': '#57ACAF',
  'Export Markets': '#EAB308',
  'Quality Control': '#57ACAF',
  'Supply Chain': '#6F83A7',
  'Fashion Trends': '#EAB308',
  'Raw Materials': '#57ACAF',
  'Finance': '#6F83A7',
  'Logistics': '#EAB308',
  'Trade Agreements': '#57ACAF',
  'Digitalization': '#6F83A7',
  'E-commerce': '#EAB308',
  'Cost Optimization': '#57ACAF',
  'Market Analysis': '#6F83A7',
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

export function NewsFeed({ user, userPreferences, accessToken, onReadStory }: NewsFeedProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadArticles();
  }, [activeFilter, userPreferences, accessToken]);
  
  const loadArticles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const category = activeFilter === 'all' || activeFilter === 'for-you' ? undefined : activeFilter;
      const forYou = activeFilter === 'for-you' && !!userPreferences;
      
      const response = await NewsService.getFeed(
        {
          limit: 50,
          offset: 0,
          category,
          forYou,
        },
        accessToken
      );
      
      setArticles(response.articles || []);
    } catch (err: any) {
      console.error('Failed to load articles:', err);
      setError(err.message || 'Failed to load news articles');
      // Fallback to empty array on error
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };
  
  const newsArticles = useMemo(() => {
    return articles.map(article => ({
      id: article.id,
      category: article.category,
      categoryColor: CATEGORY_COLORS[article.category] || '#6F83A7',
      image: article.image_url || 'https://images.unsplash.com/photo-1684259499086-93cb3e555803?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwZmFjdG9yeSUyMHdvcmtlcnN8ZW58MXx8fHwxNzYyMDkzMTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: article.title,
      summary: article.summary || '',
      source: article.source,
      time: formatTimeAgo(article.published_at),
    }));
  }, [articles]);
  
  const filteredArticles = useMemo(() => {
    if (activeFilter === 'all') {
      return newsArticles;
    }

    if (activeFilter === 'for-you' && userPreferences) {
      return newsArticles.filter((article) => {
        const matchesInterest = userPreferences.interests?.some(
          (interest: string) => article.category === interest
        );
        return matchesInterest;
      });
    }

    return newsArticles.filter((article) => {
      return article.category === activeFilter;
    });
  }, [activeFilter, userPreferences, newsArticles]);

  const regularArticles = filteredArticles;
  const aiInsights: Array<{ isAIInsight: true; aiInsightText: string }> = [];
  
  // Add AI insights from articles that have them
  articles.forEach(article => {
    if (article.ai_insights && typeof article.ai_insights === 'object') {
      const insightText = (article.ai_insights as any).insight || article.ai_summary;
      if (insightText) {
        aiInsights.push({
          isAIInsight: true,
          aiInsightText: insightText,
        });
      }
    }
  });

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gradient-to-br dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] transition-all duration-300">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#EAB308] animate-spin" />
            <span className="ml-3 text-[#6F83A7]">Loading news...</span>
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-16 bg-white dark:bg-gradient-to-br dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] transition-all duration-300">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-20">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={loadArticles}
              className="px-4 py-2 bg-[#EAB308] text-[#101725] rounded hover:bg-[#F59E0B] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 bg-white dark:bg-gradient-to-br dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] transition-all duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Newspaper Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          {/* Masthead */}
          <div className="text-center border-b-4 border-[#101725] dark:border-[#EAB308] pb-6 mb-8 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Separator className="w-24 bg-[#EAB308]" />
              <TrendingUp className="w-5 h-5 text-[#EAB308]" />
              <Separator className="w-24 bg-[#EAB308]" />
            </div>
            
            {user ? (
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#101725] dark:text-transparent dark:bg-gradient-to-r dark:from-[#F9FAFB] dark:via-[#EAB308] dark:to-[#F9FAFB] dark:bg-clip-text mb-2 tracking-tight transition-all px-2" style={{ fontFamily: 'Georgia, serif' }}>
                  {user.user_metadata?.name?.split(' ')[0]}'s Daily Brief
                </h1>
                <p className="text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-widest text-xs sm:text-sm transition-all">
                  <span className="hidden md:inline">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="md:hidden">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#101725] dark:text-transparent dark:bg-gradient-to-r dark:from-[#F9FAFB] dark:via-[#EAB308] dark:to-[#F9FAFB] dark:bg-clip-text mb-2 tracking-tight transition-all px-2" style={{ fontFamily: 'Georgia, serif' }}>
                  RMG Insight Daily
                </h1>
                <p className="text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-widest text-xs sm:text-sm transition-all">
                  <span className="hidden md:inline">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="md:hidden">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </p>
              </div>
            )}
          </div>

          {/* Section Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 transition-colors">
            <button
              onClick={() => setActiveFilter('all')}
              className={`uppercase text-xs tracking-widest px-4 py-2 transition-all ${
                activeFilter === 'all'
                  ? 'text-[#101725] dark:text-white border-b-2 border-[#EAB308]'
                  : 'text-[#6F83A7] dark:text-[#57ACAF] hover:text-[#101725] dark:hover:text-[#EAB308]'
              }`}
            >
              All News
            </button>
            
            {user && (
              <button
                onClick={() => setActiveFilter('for-you')}
                className={`uppercase text-xs tracking-widest px-4 py-2 transition-all flex items-center gap-1 ${
                  activeFilter === 'for-you'
                    ? 'text-[#101725] dark:text-[#EAB308] border-b-2 border-[#57ACAF] dark:border-[#EAB308]'
                    : 'text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308]'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                For You
              </button>
            )}

            {userPreferences?.interests?.map((interest: string) => (
              <button
                key={interest}
                onClick={() => setActiveFilter(interest)}
                className={`uppercase text-xs tracking-widest px-4 py-2 transition-all ${
                  activeFilter === interest
                    ? 'text-[#101725] dark:text-[#EAB308] border-b-2 border-[#6F83A7] dark:border-[#EAB308]'
                    : 'text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308]'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Lead Story */}
        {regularArticles.length > 0 ? (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 pb-12 border-b-2 border-gray-200 dark:border-gray-700 transition-colors"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="relative overflow-hidden group">
                <img
                  src={regularArticles[0].image}
                  alt={regularArticles[0].title}
                  className="w-full aspect-[4/3] object-cover grayscale-[20%] dark:grayscale-[40%] group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <span className="text-white text-xs uppercase tracking-wider">
                    {regularArticles[0].category}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider mb-3 transition-all">
                  <span className="px-3 py-1 bg-[#EAB308] text-white dark:text-[#101725] transition-all shadow-md dark:shadow-[#EAB308]/30">Breaking</span>
                  <Clock className="w-3 h-3" />
                  <span>{regularArticles[0].time}</span>
                </div>
                
                <h2 
                  onClick={() => onReadStory?.(regularArticles[0].id)}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#101725] dark:text-[#F9FAFB] mb-3 sm:mb-4 leading-tight transition-all cursor-pointer hover:text-[#EAB308] dark:hover:text-[#EAB308]" 
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {regularArticles[0].title}
                </h2>
                
                <p className="text-base sm:text-lg text-[#6F83A7] dark:text-[#9BA5B7] leading-relaxed mb-3 sm:mb-4 transition-all">
                  {regularArticles[0].summary}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 transition-all">
                  <span className="text-sm text-[#6F83A7] dark:text-[#9BA5B7] italic transition-all">{regularArticles[0].source}</span>
                  <button 
                    onClick={() => onReadStory?.(regularArticles[0].id)}
                    className="text-[#101725] dark:text-[#EAB308] hover:text-[#EAB308] dark:hover:text-white transition-all text-sm uppercase tracking-wider"
                  >
                    Continue Reading →
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#6F83A7] dark:text-[#9BA5B7]">No articles found. Try a different filter.</p>
          </div>
        )}

        {/* Three Column Layout - Newspaper Style */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column */}
          <div className="space-y-8">
            {regularArticles.slice(1, 4).map((article, idx) => (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="border-b border-gray-200 pb-6"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full aspect-[16/9] object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500 mb-3 cursor-pointer"
                  onClick={() => onReadStory?.(article.id)}
                />
                
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className="text-[10px] uppercase tracking-widest px-2 py-1 text-white"
                    style={{ backgroundColor: article.categoryColor }}
                  >
                    {article.category}
                  </span>
                  <span className="text-xs text-[#6F83A7] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.time}
                  </span>
                </div>
                
                <h3 
                  onClick={() => onReadStory?.(article.id)}
                  className="text-xl text-[#101725] dark:text-[#F9FAFB] mb-2 leading-tight hover:text-[#EAB308] dark:hover:text-[#EAB308] transition-colors cursor-pointer" 
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {article.title}
                </h3>
                
                <p className="text-sm text-[#6F83A7] leading-relaxed line-clamp-3 mb-2">
                  {article.summary}
                </p>
                
                <p className="text-xs text-[#6F83A7] italic">{article.source}</p>
              </motion.article>
            ))}
          </div>

          {/* Middle Column */}
          <div className="space-y-8">
            {regularArticles.slice(4, 7).map((article, idx) => (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="border-b border-gray-200 pb-6"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full aspect-[16/9] object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500 mb-3 cursor-pointer"
                  onClick={() => onReadStory?.(article.id)}
                />
                
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className="text-[10px] uppercase tracking-widest px-2 py-1 text-white"
                    style={{ backgroundColor: article.categoryColor }}
                  >
                    {article.category}
                  </span>
                  <span className="text-xs text-[#6F83A7] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.time}
                  </span>
                </div>
                
                <h3 
                  onClick={() => onReadStory?.(article.id)}
                  className="text-xl text-[#101725] dark:text-[#F9FAFB] mb-2 leading-tight hover:text-[#EAB308] dark:hover:text-[#EAB308] transition-colors cursor-pointer" 
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {article.title}
                </h3>
                
                <p className="text-sm text-[#6F83A7] leading-relaxed line-clamp-3 mb-2">
                  {article.summary}
                </p>
                
                <p className="text-xs text-[#6F83A7] italic">{article.source}</p>
              </motion.article>
            ))}
          </div>

          {/* Right Column - AI Insights Sidebar */}
          <div className="lg:border-l-2 lg:border-[#EAB308] lg:pl-8">
            <div className="sticky top-24">
              <div className="mb-6 pb-4 border-b-2 border-[#EAB308]">
                <h3 className="text-2xl text-[#101725] dark:text-[#F9FAFB] flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                  AI Insights
                </h3>
                <p className="text-xs text-[#6F83A7] uppercase tracking-wider mt-1">Powered by FabricXAI</p>
              </div>

              <div className="space-y-6">
                {aiInsights.map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-[#EAB308]/10 to-[#57ACAF]/10 border-l-4 border-[#EAB308] p-4"
                  >
                    <div className="flex gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-1" />
                      <p className="text-sm text-[#101725] dark:text-[#F9FAFB] leading-relaxed italic">
                        "{insight.aiInsightText}"
                      </p>
                    </div>
                    <p className="text-xs text-[#6F83A7] text-right">— MARBIM AI</p>
                  </motion.div>
                ))}

                {/* Additional sidebar content */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm uppercase tracking-wider text-[#101725] mb-4">Today's Market</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6F83A7]">Cotton Index</span>
                      <span className="text-green-600">+2.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6F83A7]">BDT/USD</span>
                      <span className="text-red-600">-0.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6F83A7]">Export Volume</span>
                      <span className="text-green-600">+5.1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stories - List Style */}
        {regularArticles.slice(7).length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-8 border-t-2 border-gray-200"
          >
            <h3 className="text-2xl text-[#101725] dark:text-[#F9FAFB] mb-6 pb-2 border-b border-gray-200" style={{ fontFamily: 'Georgia, serif' }}>
              More Stories
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {regularArticles.slice(7).map((article, idx) => (
                <article key={idx} className="flex gap-4 pb-4 border-b border-gray-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-24 h-24 object-cover grayscale-[20%] hover:grayscale-0 transition-all flex-shrink-0 cursor-pointer"
                    onClick={() => onReadStory?.(article.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="text-[9px] uppercase tracking-widest px-2 py-0.5 text-white"
                        style={{ backgroundColor: article.categoryColor }}
                      >
                        {article.category}
                      </span>
                      <span className="text-xs text-[#6F83A7]">{article.time}</span>
                    </div>
                    <h4 
                      onClick={() => onReadStory?.(article.id)}
                      className="text-base text-[#101725] dark:text-[#F9FAFB] leading-tight hover:text-[#EAB308] dark:hover:text-[#EAB308] transition-colors cursor-pointer mb-1" 
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {article.title}
                    </h4>
                    <p className="text-xs text-[#6F83A7] italic">{article.source}</p>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
