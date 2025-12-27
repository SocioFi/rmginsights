import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Factory, DollarSign, Clock, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MarketCopilot } from '../components/MarketCopilot';
import { BusinessCopilot } from '../components/BusinessCopilot';
import { IndustryCopilot } from '../components/IndustryCopilot';

interface CategoryPageProps {
  user: any;
  category: 'business' | 'industry' | 'markets';
  onLoginClick: () => void;
  onPersonalizeClick: () => void;
  onLogout: () => void;
  onBack: () => void;
  onReadStory: (storyId: string) => void;
  onNavigateHome: () => void;
  onNavigateBusiness: () => void;
  onNavigateIndustry: () => void;
  onNavigateMarkets: () => void;
  onUpgradeClick?: () => void;
  onNavigatePrivacy?: () => void;
  onNavigateTerms?: () => void;
}

export function CategoryPage({ 
  user, 
  category, 
  onLoginClick, 
  onPersonalizeClick, 
  onLogout, 
  onBack,
  onReadStory,
  onNavigateHome,
  onNavigateBusiness,
  onNavigateIndustry,
  onNavigateMarkets,
  onUpgradeClick = () => alert('Premium subscription coming soon! Contact FabricXAI for early access.'),
  onNavigatePrivacy,
  onNavigateTerms
}: CategoryPageProps) {
  
  // Category configuration
  const categoryConfig = {
    business: {
      title: 'Business',
      subtitle: 'Latest business news, strategies, and market analysis',
      icon: TrendingUp,
      color: '#EAB308',
      articles: [
        {
          id: 'bus1',
          title: 'Bangladesh RMG Exports Hit Record $47.4 Billion in 2024',
          excerpt: 'Export earnings from the ready-made garment sector reached an all-time high, driven by strong demand from US and European markets despite global economic headwinds.',
          category: 'Export Growth',
          date: '3 hours ago',
          readTime: '6 min read',
          image: 'business-growth'
        },
        {
          id: 'bus2',
          title: 'Major Buying Houses Shift Focus to Sustainability Compliance',
          excerpt: 'Leading international buying houses announce new sustainability requirements for RMG suppliers, emphasizing carbon neutrality and circular fashion initiatives.',
          category: 'Supply Chain',
          date: '5 hours ago',
          readTime: '4 min read',
          image: 'sustainability'
        },
        {
          id: 'bus3',
          title: 'SME Garment Manufacturers Secure $120M Investment Fund',
          excerpt: 'New financing initiative aims to help small and medium enterprises upgrade machinery, improve working conditions, and meet international compliance standards.',
          category: 'Investment',
          date: '8 hours ago',
          readTime: '5 min read',
          image: 'investment'
        },
        {
          id: 'bus4',
          title: 'E-commerce Boom Drives Direct-to-Consumer Garment Sales',
          excerpt: 'Bangladesh manufacturers explore direct-to-consumer models as global e-commerce platforms open new revenue streams beyond traditional wholesale.',
          category: 'Digital Commerce',
          date: '1 day ago',
          readTime: '7 min read',
          image: 'ecommerce'
        }
      ]
    },
    industry: {
      title: 'Industry',
      subtitle: 'Manufacturing insights, innovation, and operational excellence',
      icon: Factory,
      color: '#57ACAF',
      articles: [
        {
          id: 'ind1',
          title: 'Revolutionary AI System MARBIM Transforms Manufacturing',
          excerpt: 'FabricXAI launches groundbreaking agentic AI designed to optimize workflows, predict delays, and enhance buyer-supplier collaboration across the RMG sector.',
          category: 'Technology',
          date: '2 hours ago',
          readTime: '5 min read',
          image: 'ai-tech'
        },
        {
          id: 'ind2',
          title: 'Zero Liquid Discharge Systems Gain Momentum in Textile Mills',
          excerpt: 'Advanced water treatment technology enables factories to recycle 95% of water, meeting stringent environmental regulations while reducing operational costs.',
          category: 'Sustainability',
          date: '6 hours ago',
          readTime: '6 min read',
          image: 'water-treatment'
        },
        {
          id: 'ind3',
          title: 'Automated Cutting Systems Boost Production Efficiency by 40%',
          excerpt: 'Latest generation of AI-powered fabric cutting machines reduce waste, improve precision, and accelerate production timelines for export-oriented factories.',
          category: 'Automation',
          date: '10 hours ago',
          readTime: '4 min read',
          image: 'automation'
        },
        {
          id: 'ind4',
          title: 'Worker Training Programs Focus on Digital Skills Development',
          excerpt: 'Industry-wide initiative aims to upskill 50,000 garment workers in digital technologies, quality control systems, and advanced manufacturing processes.',
          category: 'Workforce',
          date: '1 day ago',
          readTime: '5 min read',
          image: 'training'
        }
      ]
    },
    markets: {
      title: 'Markets',
      subtitle: 'Global trade trends, pricing analysis, and economic indicators',
      icon: DollarSign,
      color: '#6F83A7',
      articles: [
        {
          id: 'mkt1',
          title: 'Cotton Prices Stabilize After Three-Month Volatility Period',
          excerpt: 'Global cotton markets show signs of stability as supply chain disruptions ease and major producing countries report improved harvest projections.',
          category: 'Commodities',
          date: '4 hours ago',
          readTime: '5 min read',
          image: 'cotton-market'
        },
        {
          id: 'mkt2',
          title: 'US Market Share for Bangladesh RMG Reaches 28-Year High',
          excerpt: 'Trade data reveals Bangladesh captured 9.2% of US apparel imports, surpassing Vietnam and positioning as second-largest supplier after China.',
          category: 'Trade Data',
          date: '7 hours ago',
          readTime: '6 min read',
          image: 'trade-growth'
        },
        {
          id: 'mkt3',
          title: 'European Buyers Increase Orders for Summer 2025 Collections',
          excerpt: 'Major European retailers place early orders for summer collections, signaling confidence in consumer demand and Bangladesh manufacturing capabilities.',
          category: 'Demand Forecast',
          date: '12 hours ago',
          readTime: '4 min read',
          image: 'retail-demand'
        },
        {
          id: 'mkt4',
          title: 'Synthetic Fiber Prices Drop 15% Amid Global Oversupply',
          excerpt: 'Polyester and nylon prices decline as production capacity outpaces demand, offering cost relief for manufacturers but raising sustainability concerns.',
          category: 'Materials',
          date: '1 day ago',
          readTime: '5 min read',
          image: 'synthetic-fiber'
        }
      ]
    }
  };

  const config = categoryConfig[category];
  const CategoryIcon = config.icon;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white dark:bg-gradient-to-br dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] transition-all duration-300">
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

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-gray-50 to-white dark:from-[#0a0e1a] dark:to-[#101725] border-b-4 border-[#101725] dark:border-[#EAB308] transition-all">
        <div className="container mx-auto px-4 max-w-7xl">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-6 text-[#6F83A7] dark:text-[#57ACAF] hover:text-[#101725] dark:hover:text-[#EAB308] hover:bg-gray-100 dark:hover:bg-[#182336] transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-16 h-16 flex items-center justify-center border-4 transition-all"
              style={{ 
                borderColor: config.color,
                backgroundColor: `${config.color}20`
              }}
            >
              <CategoryIcon className="w-8 h-8" style={{ color: config.color }} />
            </div>
            <div>
              <h1 
                className="text-4xl md:text-5xl text-[#101725] dark:text-white mb-2 transition-all"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {config.title}
              </h1>
              <p className="text-[#6F83A7] dark:text-[#9BA5B7] text-lg transition-all">
                {config.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-[#6F83A7] dark:text-[#9BA5B7]">
              <Clock className="w-4 h-4" />
              <span>Updated hourly</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6F83A7] dark:text-[#9BA5B7]">
              <Calendar className="w-4 h-4" />
              <span>Latest stories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* AI Copilots - Category-specific */}
          {category === 'business' && (
            <BusinessCopilot 
              user={user} 
              onUpgradeClick={onUpgradeClick}
            />
          )}
          
          {category === 'industry' && (
            <IndustryCopilot 
              user={user} 
              onUpgradeClick={onUpgradeClick}
            />
          )}
          
          {category === 'markets' && (
            <MarketCopilot 
              user={user} 
              onUpgradeClick={onUpgradeClick}
            />
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {config.articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-2 border-[#101725] dark:border-[#EAB308] bg-white dark:bg-gradient-to-br dark:from-[#101725] dark:to-[#182336] overflow-hidden hover:shadow-2xl dark:hover:shadow-[#EAB308]/20 transition-all cursor-pointer group"
                onClick={() => onReadStory(article.id)}
              >
                {/* Category Badge */}
                <div className="p-6 pb-4">
                  <Badge 
                    className="border-2 rounded-none uppercase tracking-wider text-xs transition-all"
                    style={{ 
                      borderColor: config.color,
                      color: config.color,
                      backgroundColor: 'transparent'
                    }}
                  >
                    {article.category}
                  </Badge>
                </div>

                {/* Article Content */}
                <div className="px-6 pb-6">
                  <h3 
                    className="text-2xl text-[#101725] dark:text-white mb-3 group-hover:text-[#EAB308] dark:group-hover:text-[#EAB308] transition-colors leading-tight"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {article.title}
                  </h3>
                  
                  <p className="text-[#6F83A7] dark:text-[#9BA5B7] mb-4 leading-relaxed transition-all">
                    {article.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Bottom Border Accent */}
                <div 
                  className="h-1 w-full transition-all" 
                  style={{ backgroundColor: config.color }}
                />
              </motion.article>
            ))}
          </div>

          {/* Load More Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Button
              className="bg-[#101725] dark:bg-gradient-to-r dark:from-[#EAB308] dark:to-[#F59E0B] hover:bg-[#EAB308] dark:hover:from-[#101725] dark:hover:to-[#101725] text-white hover:text-[#101725] dark:text-[#101725] dark:hover:text-white rounded-none px-12 py-6 uppercase tracking-widest text-sm transition-all shadow-md dark:shadow-[#EAB308]/30"
            >
              Load More Stories
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer onNavigatePrivacy={onNavigatePrivacy} onNavigateTerms={onNavigateTerms} />
    </div>
  );
}
