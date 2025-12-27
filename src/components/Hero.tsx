import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Newspaper, Sparkles, Factory, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useState, useEffect } from 'react';
import logoImage from 'figma:asset/b912a80f881cf1ec7c838d822f0de9df1ed32ebf.png';

interface HeroProps {
  onPersonalize: () => void;
  onReadStory: (storyId: string) => void;
}

export function Hero({ onPersonalize, onReadStory }: HeroProps) {
  const today = new Date();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  
  const breakingNews = [
    {
      icon: TrendingUp,
      title: "FabricXAI launches MARBIM AI system",
      description: "for RMG supply chain optimization"
    },
    {
      icon: Factory,
      title: "European orders surge",
      description: "with 22% increase in Q4 2024"
    },
    {
      icon: CheckCircle2,
      title: "New ESG compliance framework",
      description: "announced for 2025"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % breakingNews.length);
    }, 5000); // Change news every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="bg-white dark:bg-gradient-to-br dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] pt-20 pb-8 border-b-4 border-[#101725] dark:border-[#EAB308] transition-all duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Classic Newspaper Masthead */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Top Banner with Location & Date */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-widest mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 transition-all">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              <span className="text-[10px] sm:text-xs">Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span className="text-[10px] sm:text-xs hidden md:inline">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="text-[10px] sm:text-xs md:hidden">{today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Main Masthead */}
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 sm:gap-3 mb-2"
            >
              <Separator className="w-16 sm:w-24 md:w-32 bg-[#EAB308]" />
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                <img src={logoImage} alt="RMG Insight Logo" className="w-full h-full object-contain" />
              </div>
              <Separator className="w-16 sm:w-24 md:w-32 bg-[#EAB308]" />
            </motion.div>

            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-[#101725] dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:via-[#EAB308] dark:to-white dark:bg-clip-text mb-3 tracking-tight transition-all px-2" 
              style={{ fontFamily: 'Georgia, serif', fontWeight: 700 }}
            >
              RMG Insight
            </h1>
            
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-[#6F83A7] dark:text-[#9BA5B7] mb-2 transition-all">
              <Separator className="w-12 sm:w-16 md:w-20 bg-[#57ACAF] dark:bg-[#EAB308]" />
              <p className="text-xs sm:text-sm uppercase tracking-wider sm:tracking-[0.3em]">Powered by FabricXAI</p>
              <Separator className="w-12 sm:w-16 md:w-20 bg-[#57ACAF] dark:bg-[#EAB308]" />
            </div>

            <p className="text-[#6F83A7] dark:text-[#9BA5B7] italic text-xs sm:text-sm transition-all px-4">
              "All the News That's Fit to Print" — Your Daily Intelligence Hub for Bangladesh's Garment Industry
            </p>
          </div>

          {/* Editorial Tagline */}
          <div className="border-y-2 border-[#101725] dark:border-[#EAB308] py-3 sm:py-4 transition-all">
            <p className="text-sm sm:text-base md:text-lg text-[#101725] dark:text-[#E5E7EB] tracking-wide transition-all px-2" style={{ fontFamily: 'Georgia, serif' }}>
              <span className="hidden sm:inline">AI-Curated Insights • Industry Trends • Compliance Updates • Market Intelligence</span>
              <span className="sm:hidden">Industry News & AI Insights</span>
            </p>
          </div>
        </motion.div>

        {/* Breaking News Banner */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#EAB308] dark:bg-gradient-to-r dark:from-[#EAB308] dark:via-[#F59E0B] dark:to-[#EAB308] py-3 px-4 sm:px-6 mb-8 transition-all shadow-md dark:shadow-[#EAB308]/20 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <motion.div 
              animate={{ 
                opacity: [1, 0.8, 1],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex items-center gap-2 bg-[#101725] dark:bg-black px-3 sm:px-4 py-2 flex-shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#EAB308] animate-pulse" />
              <span 
                className="text-white uppercase tracking-widest text-xs sm:text-sm" 
                style={{ fontFamily: 'Georgia, serif', fontWeight: 700 }}
              >
                Breaking News
              </span>
            </motion.div>
            
            <div className="flex-1 w-full min-h-[60px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNewsIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <div className="flex items-start gap-3">
                    {React.createElement(breakingNews[currentNewsIndex].icon, {
                      className: "w-5 h-5 flex-shrink-0 mt-0.5 text-[#101725] dark:text-[#101725]"
                    })}
                    <div className="flex-1">
                      <p className="text-[#101725] dark:text-[#101725] text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                        <strong>{breakingNews[currentNewsIndex].title}</strong> {breakingNews[currentNewsIndex].description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* News Indicators */}
            <div className="flex gap-2 sm:ml-auto">
              {breakingNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentNewsIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentNewsIndex 
                      ? 'bg-[#101725] dark:bg-black w-6' 
                      : 'bg-[#101725]/30 dark:bg-black/30 hover:bg-[#101725]/50 dark:hover:bg-black/50'
                  }`}
                  aria-label={`Go to news ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Hero Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Main Feature */}
          <div className="lg:col-span-2 border-2 border-[#101725] dark:border-[#EAB308] p-6 bg-gray-50 dark:bg-gradient-to-br dark:from-[#101725]/80 dark:to-[#182336]/80 backdrop-blur-sm transition-all">
            <div className="mb-3">
              <span className="text-xs uppercase tracking-widest text-[#6F83A7] dark:text-[#9BA5B7] border-b-2 border-[#EAB308] pb-1 transition-all">
                Today's Lead Story
              </span>
            </div>
            <h2 
              className="text-3xl md:text-4xl text-[#101725] dark:text-[#F9FAFB] mb-4 leading-tight transition-all" 
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Revolutionary AI System MARBIM Transforms Bangladesh's Garment Manufacturing
            </h2>
            <p className="text-[#6F83A7] dark:text-[#9BA5B7] text-lg leading-relaxed mb-4 transition-all">
              SocioFi Technology unveils groundbreaking agentic AI designed to optimize workflows, predict delays, and enhance buyer-supplier collaboration across the RMG sector.
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-300 dark:border-gray-600 transition-all">
              <p className="text-sm text-[#6F83A7] dark:text-[#9BA5B7] italic transition-all">Textile Today • 2 hours ago</p>
              <button 
                onClick={() => onReadStory('marbim-ai-transforms-rmg')}
                className="text-[#101725] dark:text-[#EAB308] hover:text-[#EAB308] dark:hover:text-white transition-all text-sm uppercase tracking-wider group"
              >
                <span className="flex items-center gap-1">
                  Read Full Story 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
            </div>
          </div>

          {/* Side Features */}
          <div className="space-y-6">
            <div className="border border-[#101725] dark:border-[#EAB308] p-4 bg-white dark:bg-gradient-to-br dark:from-[#101725]/80 dark:to-[#182336]/80 backdrop-blur-sm transition-all">
              <span className="text-[10px] uppercase tracking-widest text-[#6F83A7] dark:text-[#9BA5B7] mb-2 block transition-all">Market Watch</span>
              <h3 className="text-lg text-[#101725] dark:text-[#F9FAFB] mb-2 leading-tight transition-all" style={{ fontFamily: 'Georgia, serif' }}>
                Cotton Prices Rise 2.3% Amid Global Demand
              </h3>
              <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] transition-all">Analysis • 3 hours ago</p>
            </div>

            <div className="border border-[#101725] dark:border-[#EAB308] p-4 bg-white dark:bg-gradient-to-br dark:from-[#101725]/80 dark:to-[#182336]/80 backdrop-blur-sm transition-all">
              <span className="text-[10px] uppercase tracking-widest text-[#6F83A7] dark:text-[#9BA5B7] mb-2 block transition-all">Industry News</span>
              <h3 className="text-lg text-[#101725] dark:text-[#F9FAFB] mb-2 leading-tight transition-all" style={{ fontFamily: 'Georgia, serif' }}>
                Smart Factories Cut Waste by 35% with IoT
              </h3>
              <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] transition-all">Technology • 4 hours ago</p>
            </div>

            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full py-4 bg-[#57ACAF] dark:bg-gradient-to-r dark:from-[#EAB308] dark:to-[#F59E0B] text-white dark:text-[#101725] uppercase tracking-widest text-sm hover:bg-[#101725] dark:hover:from-[#57ACAF] dark:hover:to-[#57ACAF] transition-all shadow-md dark:shadow-[#EAB308]/30"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Personalize Your Feed
                  </span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#101725]"
                  />
                </motion.button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[calc(100vw-2rem)] sm:w-80 p-0 bg-white dark:bg-[#182336] border-2 border-[#101725] dark:border-[#EAB308] shadow-xl max-h-[calc(100vh-8rem)] overflow-y-auto"
                side="bottom"
                sideOffset={10}
                align="center"
              >
                <div className="p-4 sm:p-5">
                  {/* Header */}
                  <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b-2 border-[#EAB308]">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#EAB308]" />
                      <h3 className="text-base sm:text-lg text-[#101725] dark:text-[#F9FAFB]" style={{ fontFamily: 'Georgia, serif' }}>
                        Personalize Your Experience
                      </h3>
                    </div>
                    <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7]">
                      Get AI-curated content tailored to your role and interests
                    </p>
                  </div>

                  {/* Benefits Preview */}
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5">
                    {/* Roles */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Factory className="w-4 h-4 text-[#57ACAF]" />
                        <h4 className="text-sm text-[#101725] dark:text-[#F9FAFB] uppercase tracking-wider">
                          Select Your Role
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['Factory Owner', 'Merchandiser', 'Compliance', 'Investor'].map((role) => (
                          <span
                            key={role}
                            className="text-xs px-2 py-1 bg-[#EAB308]/10 dark:bg-[#EAB308]/20 text-[#101725] dark:text-[#EAB308] border border-[#EAB308]/30 rounded"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interests */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                        <h4 className="text-sm text-[#101725] dark:text-[#F9FAFB] uppercase tracking-wider">
                          Choose Topics
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['AI & Tech', 'Compliance', 'Sustainability', 'Markets'].map((topic) => (
                          <span
                            key={topic}
                            className="text-xs px-2 py-1 bg-[#57ACAF]/10 dark:bg-[#57ACAF]/20 text-[#101725] dark:text-[#57ACAF] border border-[#57ACAF]/30 rounded"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Regions */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-[#57ACAF]" />
                        <h4 className="text-sm text-[#101725] dark:text-[#F9FAFB] uppercase tracking-wider">
                          Track Regions
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['Dhaka', 'Chittagong', 'Gazipur'].map((region) => (
                          <span
                            key={region}
                            className="text-xs px-2 py-1 bg-[#6F83A7]/10 dark:bg-[#6F83A7]/20 text-[#101725] dark:text-[#6F83A7] border border-[#6F83A7]/30 rounded"
                          >
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="mb-4 sm:mb-5 p-2.5 sm:p-3 bg-gradient-to-br from-[#EAB308]/5 to-[#57ACAF]/5 dark:from-[#EAB308]/10 dark:to-[#57ACAF]/10 rounded border border-[#EAB308]/20">
                    <div className="space-y-1.5 sm:space-y-2">
                      {[
                        'Prioritized news based on your role',
                        'AI insights relevant to your interests',
                        'Regional updates for your locations'
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-[#101725] dark:text-[#E5E7EB]">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setPopoverOpen(false);
                      onPersonalize();
                    }}
                    className="relative w-full py-4 bg-gradient-to-r from-[#101725] via-[#182336] to-[#101725] dark:from-[#EAB308] dark:via-[#F59E0B] dark:to-[#EAB308] text-white dark:text-[#101725] border-2 border-[#EAB308] dark:border-[#101725] uppercase tracking-widest overflow-hidden group transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#EAB308]/30 dark:hover:shadow-[#101725]/30"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {/* Animated background overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#EAB308] via-[#F59E0B] to-[#EAB308] dark:from-[#57ACAF] dark:via-[#6F83A7] dark:to-[#57ACAF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                    
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      initial={false}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                      />
                    </motion.div>
                    
                    {/* Button content */}
                    <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white dark:group-hover:text-[#101725] transition-colors duration-300">
                      <Sparkles className="w-4 h-4" />
                      <span>Get Started</span>
                      <motion.span
                        animate={{
                          x: [0, 4, 0]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        →
                      </motion.span>
                    </span>
                  </motion.button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </motion.div>

        {/* Weather & Market Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-700 text-center transition-all"
        >
          <div>
            <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider mb-1 transition-all">Weather</p>
            <p className="text-lg text-[#101725] dark:text-[#F9FAFB] transition-all">28°C Partly Cloudy</p>
          </div>
          <div>
            <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider mb-1 transition-all">Exchange Rate</p>
            <p className="text-lg text-[#101725] dark:text-[#F9FAFB] transition-all">1 USD = 110 BDT</p>
          </div>
          <div>
            <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider mb-1 transition-all">Cotton Index</p>
            <p className="text-lg text-green-600 dark:text-[#34D399] transition-all">↑ 2.3%</p>
          </div>
          <div>
            <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider mb-1 transition-all">Export Volume</p>
            <p className="text-lg text-green-600 dark:text-[#34D399] transition-all">↑ 5.1%</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
