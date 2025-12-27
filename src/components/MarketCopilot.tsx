/**
 * Market Copilot Component
 * 
 * AI-powered market analysis tool for RMG professionals.
 * Generates comprehensive PDF reports based on user-selected parameters.
 * 
 * TESTING PREMIUM FEATURES:
 * To test with premium access, ensure the user object has:
 * { subscription: 'premium' }
 * 
 * Example: In App.tsx, when setting user state after login, add the subscription property.
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
  BarChart3, 
  Globe2, 
  DollarSign,
  Calendar,
  Target,
  Loader2,
  Lock,
  Crown,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileDown,
  Brain
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

interface MarketCopilotProps {
  user: any;
  onUpgradeClick: () => void;
}

export function MarketCopilot({ user, onUpgradeClick }: MarketCopilotProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [analysisType, setAnalysisType] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [region, setRegion] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Check if user has Business tier (required for Copilots)
  const isSubscribed = canAccessCopilots(user);

  const analysisTypes = [
    { value: 'price-trends', label: 'Price Trends Analysis', icon: TrendingUp },
    { value: 'market-share', label: 'Market Share Analysis', icon: BarChart3 },
    { value: 'demand-forecast', label: 'Demand Forecasting', icon: Target },
    { value: 'trade-analysis', label: 'Trade Flow Analysis', icon: Globe2 },
    { value: 'commodity-outlook', label: 'Commodity Outlook', icon: DollarSign },
    { value: 'competitive-analysis', label: 'Competitive Analysis', icon: Brain }
  ];

  const timeframes = [
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const regions = [
    { value: 'global', label: 'Global Markets' },
    { value: 'usa', label: 'United States' },
    { value: 'eu', label: 'European Union' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'asia', label: 'Asia Pacific' },
    { value: 'bangladesh', label: 'Bangladesh' }
  ];

  const handleGenerateReport = async () => {
    if (!isSubscribed) {
      onUpgradeClick();
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setReportGenerated(false);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    clearInterval(progressInterval);
    setGenerationProgress(100);
    setIsGenerating(false);
    setReportGenerated(true);

    // Simulate PDF download
    setTimeout(() => {
      downloadPDF();
    }, 500);
  };

  const downloadPDF = () => {
    // Demo: Create a simple text content for download
    const reportContent = `
RMG INSIGHT MARKET ANALYSIS REPORT
Powered by FabricXAI
=====================================

Analysis Type: ${analysisTypes.find(t => t.value === analysisType)?.label || 'N/A'}
Timeframe: ${timeframes.find(t => t.value === timeframe)?.label || 'N/A'}
Region: ${regions.find(r => r.value === region)?.label || 'N/A'}
Generated: ${new Date().toLocaleString()}

EXECUTIVE SUMMARY
-----------------
This comprehensive market analysis provides detailed insights into the Ready-Made Garments industry,
focusing on key trends, opportunities, and strategic recommendations.

KEY FINDINGS
------------
1. Market Growth: The RMG sector shows strong growth potential with projected 12% YoY increase
2. Price Stability: Raw material costs have stabilized after Q3 volatility
3. Demand Forecast: Export orders expected to rise by 15% in the next quarter
4. Competitive Position: Bangladesh maintains strong competitive advantage in value segment

DETAILED ANALYSIS
----------------
${customQuery || 'General market analysis covering trade flows, pricing trends, and competitive dynamics.'}

RECOMMENDATIONS
---------------
1. Invest in sustainability certifications to meet European buyer requirements
2. Diversify product portfolio to include technical textiles
3. Strengthen supply chain resilience through digital transformation
4. Focus on value-added products to improve margins

MARKET INDICATORS
-----------------
- Cotton Price Index: $0.89/lb (stable)
- Export Volume Growth: +8.5% YoY
- Order Book Status: 78% capacity utilization
- Lead Time Average: 45-60 days

RISK FACTORS
------------
- Global economic uncertainty
- Energy cost fluctuations
- Compliance requirement changes
- Competition from emerging markets

=====================================
This is a demo report generated by RMG Insight Market Copilot.
For full access to real-time data and advanced analytics, contact FabricXAI.

© ${new Date().getFullYear()} RMG Insight - Powered by FabricXAI
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RMG-Market-Analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const canGenerate = analysisType && timeframe && region;

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
                  <Bot className="w-7 h-7 text-white dark:text-[#EAB308]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 
                    className="text-2xl text-white dark:text-[#101725]" 
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Market Copilot
                  </h2>
                  {isSubscribed && (
                    <Badge className="bg-[#EAB308] dark:bg-[#101725] text-[#101725] dark:text-[#EAB308] border-0 rounded-full px-2 py-0.5">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-white/80 dark:text-[#101725]/80 uppercase tracking-widest">
                  AI-Powered Market Analysis & Reporting
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
                <strong>Business Tier Feature:</strong> Upgrade to Business tier to access AI-powered market analysis and generate detailed PDF reports. Pro and Free tier members cannot access this feature.
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
                      <strong>AI-Powered Insights:</strong> Get comprehensive market analysis tailored to your business needs. 
                      Our Market Copilot analyzes real-time data, trade flows, pricing trends, and competitive dynamics to deliver 
                      actionable intelligence in a professional PDF report.
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
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {tf.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Region */}
                  <div className="space-y-3">
                    <Label className="text-[#101725] dark:text-white uppercase tracking-wider text-xs">
                      Market Region
                    </Label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger 
                        className="border-2 border-[#101725] dark:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-white"
                        disabled={!isSubscribed}
                      >
                        <SelectValue placeholder="Select region..." />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            <div className="flex items-center gap-2">
                              <Globe2 className="w-4 h-4" />
                              {r.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Query */}
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-[#101725] dark:text-white uppercase tracking-wider text-xs">
                      Additional Context (Optional)
                    </Label>
                    <Textarea
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      placeholder="Add specific questions or areas of focus for your analysis..."
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
                          <strong>Generating your market analysis report...</strong>
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
                          Your comprehensive market analysis report has been downloaded. Check your downloads folder.
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
                        className="border-2 border-[#6F83A7] dark:border-[#57ACAF] text-[#6F83A7] dark:text-[#57ACAF] hover:bg-[#6F83A7] hover:text-white dark:hover:bg-[#57ACAF] dark:hover:text-[#101725]"
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
                    { icon: Brain, title: 'AI Analysis', desc: 'Advanced algorithms analyze market data' },
                    { icon: FileText, title: 'PDF Reports', desc: 'Professional formatted documents' },
                    { icon: TrendingUp, title: 'Real-time Data', desc: 'Latest market indicators & trends' }
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
