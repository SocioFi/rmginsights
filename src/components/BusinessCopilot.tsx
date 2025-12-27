/**
 * Business Copilot Component
 * 
 * AI-powered business strategy and analysis tool for RMG professionals.
 * Generates comprehensive PDF reports for export performance, market strategies, and investment opportunities.
 * 
 * TESTING PREMIUM FEATURES:
 * To test with premium access, ensure the user object has:
 * { subscription: 'premium' }
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { canAccessCopilots } from '../utils/subscription';
import { 
  Bot, 
  FileText, 
  Download, 
  Sparkles, 
  TrendingUp, 
  Target, 
  DollarSign,
  Users,
  Briefcase,
  PieChart,
  LineChart,
  Loader2,
  Lock,
  Crown,
  CheckCircle2,
  ArrowRight,
  FileDown,
  Brain,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';

interface BusinessCopilotProps {
  user: any;
  onUpgradeClick: () => void;
}

export function BusinessCopilot({ user, onUpgradeClick }: BusinessCopilotProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [analysisType, setAnalysisType] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [businessFocus, setBusinessFocus] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [reportGenerated, setReportGenerated] = useState(false);

  const isSubscribed = canAccessCopilots(user);

  const analysisTypes = [
    { value: 'export-performance', label: 'Export Performance Analysis', icon: TrendingUp },
    { value: 'market-entry', label: 'Market Entry Strategy', icon: Target },
    { value: 'investment-opportunity', label: 'Investment Opportunity Assessment', icon: DollarSign },
    { value: 'buyer-relationship', label: 'Buyer-Supplier Relationship Analysis', icon: Users },
    { value: 'business-optimization', label: 'Business Model Optimization', icon: Briefcase },
    { value: 'risk-assessment', label: 'Strategic Risk Assessment', icon: Shield }
  ];

  const timeframes = [
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'forecast', label: 'Next Quarter Forecast' }
  ];

  const businessFocuses = [
    { value: 'export-growth', label: 'Export Growth' },
    { value: 'diversification', label: 'Market Diversification' },
    { value: 'profitability', label: 'Profitability Improvement' },
    { value: 'sustainability', label: 'Sustainability Initiatives' },
    { value: 'digital-transformation', label: 'Digital Transformation' },
    { value: 'capacity-expansion', label: 'Capacity Expansion' }
  ];

  const handleGenerateReport = async () => {
    if (!isSubscribed) {
      onUpgradeClick();
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setReportGenerated(false);

    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    await new Promise(resolve => setTimeout(resolve, 3500));
    
    clearInterval(progressInterval);
    setGenerationProgress(100);
    setIsGenerating(false);
    setReportGenerated(true);

    setTimeout(() => {
      downloadPDF();
    }, 500);
  };

  const downloadPDF = () => {
    const reportContent = `
RMG INSIGHT BUSINESS ANALYSIS REPORT
Powered by FabricXAI
=====================================

Analysis Type: ${analysisTypes.find(t => t.value === analysisType)?.label || 'N/A'}
Timeframe: ${timeframes.find(t => t.value === timeframe)?.label || 'N/A'}
Business Focus: ${businessFocuses.find(f => f.value === businessFocus)?.label || 'N/A'}
Generated: ${new Date().toLocaleString()}

EXECUTIVE SUMMARY
-----------------
This comprehensive business analysis provides strategic insights into the Ready-Made Garments industry,
focusing on growth opportunities, competitive positioning, and operational excellence.

KEY FINDINGS
------------
1. Export Performance: RMG exports show 14% YoY growth with strong US market penetration
2. Market Position: Bangladesh maintains competitive advantage in fast fashion segment
3. Business Opportunities: Sustainability compliance creates new premium market access
4. Strategic Partnerships: Enhanced buyer relationships yield 20% longer-term contracts

DETAILED ANALYSIS
----------------
${customQuery || 'Comprehensive business analysis covering export dynamics, market strategies, and growth opportunities.'}

STRATEGIC RECOMMENDATIONS
-------------------------
1. Diversify product portfolio to reduce dependency on single market segments
2. Invest in sustainability certifications to access European premium buyers
3. Strengthen digital infrastructure for improved buyer communication
4. Develop strategic partnerships with international brands for long-term contracts
5. Focus on value-added products to improve margins by 15-20%

BUSINESS METRICS
----------------
- Export Growth Rate: 14% YoY
- Average Order Value: +18% increase
- Buyer Retention Rate: 87%
- New Market Penetration: 3 new countries
- Sustainability Compliance: 76% of factories certified

INVESTMENT OPPORTUNITIES
------------------------
- Vertical integration in textile production
- Technology adoption for production automation
- Sustainability infrastructure development
- E-commerce platform integration
- Direct-to-consumer brand development

COMPETITIVE ANALYSIS
-------------------
- Market Share: 9.2% of US apparel imports (2nd position)
- Price Competitiveness: 15% lower than developed markets
- Quality Standards: Meeting 94% of international requirements
- Lead Time Performance: 45-60 days average
- Compliance Rating: Strong (Grade A)

RISK FACTORS & MITIGATION
--------------------------
- Energy cost volatility → Renewable energy investment
- Political uncertainty → Diversified market strategy
- Competition from emerging markets → Quality differentiation
- Supply chain disruptions → Local sourcing initiatives
- Currency fluctuations → Hedging strategies

GROWTH PROJECTIONS
------------------
- Short-term (6-12 months): 8-10% revenue growth
- Medium-term (1-2 years): 15-18% market expansion
- Long-term (3-5 years): 25-30% capacity increase

=====================================
This is a demo report generated by RMG Insight Business Copilot.
For full access to real-time data and advanced analytics, contact FabricXAI.

© ${new Date().getFullYear()} RMG Insight - Powered by FabricXAI
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RMG-Business-Analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const canGenerate = analysisType && timeframe && businessFocus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <Card className="border-4 border-[#101725] dark:border-[#EAB308] bg-gradient-to-br from-white to-gray-50 dark:from-[#101725] dark:to-[#182336] overflow-hidden shadow-2xl dark:shadow-[#EAB308]/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#101725] to-[#182336] dark:from-[#EAB308] dark:to-[#F59E0B] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#EAB308] dark:bg-[#101725] blur-lg opacity-50" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-[#EAB308] to-[#F59E0B] dark:from-[#101725] dark:to-[#182336] rounded-full flex items-center justify-center border-2 border-white dark:border-[#EAB308]">
                  <Brain className="w-7 h-7 text-white dark:text-[#EAB308]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 
                    className="text-2xl text-white dark:text-[#101725]" 
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Business Copilot
                  </h2>
                  {isSubscribed && (
                    <Badge className="bg-[#EAB308] dark:bg-[#101725] text-[#101725] dark:text-[#EAB308] border-0 rounded-full px-2 py-0.5">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-white/80 dark:text-[#101725]/80 uppercase tracking-widest">
                  AI-Powered Business Strategy & Analysis
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              className="text-white dark:text-[#101725] hover:bg-white/10 dark:hover:bg-[#101725]/10"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
              <ArrowRight className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Premium Badge for Non-Subscribers */}
        {!isSubscribed && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-b-2 border-amber-200 dark:border-amber-700/30 p-4">
            <Alert className="border-0 bg-transparent">
              <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-sm text-amber-800 dark:text-amber-200 ml-2">
                <strong>Business Tier Feature:</strong> Upgrade to Business tier to access AI-powered business strategy analysis and generate detailed PDF reports. Pro and Free tier members cannot access this feature.
                <Button 
                  onClick={onUpgradeClick}
                  size="sm"
                  className="ml-3 bg-amber-600 hover:bg-amber-700 text-white rounded-full px-4 h-7"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  Upgrade Now
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">
                {/* Introduction */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 dark:border-blue-400">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>Strategic Intelligence:</strong> Get comprehensive business analysis tailored to your strategic goals. 
                      Our Business Copilot analyzes export performance, market opportunities, and competitive positioning to deliver 
                      actionable strategies in a professional PDF report.
                    </p>
                  </div>
                </div>

                <Separator className="bg-[#E5E7EB] dark:bg-[#6F83A7]/30" />

                {/* Configuration Form */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Analysis Type */}
                  <div className="space-y-3">
                    <Label className="text-[#101725] dark:text-white uppercase tracking-wider text-xs">
                      Analysis Type
                    </Label>
                    <Select value={analysisType} onValueChange={setAnalysisType}>
                      <SelectTrigger 
                        className="border-2 border-[#101725] dark:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-white"
                        disabled={!isSubscribed}
                      >
                        <SelectValue placeholder="Select analysis type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {analysisTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Timeframe */}
                  <div className="space-y-3">
                    <Label className="text-[#101725] dark:text-white uppercase tracking-wider text-xs">
                      Timeframe
                    </Label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger 
                        className="border-2 border-[#101725] dark:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-white"
                        disabled={!isSubscribed}
                      >
                        <SelectValue placeholder="Select timeframe..." />
                      </SelectTrigger>
                      <SelectContent>
                        {timeframes.map((tf) => (
                          <SelectItem key={tf.value} value={tf.value}>
                            {tf.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Business Focus */}
                  <div className="space-y-3">
                    <Label className="text-[#101725] dark:text-white uppercase tracking-wider text-xs">
                      Business Focus
                    </Label>
                    <Select value={businessFocus} onValueChange={setBusinessFocus}>
                      <SelectTrigger 
                        className="border-2 border-[#101725] dark:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-white"
                        disabled={!isSubscribed}
                      >
                        <SelectValue placeholder="Select focus area..." />
                      </SelectTrigger>
                      <SelectContent>
                        {businessFocuses.map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Query */}
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-[#101725] dark:text-white uppercase tracking-wider text-xs">
                      Strategic Questions (Optional)
                    </Label>
                    <Textarea
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      placeholder="Add specific business questions or strategic focus areas..."
                      className="border-2 border-[#101725] dark:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-white min-h-[100px]"
                      disabled={!isSubscribed}
                    />
                  </div>
                </div>

                {/* Generation Progress */}
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                      <div className="flex-1">
                        <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
                          <strong>Generating your business strategy report...</strong>
                        </p>
                        <Progress value={generationProgress} className="h-2" />
                      </div>
                      <span className="text-sm text-blue-600 dark:text-blue-400">{generationProgress}%</span>
                    </div>
                  </motion.div>
                )}

                {/* Success Message */}
                {reportGenerated && !isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800/30"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-green-900 dark:text-green-100 mb-2">
                          <strong>Report generated successfully!</strong>
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Your comprehensive business strategy report has been downloaded. Check your downloads folder.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-[#E5E7EB] dark:border-[#6F83A7]/30">
                  <div className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider">
                    {isSubscribed ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Business Tier Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-500" />
                        Business Tier Feature
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {reportGenerated && (
                      <Button
                        onClick={downloadPDF}
                        variant="outline"
                        className="border-2 border-[#EAB308] text-[#EAB308] hover:bg-[#EAB308] hover:text-white"
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        Download Again
                      </Button>
                    )}
                    <Button
                      onClick={handleGenerateReport}
                      disabled={!canGenerate || isGenerating}
                      className={`
                        ${isSubscribed 
                          ? 'bg-gradient-to-r from-[#101725] to-[#182336] dark:from-[#EAB308] dark:to-[#F59E0B] hover:from-[#EAB308] hover:to-[#F59E0B] dark:hover:from-[#101725] dark:hover:to-[#182336]' 
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                        }
                        text-white dark:text-[#101725] hover:text-white px-8 py-6 uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : isSubscribed ? (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Generate Report
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Generate
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="grid md:grid-cols-3 gap-4 pt-6 border-t-2 border-[#E5E7EB] dark:border-[#6F83A7]/30">
                  {[
                    { icon: PieChart, title: 'Strategic Analysis', desc: 'Export performance & market insights' },
                    { icon: LineChart, title: 'Growth Forecasts', desc: 'Data-driven projections & trends' },
                    { icon: Zap, title: 'Action Plans', desc: 'Implementable recommendations' }
                  ].map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-[#182336]/50 border border-gray-200 dark:border-[#6F83A7]/20">
                        <Icon className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm text-[#101725] dark:text-white mb-1">{feature.title}</h4>
                          <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7]">{feature.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
