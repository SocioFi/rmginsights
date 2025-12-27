import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  History, 
  Search, 
  Trash2, 
  Calendar,
  Clock,
  Filter,
  SortAsc,
  ExternalLink,
  TrendingUp,
  BookOpen,
  Sparkles,
  BarChart3,
  Eye
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';

interface ReadingHistoryPageProps {
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

interface ReadingHistoryItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readDate: string;
  readTime: string;
  completionPercentage: number;
  image?: string;
}

// Mock data - replace with actual data from backend
const mockReadingHistory: ReadingHistoryItem[] = [
  {
    id: '1',
    title: 'Bangladesh RMG Sector Adopts AI-Powered Quality Control Systems',
    subtitle: 'Major factories implement machine learning for defect detection',
    category: 'Technology',
    readDate: '2025-11-03T10:30:00',
    readTime: '5 min',
    completionPercentage: 100,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'
  },
  {
    id: '2',
    title: 'European Buyers Increase Sustainable Sourcing from Bangladesh',
    subtitle: 'New trade agreements focus on eco-friendly manufacturing',
    category: 'Markets',
    readDate: '2025-11-02T15:45:00',
    readTime: '7 min',
    completionPercentage: 65,
    image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400'
  },
  {
    id: '3',
    title: 'Minimum Wage Negotiations Enter Final Phase',
    subtitle: 'Factory owners and labor representatives seek consensus',
    category: 'Policy',
    readDate: '2025-11-01T09:15:00',
    readTime: '6 min',
    completionPercentage: 100,
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400'
  },
  {
    id: '4',
    title: 'Digital Payment Systems Streamline Garment Supply Chain',
    subtitle: 'Fintech solutions reduce transaction costs by 30%',
    category: 'Business',
    readDate: '2025-10-31T14:20:00',
    readTime: '4 min',
    completionPercentage: 45,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400'
  },
  {
    id: '5',
    title: 'Bangladesh Garment Exports Reach Record $45 Billion',
    subtitle: 'Industry achieves 12% growth despite global economic headwinds',
    category: 'Markets',
    readDate: '2025-10-30T11:00:00',
    readTime: '8 min',
    completionPercentage: 100,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400'
  },
  {
    id: '6',
    title: 'Smart Factories Transform Bangladesh Textile Industry',
    subtitle: 'IoT integration improves efficiency by 40%',
    category: 'Technology',
    readDate: '2025-10-29T16:30:00',
    readTime: '6 min',
    completionPercentage: 80,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'
  },
  {
    id: '7',
    title: 'Compliance Standards Updated for 2025',
    subtitle: 'New safety protocols mandatory from January',
    category: 'Policy',
    readDate: '2025-10-28T08:45:00',
    readTime: '5 min',
    completionPercentage: 100,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400'
  },
  {
    id: '8',
    title: 'Sustainable Fashion Trends Reshape Production',
    subtitle: 'Eco-conscious buyers drive demand for green manufacturing',
    category: 'Industry',
    readDate: '2025-10-27T13:15:00',
    readTime: '7 min',
    completionPercentage: 55,
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea825c92?w=400'
  }
];

