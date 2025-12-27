import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  MessageSquare,
  ExternalLink,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  BookmarkCheck,
  Send,
  Loader2,
  CheckCircle2,
  FileText,
  Brain,
  Tag,
  Volume2,
  VolumeX,
  Pause,
  Play,
  BookOpen
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SocialShareModal } from '../components/SocialShareModal';

interface StoryPageProps {
  user: any;
  accessToken: string | null;
  userPreferences: any;
  storyId: string;
  onLoginClick: () => void;
  onPersonalizeClick: () => void;
  onLogout: () => void;
  onBack: () => void;
  onNavigateHome: () => void;
  onNavigateBusiness: () => void;
  onNavigateIndustry: () => void;
  onNavigateMarkets: () => void;
  onNavigateSaved: () => void;
  onNavigateHistory: () => void;
  onNavigatePrivacy?: () => void;
  onNavigateTerms?: () => void;
}

export function StoryPage({ 
  user, 
  accessToken, 
  userPreferences, 
  storyId, 
  onLoginClick, 
  onPersonalizeClick, 
  onLogout, 
  onBack,
  onNavigateHome,
  onNavigateBusiness,
  onNavigateIndustry,
  onNavigateMarkets,
  onNavigateSaved,
  onNavigateHistory,
  onNavigatePrivacy,
  onNavigateTerms
}: StoryPageProps) {

  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([]);
  const [isGeneratingTakeaways, setIsGeneratingTakeaways] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [isGeneratingRewrite, setIsGeneratingRewrite] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
  const [isReadMode, setIsReadMode] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Map profession values to display labels
  const professionLabels: { [key: string]: string } = {
    'factory-owner': 'Factory Owner',
    'merchandiser': 'Merchandiser',
    'buyer': 'Buyer',
    'compliance': 'Compliance Officer',
    'investor': 'Investor',
    'analyst': 'Industry Analyst',
    'production-manager': 'Production Manager',
    'export-manager': 'Export Manager',
    'quality-manager': 'Quality Manager',
    'sourcing-manager': 'Sourcing Manager',
    'supply-chain': 'Supply Chain Manager',
    'designer': 'Fashion Designer',
    'pattern-maker': 'Pattern Maker',
    'textile-engineer': 'Textile Engineer',
    'hr-manager': 'HR Manager',
    'sustainability': 'Sustainability Manager',
    'logistics': 'Logistics Coordinator',
    'marketing': 'Marketing Manager',
    'business-dev': 'Business Development',
    'finance': 'Finance Manager',
    'operations': 'Operations Manager',
    'safety': 'Safety Officer',
    'tech-innovator': 'Technology Innovator',
    'consultant': 'Industry Consultant',
  };

  const userRole = userPreferences?.profession ? professionLabels[userPreferences.profession] || 'Factory Owner' : null;

  // Demo story data
  const story = {
    id: storyId,
    title: "Revolutionary AI System MARBIM Transforms Bangladesh's Garment Manufacturing",
    subtitle: "SocioFi Technology unveils groundbreaking agentic AI designed to optimize workflows, predict delays, and enhance buyer-supplier collaboration across the RMG sector.",
    source: "Textile Today",
    publishedAt: "2 hours ago",
    category: "Technology & Innovation",
    sources: [
      { name: "Textile Today", url: "https://www.textiletoday.com.bd" },
      { name: "The Daily Star", url: "https://www.thedailystar.net" },
      { name: "Dhaka Tribune", url: "https://www.dhakatribune.com" }
    ],
    summary: `FabricXAI, a leading innovator in AI-driven supply chain solutions, has launched MARBIM (Multi-Agent Reasoning for Business Intelligence and Management), a revolutionary agentic AI system specifically designed for Bangladesh's Ready-Made Garments industry. This groundbreaking technology promises to transform how garment manufacturers, buying houses, and suppliers collaborate and operate.

The MARBIM system employs advanced machine learning algorithms to analyze production workflows, predict potential delays, optimize resource allocation, and facilitate seamless communication between buyers and suppliers. Early adopters report up to 35% reduction in lead times and 28% improvement in delivery accuracy.

Key features include real-time production monitoring, predictive maintenance alerts, automated quality control recommendations, and intelligent buyer-supplier matching based on capacity, capabilities, and historical performance data. The system integrates with existing ERP solutions and can be deployed across multiple factory locations.

Industry experts believe MARBIM could set a new standard for digital transformation in the RMG sector, potentially helping Bangladesh maintain its competitive edge in the global apparel market as labor costs rise and sustainability requirements become more stringent.`,
    tags: ["AI", "Technology", "Supply Chain", "Innovation", "Digital Transformation"],
    readTime: "5 min read"
  };

  // Demo: Simulate AI generating takeaways
  const generateKeyTakeaways = async () => {
    if (keyTakeaways.length > 0) return;
    
    setIsGeneratingTakeaways(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Demo takeaways
    const demoTakeaways = [
      "FabricXAI launches MARBIM, an AI system specifically designed for Bangladesh's RMG industry",
      "Early adopters report 35% reduction in lead times and 28% improvement in delivery accuracy",
      "System provides real-time production monitoring and predictive maintenance alerts",
      "MARBIM integrates with existing ERP solutions for seamless deployment",
      "Technology helps Bangladesh maintain competitive edge amid rising labor costs and sustainability requirements"
    ];
    
    setKeyTakeaways(demoTakeaways);
    setIsGeneratingTakeaways(false);
  };

  // Demo: Simulate AI answering questions
  const askAI = async () => {
    if (!aiQuestion.trim()) return;

    setIsAskingAI(true);
    setAiResponse('');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo responses based on question keywords
    const questionLower = aiQuestion.toLowerCase();
    let demoResponse = '';

    if (questionLower.includes('what') && (questionLower.includes('marbim') || questionLower.includes('system'))) {
      demoResponse = `MARBIM (Multi-Agent Reasoning for Business Intelligence and Management) is an advanced agentic AI system developed by FabricXAI specifically for Bangladesh's Ready-Made Garments industry. It uses machine learning algorithms to optimize production workflows, predict delays, and facilitate better collaboration between buyers and suppliers. The system has shown impressive results, with early adopters reporting up to 35% reduction in lead times and 28% improvement in delivery accuracy.`;
    } else if (questionLower.includes('how') && (questionLower.includes('work') || questionLower.includes('function'))) {
      demoResponse = `MARBIM works by integrating with existing ERP systems and analyzing production data in real-time. It employs advanced machine learning to monitor production workflows, predict potential delays before they occur, optimize resource allocation, and provide automated quality control recommendations. The system can be deployed across multiple factory locations and uses intelligent algorithms to match buyers with suppliers based on capacity, capabilities, and historical performance data.`;
    } else if (questionLower.includes('benefit') || questionLower.includes('advantage')) {
      demoResponse = `The key benefits of MARBIM include: (1) Up to 35% reduction in production lead times, (2) 28% improvement in delivery accuracy, (3) Real-time production monitoring and alerts, (4) Predictive maintenance capabilities to prevent equipment failures, (5) Automated quality control recommendations, (6) Intelligent buyer-supplier matching, and (7) Seamless integration with existing systems. These improvements help Bangladesh's RMG industry maintain its competitive edge in the global market.`;
    } else if (questionLower.includes('cost') || questionLower.includes('price')) {
      demoResponse = `The article doesn't specify pricing details for MARBIM. For accurate pricing information and implementation costs, manufacturers would need to contact FabricXAI directly. However, given the reported 35% reduction in lead times and 28% improvement in delivery accuracy, the system likely offers significant ROI for medium to large-scale garment manufacturers.`;
    } else {
      demoResponse = `Based on the article, MARBIM represents a significant advancement in AI-driven manufacturing optimization for Bangladesh's garment industry. The system combines real-time monitoring, predictive analytics, and intelligent automation to help factories improve efficiency, reduce delays, and maintain quality standards. This technology is particularly important as the industry faces rising costs and increasing sustainability requirements from global buyers.`;
    }
    
    setAiResponse(demoResponse);
    setIsAskingAI(false);
    setAiQuestion(''); // Clear the textarea after response
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Save to backend when ready
  };

  // Demo: Generate role-tailored rewritten content
  const generateRoleTailoredVersion = async () => {
    setIsGeneratingRewrite(true);
    setRewrittenContent('');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Demo rewritten content based on user role
    const roleTailoredContent = {
      'Factory Owner': `**AI-Optimized Production: What MARBIM Means for Your Factory**

As a factory owner in Bangladesh's competitive RMG sector, you're constantly balancing production efficiency, quality control, and delivery timelines. FabricXAI's new MARBIM system could be a game-changer for your operations.

**Key Impact on Your Factory:**
MARBIM (Multi-Agent Reasoning for Business Intelligence and Management) is an AI system specifically built for garment manufacturing operations like yours. Early adopters are reporting impressive results: 35% faster production cycles and 28% better on-time delivery rates.

**What This Means for Your Bottom Line:**
The system integrates directly with your existing ERP infrastructure—meaning no need to replace current systems. It monitors your production floor in real-time, predicting equipment failures before they happen and alerting you to potential delays in advance. This proactive approach helps you avoid costly production stoppages and maintain client commitments.

**Resource Optimization:**
MARBIM analyzes your workflow data to optimize resource allocation across production lines. It identifies bottlenecks, suggests reallocation of workers and materials, and helps you maximize capacity utilization without additional capital investment.

**Quality Assurance:**
The AI provides automated quality control recommendations based on pattern recognition across thousands of production runs. This helps maintain consistency and reduces rejection rates from buyers.

**Competitive Advantage:**
With rising labor costs and increasing sustainability requirements from global buyers, MARBIM helps maintain your competitive edge through data-driven efficiency improvements rather than cost-cutting measures that compromise quality or worker welfare.

**Implementation:**
The system can be deployed across multiple factory locations and scaled according to your production volume. Integration with existing systems ensures minimal disruption to current operations.`,

      'Merchandiser': `**MARBIM AI: Streamlining Your Buyer-Supplier Coordination**

As a merchandiser, your success depends on flawless coordination between buyers and suppliers, accurate timeline management, and proactive problem-solving. FabricXAI's MARBIM system is designed to make your job significantly easier.

**Intelligent Order Management:**
MARBIM uses advanced algorithms to match buyer orders with the most suitable suppliers based on capacity, historical performance, and specialized capabilities. This takes the guesswork out of vendor selection and reduces the risk of mismatched expectations.

**Real-Time Production Visibility:**
Get instant updates on production status across all your suppliers. MARBIM provides real-time monitoring of order progress, flagging potential delays before they impact delivery schedules. This allows you to proactively communicate with buyers and adjust timelines when needed.

**Predictive Timeline Management:**
The system analyzes historical data and current production patterns to predict accurate completion dates. Early adopters report 28% improvement in delivery accuracy—critical for maintaining buyer relationships and avoiding penalties.

**Enhanced Buyer Communication:**
With MARBIM's detailed production insights, you can provide buyers with precise updates and data-backed explanations. This transparency strengthens trust and positions you as a reliable partner.

**Workflow Optimization:**
MARBIM identifies inefficiencies in the production workflow and suggests optimizations. This helps you work with suppliers to implement improvements that benefit everyone in the supply chain.

**Capacity Planning:**
The AI analyzes supplier capacity and production schedules to help you plan order placement strategically, avoiding overload periods and ensuring optimal delivery timelines.

**Risk Mitigation:**
Predictive analytics alert you to potential issues—equipment problems, material delays, quality concerns—allowing you to take corrective action before they escalate into major problems.`,

      'Compliance Officer': `**MARBIM AI: Strengthening Compliance and Sustainability Standards**

For compliance officers managing the complex intersection of labor standards, environmental regulations, and buyer requirements, FabricXAI's MARBIM system offers powerful tools for maintaining and demonstrating compliance.

**Comprehensive Monitoring Framework:**
MARBIM's real-time production monitoring extends beyond efficiency metrics to track compliance-critical factors. The system maintains detailed records of production processes, working hours, and operational parameters—essential documentation for audits and certifications.

**Predictive Compliance Management:**
The AI analyzes patterns that could indicate compliance risks before they materialize. Early warning systems alert you to potential issues with overtime patterns, equipment safety, or production processes that might conflict with sustainability commitments.

**Sustainability Metrics:**
As global buyers increasingly demand environmental accountability, MARBIM helps track and optimize resource utilization. The system monitors energy consumption, material waste, and production efficiency—providing data necessary for sustainability reporting and certification programs.

**Audit Preparedness:**
MARBIM's comprehensive data logging creates an audit trail of production activities, quality control measures, and operational decisions. This documentation is invaluable for BSCI, WRAP, or other compliance certifications.

**Worker Welfare Integration:**
While primarily focused on production optimization, MARBIM's resource allocation algorithms can help ensure balanced workloads and realistic production schedules—supporting fair labor practices and preventing excessive overtime.

**Quality Standards:**
Automated quality control recommendations help maintain consistent product quality, reducing defect rates and ensuring compliance with buyer specifications. This protects against quality-related compliance issues and customer complaints.

**Transparency and Traceability:**
The system's detailed tracking capabilities support transparency initiatives increasingly required by European and North American buyers. You can demonstrate responsible production practices with concrete data.

**Regulatory Adaptation:**
As compliance requirements evolve, MARBIM's flexible monitoring framework can adapt to track new metrics or standards, helping your organization stay ahead of regulatory changes.`,

      'Investor': `**MARBIM AI: Investment Opportunity in RMG Digital Transformation**

As an investor in Bangladesh's Ready-Made Garments sector, FabricXAI's MARBIM system represents a significant market opportunity at the intersection of AI technology and manufacturing optimization.

**Market Opportunity:**
Bangladesh's RMG industry exports $45+ billion annually and employs over 4 million workers. Despite this scale, the sector faces mounting pressure from rising labor costs, sustainability requirements, and competition from other manufacturing hubs. MARBIM addresses these challenges through AI-driven efficiency gains rather than traditional cost-cutting.

**Competitive Differentiation:**
MARBIM is specifically designed for Bangladesh's RMG ecosystem—unlike generic manufacturing software. This vertical focus creates strong barriers to entry and positions FabricXAI uniquely in the market.

**Demonstrated Results:**
Early adopters report 35% reduction in lead times and 28% improvement in delivery accuracy. These aren't marginal gains—they represent substantial competitive advantages that translate directly to profitability and market share.

**Scalability:**
The system integrates with existing ERP infrastructure and can scale across factory networks. This reduces implementation friction and accelerates adoption—critical factors for rapid market penetration.

**Industry Trends Alignment:**
Global fashion brands are increasingly demanding transparency, sustainability, and reliable timelines. MARBIM addresses all three through enhanced monitoring, resource optimization, and predictive analytics. Companies using this technology will be better positioned to win and retain contracts with major buyers.

**Technology Moat:**
Multi-agent AI systems represent cutting-edge technology that combines machine learning, predictive analytics, and real-time monitoring. The complexity creates intellectual property advantages and technical barriers to competition.

**Revenue Model Potential:**
While pricing isn't disclosed, the value proposition suggests strong pricing power. The measurable ROI (35% faster production, 28% better delivery) justifies premium pricing and creates potential for recurring revenue through SaaS or licensing models.

**Market Expansion:**
Success in Bangladesh's RMG sector creates potential for expansion to other manufacturing-heavy markets (Vietnam, Cambodia, India) or adjacent industries (footwear, home textiles, automotive components).

**Risk Considerations:**
Implementation complexity, integration with legacy systems, and competition from established enterprise software providers are key risks. However, the specialized focus on RMG manufacturing may mitigate competitive pressure from generic solutions.

**Strategic Positioning:**
As sustainability and supply chain resilience become critical differentiators in global manufacturing, AI systems like MARBIM that optimize operations while supporting compliance will likely see strong demand from both manufacturers and their buyers.`
    };
    
    setRewrittenContent(roleTailoredContent[userRole as keyof typeof roleTailoredContent] || roleTailoredContent['Factory Owner']);
    setIsGeneratingRewrite(false);
  };

  const handleShareClick = () => {
    if (user) {
      setShowShareModal(true);
    } else {
      onLoginClick();
    }
  };

  // Simplified version content for 5-min read
  const simplifiedContent = `FabricXAI has introduced MARBIM, a revolutionary AI system specifically designed for Bangladesh's Ready-Made Garments industry. This technology represents a major breakthrough in how garment factories operate and collaborate with buyers.

MARBIM stands for Multi-Agent Reasoning for Business Intelligence and Management. It's an intelligent system that uses advanced machine learning to solve real problems faced by garment manufacturers every day.

The results speak for themselves. Companies using MARBIM are experiencing remarkable improvements: 35% faster production times and 28% better delivery accuracy. These aren't small improvements—they're game-changing numbers that directly impact profitability and competitiveness.

How does it work? MARBIM monitors your production floor in real-time, catching potential problems before they become costly delays. The system predicts when machines might fail, alerts managers to workflow bottlenecks, and suggests the best ways to allocate resources across production lines.

One of MARBIM's most valuable features is its intelligent matching system. It analyzes buyer requirements and matches them with the most suitable suppliers based on capacity, capabilities, and past performance. This takes the guesswork out of vendor selection and reduces mismatched expectations.

For quality control, MARBIM provides automated recommendations based on patterns it recognizes from thousands of production runs. This helps maintain consistency and reduces rejection rates from buyers—a constant concern in the garment industry.

The system integrates seamlessly with existing ERP solutions, which means factories don't need to replace their current systems. MARBIM works alongside what you already have, adding intelligence without disruption. It can also be deployed across multiple factory locations, making it scalable for growing businesses.

Industry experts believe MARBIM could become the new standard for digital transformation in Bangladesh's garment sector. As labor costs rise and international buyers demand more transparency and sustainability, AI-driven systems like MARBIM help factories stay competitive through smarter operations rather than cost-cutting that compromises quality or worker welfare.

The technology addresses a critical need. Bangladesh's RMG industry exports over $45 billion annually and employs millions of workers. Maintaining this position in the global market requires continuous innovation. MARBIM provides that innovation by making factories more efficient, more reliable, and better prepared for the demands of modern fashion retail.

For buyers, MARBIM means greater transparency and more reliable delivery schedules. For factory owners, it means better resource utilization and fewer costly surprises. For workers, it means more stable production schedules and better-maintained equipment.

The launch of MARBIM signals a new era for Bangladesh's garment industry—one where artificial intelligence works alongside human expertise to create a more efficient, sustainable, and competitive manufacturing ecosystem.`;

  // Text-to-speech functionality
  const toggleReadAloud = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        setSpeechSynthesis(null);
      } else {
        const utterance = new SpeechSynthesisUtterance(simplifiedContent);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
          setIsPlayingAudio(false);
          setSpeechSynthesis(null);
        };
        
        utterance.onerror = () => {
          setIsPlayingAudio(false);
          setSpeechSynthesis(null);
        };
        
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
        setSpeechSynthesis(utterance);
      }
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden font-['Open_Sans'] bg-white dark:bg-gradient-to-br dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] transition-all duration-300">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap');
          
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Poppins', sans-serif;
          }
          
          body, p, span, div, a, button, input, label {
            font-family: 'Open Sans', sans-serif;
          }
        `}
      </style>

      <Header
        user={user}
        accessToken={accessToken}
        onLoginClick={onLoginClick}
        onPersonalizeClick={onPersonalizeClick}
        onLogout={onLogout}
        onNavigateHome={onNavigateHome}
        onNavigateBusiness={onNavigateBusiness}
        onNavigateIndustry={onNavigateIndustry}
        onNavigateMarkets={onNavigateMarkets}
        onNavigateSaved={onNavigateSaved}
        onNavigateHistory={onNavigateHistory}
      />

      {/* Read Mode View */}
      {isReadMode ? (
        <div className="fixed inset-0 z-50 bg-white dark:bg-[#0a0e1a] overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Read Mode Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[#E5E7EB] dark:border-[#EAB308]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReadMode(false)}
                className="border-2 border-[#6F83A7] dark:border-[#EAB308] hover:bg-[#EAB308]/10 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xs">Exit Read Mode</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleBookmark}
                  className="border-2 border-[#6F83A7] dark:border-[#EAB308] hover:bg-[#EAB308]/10"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 text-[#EAB308]" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareClick}
                  className="border-2 border-[#6F83A7] dark:border-[#EAB308] hover:bg-[#EAB308]/10"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Read Mode Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none">
              {/* Category Badge */}
              <Badge className="bg-[#EAB308] text-[#101725] uppercase tracking-wider mb-4">
                {story.category}
              </Badge>

              {/* Title */}
              <h1 
                className="text-3xl sm:text-4xl lg:text-5xl text-[#101725] dark:text-[#F9FAFB] mb-4 leading-tight"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {story.title}
              </h1>

              {/* Subtitle */}
              <p 
                className="text-lg sm:text-xl text-[#6F83A7] dark:text-[#9BA5B7] mb-6"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {story.subtitle}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#6F83A7] dark:text-[#9BA5B7] mb-8 pb-6 border-b border-[#E5E7EB] dark:border-[#6F83A7]/30">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {story.publishedAt}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {story.readTime}
                </span>
                <span>•</span>
                <span>{story.source}</span>
              </div>

              {/* AI Summary */}
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#57ACAF]/10 dark:from-[#EAB308]/20 dark:to-[#57ACAF]/20 border-l-4 border-[#EAB308] p-6 mb-8 rounded-r-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                  <h3 className="text-lg text-[#101725] dark:text-[#F9FAFB] uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    AI Summary
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-[#101725] dark:text-[#E5E7EB]">
                  {story.summary}
                </p>
              </div>

              {/* Full Article Content */}
              <div className="space-y-6 text-base sm:text-lg leading-relaxed text-[#101725] dark:text-[#E5E7EB]">
                {simplifiedContent.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Sources */}
              <div className="mt-12 pt-8 border-t-2 border-[#E5E7EB] dark:border-[#6F83A7]/30">
                <h3 className="text-sm uppercase tracking-wider text-[#6F83A7] dark:text-[#9BA5B7] mb-4 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Sources
                </h3>
                <ul className="space-y-2">
                  {story.sources.map((source, idx) => (
                    <li key={idx}>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[#57ACAF] hover:text-[#EAB308] dark:text-[#57ACAF] dark:hover:text-[#EAB308] hover:underline transition-colors"
                      >
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="mt-8">
                <h3 className="text-sm uppercase tracking-wider text-[#6F83A7] dark:text-[#9BA5B7] mb-3">
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      className="bg-[#57ACAF]/20 dark:bg-[#EAB308]/20 text-[#101725] dark:text-[#E5E7EB] border border-[#57ACAF] dark:border-[#EAB308]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      ) : (
        <div className="w-full mx-auto px-4 sm:px-6 max-w-7xl pt-20 sm:pt-24 pb-8 sm:pb-16">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all mb-4 sm:mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase tracking-wider text-xs sm:text-sm">Back to Home</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 sm:gap-6 lg:gap-8 w-full">
          {/* Main Content - Article Viewer with Prominent Display */}
          <div className="space-y-4 sm:space-y-6 bg-[rgba(0,0,0,0)] w-full min-w-0">
            {/* Story Header - Streamlined */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gradient-to-br dark:from-[#101725]/80 dark:to-[#182336]/80 border-2 border-[#101725] dark:border-[#EAB308] p-4 sm:p-6 w-full"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <Badge className="bg-[#EAB308] text-[#101725] uppercase tracking-wider text-xs">
                    {story.category}
                  </Badge>
                  <span className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {story.readTime}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsReadMode(!isReadMode)}
                    className="border-2 border-[#6F83A7] dark:border-[#EAB308] hover:bg-[#EAB308]/10 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">
                      {isReadMode ? 'Exit Read Mode' : 'Read Mode'}
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleBookmark}
                    className="border-2 border-[#6F83A7] dark:border-[#EAB308] hover:bg-[#EAB308]/10"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-[#EAB308]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareClick}
                    className="border-2 border-[#6F83A7] dark:border-[#EAB308] hover:bg-[#EAB308]/10 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">
                      {user ? 'Generate Post' : 'Share'}
                    </span>
                  </Button>
                </div>
              </div>

              <h1 
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#101725] dark:text-[#F9FAFB] mb-3 leading-tight break-words"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {story.title}
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#6F83A7] dark:text-[#9BA5B7] leading-relaxed mb-4 break-words">
                {story.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#6F83A7] dark:text-[#9BA5B7] pt-4 border-t border-[#E5E7EB] dark:border-[#6F83A7]/30">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{story.source}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  {story.publishedAt}
                </span>
              </div>

              {/* Separator before AI content */}
              <Separator className="my-6 bg-[#E5E7EB] dark:bg-[#6F83A7]/30" />

              {/* AI Generated Simplified Version Badge */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <Badge className="bg-[#57ACAF] dark:bg-[#6F83A7] text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span className="hidden sm:inline">AI Generated Simplified Version</span>
                  <span className="sm:hidden">AI Simplified</span>
                </Badge>
                <Button
                  onClick={toggleReadAloud}
                  variant="outline"
                  size="sm"
                  className="border-2 border-[#6F83A7] dark:border-[#EAB308] hover:bg-[#EAB308]/10 text-xs"
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3 h-3 mr-1.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3 h-3 mr-1.5" />
                      <span>Read Aloud</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Simplified Content */}
              <div className="space-y-4 w-full overflow-hidden">
                {simplifiedContent.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-sm sm:text-base text-[#6F83A7] dark:text-[#9BA5B7] leading-relaxed break-words" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Role-Tailored Rewritten Article - Only for authenticated users with role set */}
            {user && userRole ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-br from-[#EAB308]/5 via-[#57ACAF]/5 to-[#6F83A7]/5 dark:from-[#EAB308]/10 dark:via-[#57ACAF]/10 dark:to-[#6F83A7]/10 border-2 border-[#57ACAF] dark:border-[#EAB308] overflow-hidden w-full"
              >
                <div className="bg-gradient-to-r from-[#57ACAF] to-[#6F83A7] dark:from-[#EAB308] dark:to-[#F59E0B] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 rounded-full bg-white blur-md opacity-50" />
                      <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white dark:text-[#101725] relative" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white dark:text-[#101725] uppercase tracking-wider text-sm sm:text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Rewritten for Your Role
                      </h3>
                      <p className="text-xs text-white/80 dark:text-[#101725]/80 truncate">
                        AI-tailored analysis for {userRole}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-white/20 dark:bg-[#101725]/20 text-white dark:text-[#101725] border border-white/30 dark:border-[#101725]/30 uppercase text-xs flex-shrink-0">
                    {userRole}
                  </Badge>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  {!rewrittenContent ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="mb-6 px-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#EAB308] to-[#F59E0B] mb-4">
                          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#101725]" />
                        </div>
                        <h4 className="text-lg sm:text-xl text-[#101725] dark:text-[#F9FAFB] mb-2 break-words" style={{ fontFamily: 'Georgia, serif' }}>
                          Get a Personalized Version
                        </h4>
                        <p className="text-sm text-[#6F83A7] dark:text-[#9BA5B7] max-w-md mx-auto leading-relaxed break-words">
                          Our AI will rewrite this article specifically for your role, highlighting insights and information most relevant to your work in the RMG industry.
                        </p>
                      </div>

                      <Button
                        onClick={generateRoleTailoredVersion}
                        disabled={isGeneratingRewrite}
                        className="bg-gradient-to-r from-[#EAB308] to-[#F59E0B] hover:from-[#57ACAF] hover:to-[#6F83A7] text-[#101725] hover:text-white uppercase tracking-wider text-xs sm:text-sm px-6 sm:px-8 py-4 sm:py-6 transition-all shadow-lg"
                      >
                        {isGeneratingRewrite ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            <span className="hidden sm:inline">Generating Personalized Content...</span>
                            <span className="sm:hidden">Generating...</span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Generate Role-Tailored Version</span>
                            <span className="sm:hidden">Generate Version</span>
                          </span>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="prose prose-sm md:prose-base dark:prose-invert max-w-none w-full overflow-hidden"
                    >
                      <div 
                        className="text-sm sm:text-base text-[#101725] dark:text-[#E5E7EB] leading-relaxed whitespace-pre-line break-words"
                        dangerouslySetInnerHTML={{ 
                          __html: rewrittenContent.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#101725] dark:text-[#EAB308]">$1</strong>') 
                        }}
                      />
                      
                      <Separator className="my-6 bg-[#E5E7EB] dark:bg-[#6F83A7]/30" />
                      
                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2 text-xs text-[#6F83A7] dark:text-[#9BA5B7]">
                          <CheckCircle2 className="w-4 h-4 text-[#57ACAF] dark:text-[#EAB308]" />
                          <span>Tailored for {userRole}</span>
                        </div>
                        <Button
                          onClick={() => {
                            setRewrittenContent('');
                            generateRoleTailoredVersion();
                          }}
                          variant="outline"
                          size="sm"
                          className="border-2 border-[#57ACAF] dark:border-[#EAB308] hover:bg-[#EAB308]/10 text-xs uppercase tracking-wider"
                        >
                          <Sparkles className="w-3 h-3 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : user && !userRole ? (
              // User is logged in but hasn't set their role
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-br from-[#EAB308]/5 via-[#57ACAF]/5 to-[#6F83A7]/5 dark:from-[#EAB308]/10 dark:via-[#57ACAF]/10 dark:to-[#6F83A7]/10 border-2 border-[#EAB308]/50 dark:border-[#EAB308] overflow-hidden w-full"
              >
                <div className="p-4 sm:p-6 lg:p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#EAB308] to-[#F59E0B] mb-4">
                    <Brain className="w-8 h-8 text-[#101725]" />
                  </div>
                  <h4 className="text-xl text-[#101725] dark:text-[#F9FAFB] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    Complete Your Profile
                  </h4>
                  <p className="text-sm text-[#6F83A7] dark:text-[#9BA5B7] max-w-md mx-auto leading-relaxed mb-6">
                    Set your professional role to unlock AI-tailored article rewrites that highlight the most relevant insights for your work in the RMG industry.
                  </p>
                  <Button
                    onClick={onPersonalizeClick}
                    className="bg-gradient-to-r from-[#EAB308] to-[#F59E0B] hover:from-[#57ACAF] hover:to-[#6F83A7] text-[#101725] hover:text-white uppercase tracking-wider text-sm px-8 py-3 transition-all shadow-lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Set Your Role
                  </Button>
                </div>
              </motion.div>
            ) : (
              // User is not logged in
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-br from-[#EAB308]/5 via-[#57ACAF]/5 to-[#6F83A7]/5 dark:from-[#EAB308]/10 dark:via-[#57ACAF]/10 dark:to-[#6F83A7]/10 border-2 border-[#EAB308]/50 dark:border-[#EAB308] overflow-hidden w-full"
              >
                <div className="p-4 sm:p-6 lg:p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#EAB308] to-[#F59E0B] mb-4">
                    <Brain className="w-8 h-8 text-[#101725]" />
                  </div>
                  <h4 className="text-xl text-[#101725] dark:text-[#F9FAFB] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    Unlock Role-Tailored Insights
                  </h4>
                  <p className="text-sm text-[#6F83A7] dark:text-[#9BA5B7] max-w-md mx-auto leading-relaxed mb-6">
                    Sign in and personalize your experience to receive AI-rewritten articles tailored specifically to your role in the RMG industry.
                  </p>
                  <Button
                    onClick={onLoginClick}
                    className="bg-gradient-to-r from-[#EAB308] to-[#F59E0B] hover:from-[#57ACAF] hover:to-[#6F83A7] text-[#101725] hover:text-white uppercase tracking-wider text-sm px-8 py-3 transition-all shadow-lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Sign In to Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Original Article Sources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#101725]/80 border-2 border-[#101725] dark:border-[#EAB308] overflow-hidden shadow-xl w-full"
            >
              <div className="bg-gradient-to-r from-[#101725] to-[#182336] dark:from-[#EAB308] dark:to-[#F59E0B] p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-white dark:text-[#101725]">
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="uppercase tracking-wider text-sm sm:text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>Original Article</span>
                </div>
                <span className="text-xs text-white/70 dark:text-[#101725]/70 uppercase tracking-wider">
                  {story.sources.length} {story.sources.length === 1 ? 'Source' : 'Sources'}
                </span>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {story.sources.map((source, index) => (
                  <motion.a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="block group w-full"
                  >
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#182336] dark:to-[#101725] border-2 border-[#E5E7EB] dark:border-[#6F83A7]/30 hover:border-[#EAB308] dark:hover:border-[#EAB308] p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#EAB308]/20">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#EAB308] to-[#F59E0B] rounded flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <h3 
                                className="text-base sm:text-lg text-[#101725] dark:text-white group-hover:text-[#EAB308] dark:group-hover:text-[#EAB308] transition-colors truncate" 
                                style={{ fontFamily: 'Georgia, serif' }}
                              >
                                {source.name}
                              </h3>
                              <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider">
                                News Portal
                              </p>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-[#6F83A7] dark:text-[#9BA5B7] line-clamp-1 break-all">
                            {source.url}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#E5E7EB] dark:border-[#6F83A7]/30 group-hover:border-[#EAB308] dark:group-hover:border-[#EAB308] flex items-center justify-center bg-white dark:bg-[#101725] transition-all duration-300 group-hover:scale-110">
                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-[#6F83A7] dark:text-[#9BA5B7] group-hover:text-[#EAB308] transition-colors" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-[#6F83A7]/20">
                        <div className="flex items-center justify-between text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider">
                          <span>Click to read full article</span>
                          <span className="flex items-center gap-1 text-[#EAB308] dark:text-[#EAB308] opacity-0 group-hover:opacity-100 transition-opacity">
                            Open in new tab
                            <ArrowLeft className="w-3 h-3 rotate-180" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Unified AI Assistant Sidebar - Sticky with Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:overflow-hidden w-full"
          >
            <div className="bg-white dark:bg-gradient-to-br dark:from-[#101725]/90 dark:to-[#182336]/90 border-2 border-[#101725] dark:border-[#EAB308] h-full flex flex-col backdrop-blur-sm shadow-2xl w-full">
              {/* Header */}
              <div className="p-6 border-b-2 border-[#E5E7EB] dark:border-[#6F83A7]/30 bg-gradient-to-r from-[#EAB308]/10 to-[#57ACAF]/10 dark:from-[#EAB308]/20 dark:to-[#57ACAF]/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#EAB308] blur-md opacity-50" />
                    <Sparkles className="w-6 h-6 text-[#EAB308] relative" />
                  </div>
                  <h2 className="text-xl text-[#101725] dark:text-[#F9FAFB]" style={{ fontFamily: 'Georgia, serif' }}>
                    AI Assistant
                  </h2>
                </div>
                <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider">
                  Powered by FabricXAI
                </p>
              </div>

              {/* Tabbed Content */}
              <Tabs defaultValue="summary" className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="w-full grid grid-cols-3 bg-[#F9FAFB] dark:bg-[#101725]/50 border-b-2 border-[#E5E7EB] dark:border-[#6F83A7]/30 rounded-none h-auto p-1">
                  <TabsTrigger 
                    value="summary" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#182336] data-[state=active]:border-b-2 data-[state=active]:border-[#EAB308] rounded-none text-xs uppercase tracking-wider py-3"
                  >
                    <Brain className="w-3 h-3 mr-1" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insights"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#182336] data-[state=active]:border-b-2 data-[state=active]:border-[#EAB308] rounded-none text-xs uppercase tracking-wider py-3"
                  >
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Insights
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ask"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#182336] data-[state=active]:border-b-2 data-[state=active]:border-[#EAB308] rounded-none text-xs uppercase tracking-wider py-3"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Ask AI
                  </TabsTrigger>
                </TabsList>

                {/* Summary Tab */}
                <TabsContent value="summary" className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#EAB308] scrollbar-track-[#E5E7EB] dark:scrollbar-track-[#182336] m-0 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm uppercase tracking-wider text-[#6F83A7] dark:text-[#9BA5B7]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        AI-Generated Summary
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSummaryExpanded(!summaryExpanded)}
                        className="hover:bg-[#EAB308]/20 h-7 px-2"
                      >
                        {summaryExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <AnimatePresence mode="wait">
                      {summaryExpanded ? (
                        <motion.div
                          key="expanded"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-[#101725] dark:text-[#E5E7EB] leading-relaxed whitespace-pre-line text-sm"
                        >
                          {story.summary}
                        </motion.div>
                      ) : (
                        <motion.p
                          key="collapsed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-[#101725] dark:text-[#E5E7EB] leading-relaxed line-clamp-4 text-sm"
                        >
                          {story.summary}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <Separator className="my-4 bg-[#E5E7EB] dark:bg-[#6F83A7]/30" />

                    {/* Share Summary Button */}
                    <Button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="w-full bg-gradient-to-r from-[#57ACAF] to-[#6F83A7] hover:from-[#EAB308] hover:to-[#F59E0B] text-white uppercase tracking-wider text-xs py-5 transition-all"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Summary
                    </Button>
                  </div>
                </TabsContent>

                {/* Key Insights Tab */}
                <TabsContent value="insights" className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#EAB308] scrollbar-track-[#E5E7EB] dark:scrollbar-track-[#182336] m-0 p-6">
                  <div className="space-y-6">
                    {/* Key Takeaways */}
                    <div>
                      <h3 className="text-sm uppercase tracking-wider text-[#6F83A7] dark:text-[#9BA5B7] mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <Lightbulb className="w-4 h-4 text-[#EAB308]" />
                        Key Takeaways
                      </h3>

                      {keyTakeaways.length === 0 ? (
                        <Button
                          onClick={generateKeyTakeaways}
                          disabled={isGeneratingTakeaways}
                          className="w-full bg-gradient-to-r from-[#EAB308] to-[#F59E0B] hover:from-[#57ACAF] hover:to-[#6F83A7] text-[#101725] hover:text-white uppercase tracking-wider text-xs py-6 transition-all"
                        >
                          {isGeneratingTakeaways ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Generating...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Generate Key Takeaways
                            </span>
                          )}
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          {keyTakeaways.map((takeaway, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="group relative rounded-lg bg-gradient-to-br from-white to-[#F9FAFB] dark:from-[#182336] dark:to-[#101725] border border-[#E5E7EB] dark:border-[#6F83A7]/30 hover:border-[#EAB308] dark:hover:border-[#EAB308] p-4 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                              <div className="flex gap-3 items-start">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EAB308] to-[#F59E0B] flex items-center justify-center shadow-md">
                                    <span className="text-[#101725] text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                      {idx + 1}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 pt-0.5">
                                  <p className="text-sm text-[#101725] dark:text-[#F9FAFB] leading-relaxed">
                                    {takeaway}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator className="bg-[#E5E7EB] dark:bg-[#6F83A7]/30" />

                    {/* Related Topics */}
                    <div>
                      <h3 className="text-sm uppercase tracking-wider text-[#6F83A7] dark:text-[#9BA5B7] mb-3 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <Tag className="w-4 h-4 text-[#57ACAF]" />
                        Related Topics
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {story.tags.map((tag, idx) => (
                          <Badge
                            key={idx}
                            className="bg-[#57ACAF]/20 dark:bg-[#EAB308]/20 text-[#101725] dark:text-[#E5E7EB] border border-[#57ACAF] dark:border-[#EAB308] hover:bg-[#EAB308] hover:text-[#101725] cursor-pointer transition-all text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Ask AI Tab */}
                <TabsContent value="ask" className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#EAB308] scrollbar-track-[#E5E7EB] dark:scrollbar-track-[#182336] m-0 p-6">
                  <div className="space-y-4 h-full flex flex-col">
                    <div className="flex-1 space-y-4">
                      <h3 className="text-sm uppercase tracking-wider text-[#6F83A7] dark:text-[#9BA5B7] flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <MessageSquare className="w-4 h-4 text-[#57ACAF] dark:text-[#EAB308]" />
                        Ask Questions About This Story
                      </h3>

                      <Textarea
                        placeholder="What would you like to know about this article?"
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        className="border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308] bg-white dark:bg-[#182336] min-h-[120px] text-[#101725] dark:text-[#E5E7EB] text-sm resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) {
                            askAI();
                          }
                        }}
                      />

                      <Button
                        onClick={askAI}
                        disabled={!aiQuestion.trim() || isAskingAI}
                        className="w-full bg-gradient-to-r from-[#EAB308] to-[#F59E0B] hover:from-[#57ACAF] hover:to-[#6F83A7] text-[#101725] hover:text-white uppercase tracking-wider text-xs py-5 transition-all"
                      >
                        {isAskingAI ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Thinking...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Send className="w-4 h-4" />
                            Ask AI
                          </span>
                        )}
                      </Button>

                      <AnimatePresence>
                        {aiResponse && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="p-4 bg-gradient-to-br from-[#57ACAF]/10 to-[#6F83A7]/10 dark:from-[#57ACAF]/20 dark:to-[#6F83A7]/20 border-l-4 border-[#57ACAF] rounded"
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <Brain className="w-4 h-4 text-[#57ACAF] dark:text-[#EAB308] mt-1 flex-shrink-0" />
                              <p className="text-xs uppercase tracking-wider text-[#57ACAF] dark:text-[#EAB308]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                AI Response
                              </p>
                            </div>
                            <p className="text-sm text-[#101725] dark:text-[#E5E7EB] leading-relaxed whitespace-pre-line">
                              {aiResponse}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] text-center italic pt-4 border-t border-[#E5E7EB] dark:border-[#6F83A7]/30">
                      Press Ctrl+Enter to send
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>

        <Footer onNavigatePrivacy={onNavigatePrivacy} onNavigateTerms={onNavigateTerms} />
      </div>
      )}

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        article={{
          title: story.title,
          subtitle: story.subtitle,
          summary: story.summary,
          url: window.location.href,
          category: story.category
        }}
        userRole={userRole}
      />
    </div>
  );
}
