import { motion } from 'motion/react';
import { Clock, Briefcase, Users, Shield, TrendingUp, ShoppingBag } from 'lucide-react';
import { Separator } from './ui/separator';
import { useState } from 'react';

export function RoleTabs() {
  const [activeSection, setActiveSection] = useState('business');

  const sections = {
    business: {
      icon: <Briefcase className="w-5 h-5" />,
      label: 'Business',
      articles: [
        {
          category: 'Production',
          image: 'https://images.unsplash.com/photo-1684259499086-93cb3e555803?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwZmFjdG9yeSUyMHdvcmtlcnN8ZW58MXx8fHwxNzYyMDkzMTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          title: 'Smart Factory Automation Reduces Lead Time by 30%',
          summary: 'Leading RMG factories in Dhaka are adopting IoT sensors and AI monitoring systems to optimize production workflows.',
          source: 'Textile Today',
          time: '3 hours ago',
        },
        {
          category: 'Finance',
          image: 'https://images.unsplash.com/photo-1721578006568-17901600cff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJtZW50JTIwbWFudWZhY3R1cmluZyUyMGluZHVzdHJ5fGVufDF8fHx8MTc2MjA5MzE0NHww&ixlib=rb-4.1.0&q=80&w=1080',
          title: 'Export Earnings Hit $4.2B in October 2024',
          summary: 'Bangladesh garment exports show strong recovery with EU and US orders increasing by 18%.',
          source: 'The Daily Star',
          time: '5 hours ago',
        },
        {
          category: 'Energy',
          image: 'https://images.unsplash.com/photo-1742674537189-415cfb85ce05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGZhY3RvcnklMjBtb2Rlcm58ZW58MXx8fHwxNzYyMDkzMTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
          title: 'Solar Panels Slash Factory Energy Costs by 40%',
          summary: 'More factories switching to renewable energy to meet sustainability requirements.',
          source: 'RMG Bangladesh',
          time: '7 hours ago',
        },
      ],
    },
    industry: {
      icon: <Users className="w-5 h-5" />,
      label: 'Industry',
      articles: [
        {
          category: 'Buyer Trends',
          image: 'https://images.unsplash.com/photo-1656662159350-19daa6ebba3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduJTIwd29ya3NwYWNlfGVufDF8fHx8MTc2MTk4NzI2OXww&ixlib=rb-4.1.0&q=80&w=1080',
          title: 'H&M and Zara Expand Orders for Spring 2025',
          summary: 'Fast fashion giants increase volume commitments to Bangladeshi suppliers.',
          source: 'Apparel Resources',
          time: '4 hours ago',
        },
        {
          category: 'Tech',
          image: 'https://images.unsplash.com/photo-1721578006568-17901600cff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJtZW50JTIwbWFudWZhY3R1cmluZyUyMGluZHVzdHJ5fGVufDF8fHx8MTc2MjA5MzE0NHww&ixlib=rb-4.1.0&q=80&w=1080',
          title: 'AI Tools Predict Fabric Demand 3 Months Ahead',
          summary: 'New predictive analytics platforms help merchandisers plan inventory and reduce waste.',
          source: 'Textile Today',
          time: '6 hours ago',
        },
        {
          category: 'Quality',
          image: 'https://images.unsplash.com/photo-1742674537189-415cfb85ce05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGZhY3RvcnklMjBtb2Rlcm58ZW58MXx8fHwxNzYyMDkzMTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
          title: 'Top 50 Bangladesh Factories Achieve LEED Certification',
          summary: 'Green building certifications becoming key differentiator for international brands.',
          source: 'Sourcing Journal',
          time: '8 hours ago',
        },
      ],
    },
    compliance: {
      icon: <Shield className="w-5 h-5" />,
      label: 'Compliance',
      articles: [
        {
          category: 'Safety',
          image: 'https://images.unsplash.com/photo-1721578006568-17901600cff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJtZW50JTIwbWFudWZhY3R1cmluZyUyMGluZHVzdHJ5fGVufDF8fHx8MTc2MjA5MzE0NHww&ixlib=rb-4.1.0&q=80&w=1080',
          title: 'Fire Safety Audits Show 95% Compliance Rate',
          summary: 'Accord and Alliance programs report significant improvements in structural safety.',
          source: 'ILO Bangladesh',
          time: '5 hours ago',
        },
        {
          category: 'Labor Rights',
          image: 'https://images.unsplash.com/photo-1684259499086-93cb3e555803?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwZmFjdG9yeSUyMHdvcmtlcnN8ZW58MXx8fHwxNzYyMDkzMTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          title: 'New Minimum Wage Policy Announced for 2025',
          summary: 'Government raises garment worker minimum wage by 56%, effective January 2025.',
          source: 'bdnews24',
          time: '7 hours ago',
        },
        {
          category: 'ESG',
          image: 'https://images.unsplash.com/photo-1742674537189-415cfb85ce05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGZhY3RvcnklMjBtb2Rlcm58ZW58MXx8fHwxNzYyMDkzMTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
          title: 'ESG Reporting Becomes Mandatory for Exporters',
          summary: 'BGMEA rolls out new ESG scorecard system to improve international buyer confidence.',
          source: 'The Business Standard',
          time: '9 hours ago',
        },
      ],
    },
    markets: {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Markets',
      articles: [
        {
          category: 'Market',
          image: 'https://images.unsplash.com/photo-1656662159350-19daa6ebba3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduJTIwd29ya3NwYWNlfGVufDF8fHx8MTc2MTk4NzI2OXww&ixlib=rb-4.1.0&q=80&w=1080',
          title: 'FDI in Bangladesh Textile Sector Up 25%',
          summary: 'Foreign investors bullish on Bangladesh RMG, with focus on tech-enabled smart factories.',
          source: 'Dhaka Tribune',
          time: '4 hours ago',
        },
        {
          category: 'Growth',
          image: 'https://images.unsplash.com/photo-1721578006568-17901600cff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJtZW50JTIwbWFudWZhY3R1cmluZyUyMGluZHVzdHJ5fGVufDF8fHx8MTc2MjA5MzE0NHww&ixlib=rb-4.1.0&q=80&w=1080',
          title: 'RMG Sector Projected to Reach $65B by 2030',
          summary: 'Industry analysts predict sustained growth driven by diversification strategies.',
          source: 'McKinsey Report',
          time: '6 hours ago',
        },
        {
          category: 'Tech Investment',
          image: 'https://images.unsplash.com/photo-1684259499086-93cb3e555803?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwZmFjdG9yeSUyMHdvcmtlcnN8ZW58MXx8fHwxNzYyMDkzMTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          title: '$50M Funding for AI-Powered Supply Chain Startups',
          summary: 'Venture capital firms invest heavily in tech solutions for garment manufacturing.',
          source: 'TechCrunch',
          time: '8 hours ago',
        },
      ],
    },
  };

  return (
    <section className="py-16 bg-white dark:bg-gradient-to-br dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] border-t-2 border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header - Newspaper Style */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Separator className="w-24 bg-[#101725]" />
            <ShoppingBag className="w-5 h-5 text-[#101725]" />
            <Separator className="w-24 bg-[#101725]" />
          </div>
          
          <h2 
            className="text-4xl text-[#101725] dark:text-transparent dark:bg-gradient-to-r dark:from-[#F9FAFB] dark:via-[#EAB308] dark:to-[#F9FAFB] dark:bg-clip-text mb-2 transition-all" 
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Sections
          </h2>
          <p className="text-[#6F83A7] dark:text-[#9BA5B7] text-sm uppercase tracking-widest transition-all">
            News by Category
          </p>
        </div>

        {/* Section Navigation - Newspaper Sections */}
        <div className="flex justify-center gap-1 mb-8 pb-6 border-b-2 border-[#101725] dark:border-[#EAB308] transition-all">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex items-center gap-2 px-6 py-3 uppercase text-xs tracking-widest transition-all ${
                activeSection === key
                  ? 'bg-[#101725] dark:bg-gradient-to-r dark:from-[#EAB308] dark:to-[#F59E0B] text-white dark:text-[#101725] shadow-md dark:shadow-[#EAB308]/30'
                  : 'text-[#6F83A7] dark:text-[#9BA5B7] hover:bg-gray-100 dark:hover:bg-[#101725]/50 hover:text-[#101725] dark:hover:text-[#EAB308]'
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Featured Article */}
          <div className="mb-10 pb-10 border-b border-gray-200">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="relative overflow-hidden">
                <img
                  src={sections[activeSection as keyof typeof sections].articles[0].image}
                  alt={sections[activeSection as keyof typeof sections].articles[0].title}
                  className="w-full aspect-[4/3] object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs uppercase tracking-widest text-white bg-[#EAB308] px-3 py-1">
                    {sections[activeSection as keyof typeof sections].articles[0].category}
                  </span>
                  <span className="text-xs text-[#6F83A7] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {sections[activeSection as keyof typeof sections].articles[0].time}
                  </span>
                </div>
                <h3 
                  className="text-3xl text-[#101725] dark:text-[#F9FAFB] mb-4 leading-tight hover:text-[#EAB308] dark:hover:text-[#EAB308] transition-colors cursor-pointer" 
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {sections[activeSection as keyof typeof sections].articles[0].title}
                </h3>
                <p className="text-[#6F83A7] text-lg leading-relaxed mb-4">
                  {sections[activeSection as keyof typeof sections].articles[0].summary}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-sm text-[#6F83A7] italic">
                    {sections[activeSection as keyof typeof sections].articles[0].source}
                  </p>
                  <button className="text-[#101725] hover:text-[#EAB308] transition-colors text-sm uppercase tracking-wider">
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Other Articles - Two Column */}
          <div className="grid md:grid-cols-2 gap-8">
            {sections[activeSection as keyof typeof sections].articles.slice(1).map((article, idx) => (
              <article key={idx} className="border-b border-gray-200 pb-6">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full aspect-[16/9] object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500 mb-3"
                />
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-white bg-[#57ACAF] px-2 py-1">
                    {article.category}
                  </span>
                  <span className="text-xs text-[#6F83A7] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.time}
                  </span>
                </div>
                <h4 
                  className="text-xl text-[#101725] dark:text-[#F9FAFB] mb-2 leading-tight hover:text-[#EAB308] dark:hover:text-[#EAB308] transition-colors cursor-pointer" 
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {article.title}
                </h4>
                <p className="text-sm text-[#6F83A7] leading-relaxed mb-2">
                  {article.summary}
                </p>
                <p className="text-xs text-[#6F83A7] italic">{article.source}</p>
              </article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