export function ReadingHistoryPage({
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
}: ReadingHistoryPageProps) {
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>(mockReadingHistory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title'>('recent');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCompletion, setFilterCompletion] = useState<'all' | 'completed' | 'partial'>('all');

  const categories = ['all', ...Array.from(new Set(readingHistory.map(a => a.category)))];

  const filteredHistory = readingHistory
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesCompletion = filterCompletion === 'all' || 
                                (filterCompletion === 'completed' && item.completionPercentage === 100) ||
                                (filterCompletion === 'partial' && item.completionPercentage < 100);
      return matchesSearch && matchesCategory && matchesCompletion;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.readDate).getTime() - new Date(a.readDate).getTime();
      if (sortBy === 'oldest') return new Date(a.readDate).getTime() - new Date(b.readDate).getTime();
      return a.title.localeCompare(b.title);
    });

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your reading history? This action cannot be undone.')) {
      setReadingHistory([]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setReadingHistory(prev => prev.filter(item => item.id !== itemId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calculate stats
  const totalArticles = readingHistory.length;
  const completedArticles = readingHistory.filter(item => item.completionPercentage === 100).length;
  const totalReadTime = readingHistory.reduce((acc, item) => {
    const minutes = parseInt(item.readTime);
    return acc + (isNaN(minutes) ? 0 : minutes);
  }, 0);
  const avgCompletion = totalArticles > 0 
    ? Math.round(readingHistory.reduce((acc, item) => acc + item.completionPercentage, 0) / totalArticles)
    : 0;

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6F83A7] to-[#57ACAF] dark:from-[#EAB308] dark:to-[#F59E0B] rounded flex items-center justify-center">
                <History className="w-6 h-6 text-white dark:text-[#101725]" />
              </div>
              <div>
                <h1 
                  className="text-[#101725] dark:text-white text-3xl sm:text-4xl transition-colors" 
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Reading History
                </h1>
                <p className="text-[#6F83A7] dark:text-[#57ACAF] text-sm mt-1">
                  Track your reading journey
                </p>
              </div>
            </div>

            {readingHistory.length > 0 && (
              <Button
                onClick={handleClearHistory}
                variant="outline"
                className="border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-600 dark:text-red-400 hidden sm:flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </Button>
            )}
          </div>

          <Separator className="bg-[#E5E7EB] dark:bg-[#6F83A7]/30" />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#F59E0B]/10 dark:from-[#EAB308]/20 dark:to-[#F59E0B]/20 border-2 border-[#EAB308]/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-[#EAB308]" />
              <span className="text-2xl text-[#101725] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                {totalArticles}
              </span>
            </div>
            <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider">
              Articles Read
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#6F83A7]/10 dark:from-[#57ACAF]/20 dark:to-[#6F83A7]/20 border-2 border-[#57ACAF]/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
              <span className="text-2xl text-[#101725] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                {completedArticles}
              </span>
            </div>
            <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider">
              Completed
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#6F83A7]/10 to-[#101725]/10 dark:from-[#6F83A7]/20 dark:to-[#101725]/20 border-2 border-[#6F83A7]/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-[#6F83A7]" />
              <span className="text-2xl text-[#101725] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                {totalReadTime}
              </span>
            </div>
            <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider">
              Minutes Read
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border-2 border-green-500/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-2xl text-[#101725] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                {avgCompletion}%
              </span>
            </div>
            <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider">
              Avg Completion
            </p>
          </div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB] dark:from-[#182336] dark:to-[#101725] border-2 border-[#101725] dark:border-[#EAB308] p-6 rounded-none">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                <Input
                  type="text"
                  placeholder="Search reading history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308] bg-white dark:bg-[#182336]"
                />
              </div>

              {/* Category Filter */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full lg:w-48 border-2 border-[#E5E7EB] dark:border-[#6F83A7] bg-white dark:bg-[#182336]">
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

              {/* Completion Filter */}
              <Select value={filterCompletion} onValueChange={(val) => setFilterCompletion(val as any)}>
                <SelectTrigger className="w-full lg:w-48 border-2 border-[#E5E7EB] dark:border-[#6F83A7] bg-white dark:bg-[#182336]">
                  <Eye className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Articles</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="partial">Partially Read</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
                <SelectTrigger className="w-full lg:w-40 border-2 border-[#E5E7EB] dark:border-[#6F83A7] bg-white dark:bg-[#182336]">
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

            {user?.user_metadata?.aiLearningEnabled && (
              <div className="flex items-center gap-2 bg-[#EAB308]/10 dark:bg-[#EAB308]/20 px-3 py-2 border border-[#EAB308]/30 mt-4">
                <Sparkles className="w-4 h-4 text-[#EAB308]" />
                <span className="text-xs text-[#101725] dark:text-[#E5E7EB]">
                  Your reading patterns help FabricXAI personalize your feed
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* History List */}
        <AnimatePresence mode="popLayout">
          {filteredHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F3F4F6] dark:bg-[#182336] border-2 border-[#E5E7EB] dark:border-[#6F83A7] rounded-full mb-6">
                <History className="w-10 h-10 text-[#6F83A7] dark:text-[#9BA5B7]" />
              </div>
              <h3 
                className="text-[#101725] dark:text-white text-2xl mb-2" 
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {searchQuery || filterCategory !== 'all' || filterCompletion !== 'all' 
                  ? 'No articles found' 
                  : 'No reading history yet'}
              </h3>
              <p className="text-[#6F83A7] dark:text-[#9BA5B7] mb-8 max-w-md mx-auto">
                {searchQuery || filterCategory !== 'all' || filterCompletion !== 'all'
                  ? 'Try adjusting your search or filters' 
                  : 'Start reading articles to build your history'}
              </p>
              {!searchQuery && filterCategory === 'all' && filterCompletion === 'all' && (
                <Button
                  onClick={onNavigateHome}
                  className="bg-[#101725] dark:bg-[#EAB308] hover:bg-[#EAB308] dark:hover:bg-[#101725] text-white dark:text-[#101725] hover:text-[#101725] dark:hover:text-white px-6 py-2 uppercase tracking-wider transition-all"
                >
                  Browse Articles
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                  className="group bg-white dark:bg-[#182336] border-2 border-[#E5E7EB] dark:border-[#6F83A7] hover:border-[#57ACAF] dark:hover:border-[#EAB308] transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
                    {/* Thumbnail */}
                    {item.image && (
                      <div className="relative w-full sm:w-40 h-32 sm:h-28 overflow-hidden bg-[#F3F4F6] dark:bg-[#101725] flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <Badge className="absolute top-2 left-2 bg-[#101725] dark:bg-[#EAB308] text-white dark:text-[#101725] border-0 text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-3 mb-2 text-xs text-[#6F83A7] dark:text-[#9BA5B7]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(item.readDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.readTime}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            item.completionPercentage === 100 
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30'
                              : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30'
                          }`}
                        >
                          {item.completionPercentage}% read
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 
                        className="text-[#101725] dark:text-white mb-2 line-clamp-2 group-hover:text-[#57ACAF] dark:group-hover:text-[#EAB308] transition-colors cursor-pointer" 
                        style={{ fontFamily: 'Georgia, serif' }}
                        onClick={() => onReadStory?.(item.id)}
                      >
                        {item.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-[#6F83A7] dark:text-[#9BA5B7] text-sm mb-3 line-clamp-1">
                        {item.subtitle}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <Progress 
                          value={item.completionPercentage} 
                          className="h-1.5 bg-[#E5E7EB] dark:bg-[#101725]"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => onReadStory?.(item.id)}
                          className="bg-[#57ACAF] hover:bg-[#101725] dark:bg-[#EAB308] dark:hover:bg-[#57ACAF] text-white dark:text-[#101725] dark:hover:text-white px-4 py-1.5 text-xs uppercase tracking-wider transition-all group/btn"
                        >
                          <span>{item.completionPercentage === 100 ? 'Read Again' : 'Continue Reading'}</span>
                          <ExternalLink className="w-3 h-3 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Button>
                        <Button
                          onClick={() => handleRemoveItem(item.id)}
                          variant="outline"
                          size="sm"
                          className="border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1.5 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
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
