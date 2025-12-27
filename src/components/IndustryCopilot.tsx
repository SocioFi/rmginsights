/**
 * Industry Copilot Component
 * 
 * AI-powered manufacturing and operational excellence tool for RMG professionals.
 * Generates comprehensive PDF reports for production optimization, technology adoption, and sustainability.
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
  Factory, 
  Cpu, 
  Leaf,
  Settings,
  Users,
  ShieldCheck,
  Zap,
  TrendingUp,
  Loader2,
  Lock,
  Crown,
  CheckCircle2,
  ArrowRight,
  FileDown,
  Boxes,
  Wrench,
  Award
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

interface IndustryCopilotProps {
  user: any;
  onUpgradeClick: () => void;
}

export function IndustryCopilot({ user, onUpgradeClick }: IndustryCopilotProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [analysisType, setAnalysisType] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [operationalFocus, setOperationalFocus] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [reportGenerated, setReportGenerated] = useState(false);

  const isSubscribed = canAccessCopilots(user);

  const analysisTypes = [
    { value: 'production-efficiency', label: 'Production Efficiency Analysis', icon: Factory },
    { value: 'technology-roadmap', label: 'Technology Adoption Roadmap', icon: Cpu },
    { value: 'sustainability-compliance', label: 'Sustainability Compliance Report', icon: Leaf },
    { value: 'supply-chain', label: 'Supply Chain Optimization', icon: Boxes },
    { value: 'quality-control', label: 'Quality Control Assessment', icon: ShieldCheck },
    { value: 'workforce-development', label: 'Workforce Development Plan', icon: Users }
  ];

  const timeframes = [
    { value: 'current', label: 'Current State Analysis' },
    { value: 'quarter', label: 'Quarterly Review' },
    { value: 'year', label: 'Annual Assessment' },
    { value: '3-year', label: '3-Year Strategic Plan' },
    { value: 'transformation', label: 'Digital Transformation Timeline' }
  ];

  const operationalFocuses = [
    { value: 'automation', label: 'Automation & Robotics' },
    { value: 'lean-manufacturing', label: 'Lean Manufacturing' },
    { value: 'zero-waste', label: 'Zero Waste Initiative' },
    { value: 'energy-efficiency', label: 'Energy Efficiency' },
    { value: 'worker-safety', label: 'Worker Safety & Wellbeing' },
    { value: 'innovation', label: 'Innovation & R&D' }
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
RMG INSIGHT INDUSTRY ANALYSIS REPORT
Powered by FabricXAI
=====================================

Analysis Type: ${analysisTypes.find(t => t.value === analysisType)?.label || 'N/A'}
Timeframe: ${timeframes.find(t => t.value === timeframe)?.label || 'N/A'}
Operational Focus: ${operationalFocuses.find(f => f.value === operationalFocus)?.label || 'N/A'}
Generated: ${new Date().toLocaleString()}

EXECUTIVE SUMMARY
-----------------
This comprehensive industry analysis provides detailed insights into manufacturing excellence,
operational efficiency, and technological advancement in the Ready-Made Garments sector.

KEY FINDINGS
------------
1. Production Efficiency: Current capacity utilization at 78% with 22% optimization potential
2. Technology Adoption: AI-powered systems can reduce production time by 35-40%
3. Sustainability: 76% compliance with international environmental standards
4. Workforce: Digital upskilling programs show 45% productivity improvement

DETAILED ANALYSIS
----------------
${customQuery || 'Comprehensive industry analysis covering production systems, technology integration, and operational excellence.'}

OPERATIONAL RECOMMENDATIONS
----------------------------
1. Implement automated cutting systems to reduce fabric waste by 15%
2. Deploy IoT sensors for real-time production monitoring and quality control
3. Adopt zero liquid discharge systems for water treatment compliance
4. Invest in worker training programs for advanced machinery operation
5. Integrate ERP systems for seamless supply chain management
6. Develop renewable energy infrastructure to reduce operational costs by 25%

PRODUCTION METRICS
------------------
- Current Production Capacity: 100,000 units/month
- Average Lead Time: 45-60 days
- Quality Rejection Rate: 2.8%
- Worker Productivity: 85% efficiency
- Machine Downtime: 12% (industry avg: 15%)
- On-Time Delivery Rate: 92%

TECHNOLOGY ASSESSMENT
---------------------
Current State:
- Automation Level: 45% (Medium)
- Digital Integration: 60% (Good)
- AI/ML Adoption: 25% (Early Stage)
- Cloud Infrastructure: 70% (Strong)

Recommended Technologies:
- AI-powered demand forecasting systems
- Automated fabric inspection with computer vision
- Blockchain for supply chain transparency
- Digital twin technology for production simulation
- Predictive maintenance systems
- Smart energy management platforms

SUSTAINABILITY PERFORMANCE
--------------------------
Environmental Metrics:
- Water Usage: 95 liters/kg (Target: 80 liters/kg)
- Energy Consumption: 2.5 kWh/unit (Target: 2.0 kWh/unit)
- Carbon Emissions: 3.2 kg CO2/unit (Target: 2.5 kg CO2/unit)
- Waste Recycling Rate: 68% (Target: 85%)

Certifications Achieved:
✓ LEED Certification (65% of facilities)
✓ ISO 14001 Environmental Management
✓ OEKO-TEX Standard 100
✓ GOTS Organic Certification (35% capacity)

WORKFORCE DEVELOPMENT
---------------------
Current Workforce: 2,500 employees
Skills Distribution:
- Manual Operations: 55%
- Semi-skilled: 30%
- Technical/Skilled: 12%
- Management: 3%

Training Initiatives:
- Digital literacy programs: 500 workers/year
- Advanced machinery operation: 300 workers/year
- Quality control certification: 150 workers/year
- Safety training: 100% coverage (mandatory)

SUPPLY CHAIN OPTIMIZATION
--------------------------
Current Suppliers: 85 active vendors
Local Sourcing: 45%
Lead Time Variance: ±7 days
Inventory Turnover: 6.5x/year

Optimization Opportunities:
- Increase local fabric sourcing to 60% (reduce lead time)
- Implement vendor management system (VMS)
- Deploy RFID tracking for raw material inventory
- Establish strategic partnerships with top 20 suppliers

QUALITY CONTROL SYSTEMS
-----------------------
Inspection Points: 7 stages
Defect Detection Rate: 97.2%
Customer Return Rate: 0.8%
Compliance Audit Score: 94/100

Recommended Improvements:
- AI-powered visual inspection systems
- Statistical process control (SPC) implementation
- Six Sigma methodology adoption
- Real-time quality dashboards

INVESTMENT PRIORITIES
---------------------
Short-term (6-12 months):
- Automated cutting systems: $500K
- Quality inspection technology: $200K
- Worker training programs: $150K

Medium-term (1-2 years):
- ERP system upgrade: $800K
- Renewable energy installation: $1.2M
- Advanced automation: $1.5M

Long-term (3-5 years):
- Full factory digitalization: $3M
- R&D facility development: $2M
- Sustainability infrastructure: $2.5M

RISK FACTORS & MITIGATION
--------------------------
- Skilled labor shortage → Upskilling programs & retention incentives
- Technology obsolescence → Continuous innovation investment
- Compliance changes → Proactive monitoring & adaptation
- Energy cost volatility → Renewable energy transition
- Equipment failure → Predictive maintenance systems

PERFORMANCE BENCHMARKS
-----------------------
Industry Comparison:
- Production Efficiency: 85% (Industry: 80%) ✓
- Quality Standards: 97.2% (Industry: 95%) ✓
- Sustainability Score: 76/100 (Industry: 68/100) ✓
- Technology Adoption: 60% (Industry: 55%) ✓
- Worker Safety: 98% (Industry: 92%) ✓

GROWTH ROADMAP
--------------
Phase 1 (0-12 months): Foundation
- Technology infrastructure setup
- Process optimization
- Workforce training

Phase 2 (1-2 years): Transformation
- Advanced automation deployment
- Digital systems integration
- Sustainability initiatives

Phase 3 (3-5 years): Excellence
- Industry 4.0 implementation
- Innovation leadership
- Global certification standards

=====================================
This is a demo report generated by RMG Insight Industry Copilot.
For full access to real-time data and advanced analytics, contact FabricXAI.

© ${new Date().getFullYear()} RMG Insight - Powered by FabricXAI
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RMG-Industry-Analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const canGenerate = analysisType && timeframe && operationalFocus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <Card className="border-4 border-[#101725] dark:border-[#EAB308] bg-gradient-to-br from-white to-gray-50 dark:from-[#101725] dark:to-[#182336] overflow-hidden shadow-2xl dark:shadow-[#EAB308]/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#101725] to-[#182336] dark:from-[#57ACAF] dark:to-[#4A9599] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#57ACAF] dark:bg-[#101725] blur-lg opacity-50" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-[#57ACAF] to-[#4A9599] dark:from-[#101725] dark:to-[#182336] rounded-full flex items-center justify-center border-2 border-white dark:border-[#57ACAF]">
                  <Factory className="w-7 h-7 text-white dark:text-[#57ACAF]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 
                    className="text-2xl text-white dark:text-[#101725]" 
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Industry Copilot
                  </h2>
                  {isSubscribed && (
                    <Badge className="bg-[#57ACAF] dark:bg-[#101725] text-white dark:text-[#57ACAF] border-0 rounded-full px-2 py-0.5">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-white/80 dark:text-[#101725]/80 uppercase tracking-widest">
                  AI-Powered Manufacturing & Operations Analysis
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
                <strong>Business Tier Feature:</strong> Upgrade to Business tier to access AI-powered manufacturing analysis and generate detailed PDF reports. Pro and Free tier members cannot access this feature.
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
                      <strong>Operational Excellence:</strong> Get comprehensive manufacturing analysis tailored to your operational goals. 
                      Our Industry Copilot analyzes production efficiency, technology adoption, and sustainability performance to deliver 
                      actionable improvement plans in a professional PDF report.
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
                        className="border-2 border-[#101725] dark:border-[#57ACAF] bg-white dark:bg-[#182336] text-[#101725] dark:text-white"
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
                        className="border-2 border-[#101725] dark:border-[#57ACAF] bg-white dark:bg-[#182336] text-[#101725] dark:text-white"
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

                  {/* Operational Focus */}
                  <div className="space-y-3">
                    <Label className="text-[#101725] dark:text-white uppercase tracking-wider text-xs">
                      Operational Focus
                    </Label>
                    <Select value={operationalFocus} onValueChange={setOperationalFocus}>
                      <SelectTrigger 
                        className="border-2 border-[#101725] dark:border-[#57ACAF] bg-white dark:bg-[#182336] text-[#101725] dark:text-white"
                        disabled={!isSubscribed}
                      >
                        <SelectValue placeholder="Select focus area..." />
                      </SelectTrigger>
                      <SelectContent>
                        {operationalFocuses.map((f) => (
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
                      Operational Questions (Optional)
                    </Label>
                    <Textarea
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      placeholder="Add specific operational questions or focus areas for manufacturing improvement..."
                      className="border-2 border-[#101725] dark:border-[#57ACAF] bg-white dark:bg-[#182336] text-[#101725] dark:text-white min-h-[100px]"
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
                          <strong>Generating your manufacturing analysis report...</strong>
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
                          Your comprehensive manufacturing analysis report has been downloaded. Check your downloads folder.
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
                        className="border-2 border-[#57ACAF] text-[#57ACAF] hover:bg-[#57ACAF] hover:text-white"
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
                          ? 'bg-gradient-to-r from-[#101725] to-[#182336] dark:from-[#57ACAF] dark:to-[#4A9599] hover:from-[#57ACAF] hover:to-[#4A9599] dark:hover:from-[#101725] dark:hover:to-[#182336]' 
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
                    { icon: Settings, title: 'Process Optimization', desc: 'Efficiency & productivity insights' },
                    { icon: Award, title: 'Compliance Ready', desc: 'Meet international standards' },
                    { icon: Wrench, title: 'Implementation Guide', desc: 'Step-by-step action plans' }
                  ].map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-[#182336]/50 border border-gray-200 dark:border-[#6F83A7]/20">
                        <Icon className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
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
