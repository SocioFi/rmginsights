import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  BookmarkCheck, 
  Search, 
  Trash2, 
  Calendar,
  Tag,
  Filter,
  SortAsc,
  ExternalLink,
  BookmarkX,
  Sparkles,
  Clock
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface SavedArticlesPageProps {
  user: any | null;
  onLoginClick: () => void;
  onPersonalizeClick: () => void;
  onLogout: () => void;
  onNavigateHome?: () => void;
  onNavigateBusiness?: () => void;
  onNavigateIndustry?: () => void;
  onNavigateMarkets?: () => void;
  onReadStory?: (storyId: string) => void;
  onNavigatePrivacy?: () => void;
  onNavigateTerms?: () => void;
}

interface SavedArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  savedDate: string;
  readTime: string;
  tags: string[];
  image?: string;
}

// Mock data - replace with actual data from backend
const mockSavedArticles: SavedArticle[] = [
  {
    id: '1',
    title: 'Bangladesh RMG Sector Adopts AI-Powered Quality Control Systems',
    subtitle: 'Major factories implement machine learning for defect detection',
    category: 'Technology',
    savedDate: '2025-11-02',
    readTime: '5 min read',
    tags: ['AI', 'Quality Control', 'Innovation'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'
  },
  {
    id: '2',
    title: 'European Buyers Increase Sustainable Sourcing from Bangladesh',
    subtitle: 'New trade agreements focus on eco-friendly manufacturing',
    category: 'Markets',
    savedDate: '2025-11-01',
    readTime: '7 min read',
    tags: ['Sustainability', 'Export', 'Europe'],
    image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400'
  },
  {
    id: '3',
    title: 'Minimum Wage Negotiations Enter Final Phase',
    subtitle: 'Factory owners and labor representatives seek consensus',
    category: 'Policy',
    savedDate: '2025-10-30',
    readTime: '6 min read',
    tags: ['Labor', 'Policy', 'Wages'],
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400'
  },
  {
    id: '4',
    title: 'Digital Payment Systems Streamline Garment Supply Chain',
    subtitle: 'Fintech solutions reduce transaction costs by 30%',
    category: 'Business',
    savedDate: '2025-10-28',
    readTime: '4 min read',
    tags: ['Fintech', 'Supply Chain', 'Digital'],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400'
  },
  {
    id: '5',
    title: 'Bangladesh Garment Exports Reach Record $45 Billion',
    subtitle: 'Industry achieves 12% growth despite global economic headwinds',
    category: 'Markets',
    savedDate: '2025-10-25',
    readTime: '8 min read',
    tags: ['Export', 'Growth', 'Statistics'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400'
  }
];

export function SavedArticlesPage({
  user,
  onLoginClick,
  onPersonalizeClick,
  onLogout,
  onNavigateHome,
  onNavigateBusiness,
  onNavigateIndustry,
  onNavigateMarkets,
  onReadStory,
  onNavigatePrivacy,
  onNavigateTerms
}: SavedArticlesPageProps) {
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>(mockSavedArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title'>('recent');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(savedArticles.map(a => a.category)))];

  const filteredArticles = savedArticles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
      if (sortBy === 'oldest') return new Date(a.savedDate).getTime() - new Date(b.savedDate).getTime();
      return a.title.localeCompare(b.title);
    });

  const handleRemoveArticle = (articleId: string) => {
    setSavedArticles(prev => prev.filter(a => a.id !== articleId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white dark:bg-[#0a0e1a] transition-colors duration-300">
      <Header
        user={user}
        onLoginClick={onLoginClick}
        onPersonalizeClick={onPersonalizeClick}
        onLogout={onLogout}
        onNavigateHome={onNavigateHome}
        onNavigateBusiness={onNavigateBusiness}
        onNavigateIndustry={onNavigateIndustry}
        onNavigateMarkets={onNavigateMarkets}
      />

      <main className="container mx-auto px-4 max-w-7xl pt-24 pb-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#57ACAF] to-[#6F83A7] dark:from-[#EAB308] dark:to-[#F59E0B] rounded flex items-center justify-center">
              <BookmarkCheck className="w-6 h-6 text-white dark:text-[#101725]" />
            </div>
            <div>
              <h1 
                className="text-[#101725] dark:text-white text-3xl sm:text-4xl transition-colors" 
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Saved Articles
              </h1>
              <p className="text-[#6F83A7] dark:text-[#57ACAF] text-sm mt-1">
                Your personal reading collection
              </p>
            </div>
          </div>

          <Separator className="bg-[#E5E7EB] dark:bg-[#6F83A7]/30" />
        </motion.div>

        {/* Stats & Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB] dark:from-[#182336] dark:to-[#101725] border-2 border-[#101725] dark:border-[#EAB308] p-6 rounded-none">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              {/* Stats */}
              <div className="flex items-center gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BookmarkCheck className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-2xl text-[#101725] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                      {filteredArticles.length}
                    </span>
                  </div>
                  <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider">
                    {filteredArticles.length === savedArticles.length ? 'Total Saved' : 'Filtered'}
                  </p>
                </div>
                
                {user?.user_metadata?.aiLearningEnabled && (
                  <div className="h-12 w-px bg-[#E5E7EB] dark:bg-[#6F83A7]" />
                )}
                
                {user?.user_metadata?.aiLearningEnabled && (
                  <div className="flex items-center gap-2 bg-[#EAB308]/10 dark:bg-[#EAB308]/20 px-3 py-2 border border-[#EAB308]/30">
                    <Sparkles className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-xs text-[#101725] dark:text-[#E5E7EB]">
                      AI Learning Active
                    </span>
                  </div>
                )}
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:max-w-2xl">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                  <Input
                    type="text"
                    placeholder="Search saved articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308] bg-white dark:bg-[#182336]"
                  />
                </div>

                {/* Category Filter */}
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-40 border-2 border-[#E5E7EB] dark:border-[#6F83A7] bg-white dark:bg-[#182336]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
                  <SelectTrigger className="w-full sm:w-40 border-2 border-[#E5E7EB] dark:border-[#6F83A7] bg-white dark:bg-[#182336]">
                    <SortAsc className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="title">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Articles Grid */}
        <AnimatePresence mode="popLayout">
          {filteredArticles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F3F4F6] dark:bg-[#182336] border-2 border-[#E5E7EB] dark:border-[#6F83A7] rounded-full mb-6">
                <BookmarkX className="w-10 h-10 text-[#6F83A7] dark:text-[#9BA5B7]" />
              </div>
              <h3 
                className="text-[#101725] dark:text-white text-2xl mb-2" 
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {searchQuery || filterCategory !== 'all' ? 'No articles found' : 'No saved articles yet'}
              </h3>
              <p className="text-[#6F83A7] dark:text-[#9BA5B7] mb-8 max-w-md mx-auto">
                {searchQuery || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Start bookmarking articles to build your personal collection'}
              </p>
              {!searchQuery && filterCategory === 'all' && (
                <Button
                  onClick={onNavigateHome}
                  className="bg-[#101725] dark:bg-[#EAB308] hover:bg-[#EAB308] dark:hover:bg-[#101725] text-white dark:text-[#101725] hover:text-[#101725] dark:hover:text-white px-6 py-2 uppercase tracking-wider transition-all"
                >
                  Browse Articles
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white dark:bg-[#182336] border-2 border-[#E5E7EB] dark:border-[#6F83A7] hover:border-[#57ACAF] dark:hover:border-[#EAB308] transition-all duration-300 overflow-hidden"
                >
                  {/* Article Image */}
                  {article.image && (
                    <div className="relative h-48 overflow-hidden bg-[#F3F4F6] dark:bg-[#101725]">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-[#101725] dark:bg-[#EAB308] text-white dark:text-[#101725] border-0">
                          {article.category}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="p-5">
                    {/* Metadata */}
                    <div className="flex items-center gap-4 mb-3 text-xs text-[#6F83A7] dark:text-[#9BA5B7]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(article.savedDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 
                      className="text-[#101725] dark:text-white mb-2 line-clamp-2 group-hover:text-[#57ACAF] dark:group-hover:text-[#EAB308] transition-colors cursor-pointer" 
                      style={{ fontFamily: 'Georgia, serif' }}
                      onClick={() => onReadStory?.(article.id)}
                    >
                      {article.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-[#6F83A7] dark:text-[#9BA5B7] text-sm mb-4 line-clamp-2">
                      {article.subtitle}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-xs bg-[#F3F4F6] dark:bg-[#101725] text-[#6F83A7] dark:text-[#9BA5B7] px-2 py-1 border border-[#E5E7EB] dark:border-[#6F83A7]/30"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => onReadStory?.(article.id)}
                        className="flex-1 bg-[#57ACAF] hover:bg-[#101725] dark:bg-[#EAB308] dark:hover:bg-[#57ACAF] text-white dark:text-[#101725] dark:hover:text-white px-4 py-2 text-xs uppercase tracking-wider transition-all group"
                      >
                        <span>Read</span>
                        <ExternalLink className="w-3 h-3 ml-2 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                      <Button
                        onClick={() => handleRemoveArticle(article.id)}
                        variant="outline"
                        className="border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-2 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer onNavigatePrivacy={onNavigatePrivacy} onNavigateTerms={onNavigateTerms} />
    </div>
  );
}
