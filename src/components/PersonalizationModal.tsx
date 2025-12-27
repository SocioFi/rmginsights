import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Checkbox } from './ui/checkbox';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { AuthService } from '../services/authService';
import { canPersonalizeByPreferences, getSubscriptionTier } from '../utils/subscription';
import { Sparkles, Briefcase, Globe, Mail, CheckCircle2, ArrowRight, Settings, Newspaper, TrendingUp, Bot, Factory, BarChart3, Leaf, Users, FileText, ShieldCheck, Lightbulb, Building2, Target, ShoppingCart, ClipboardCheck, TrendingDown, Brain, Package, Truck, Scissors, Palette, GraduationCap, HeartHandshake, DollarSign, TrendingUpDown, Shirt, PackageSearch, Network, Zap, Globe2, Scale, Megaphone, Sprout, AlertTriangle, Flame, Gauge, LineChart } from 'lucide-react';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import logoImage from 'figma:asset/b912a80f881cf1ec7c838d822f0de9df1ed32ebf.png';

interface PersonalizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessToken: string | null;
  user?: any;
  onPreferencesSaved?: (prefs: any) => void;
  onLoginClick?: () => void;
  onSubscriptionRequired?: () => void;
}

export function PersonalizationModal({ open, onOpenChange, accessToken, user, onPreferencesSaved, onLoginClick, onSubscriptionRequired }: PersonalizationModalProps) {
  const [profession, setProfession] = useState('');
  const [language, setLanguage] = useState('');
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [aiLearningEnabled, setAiLearningEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userSubscription, setUserSubscription] = useState<'free' | 'pro' | 'business' | null>(null);

  const interestOptions = [
    { id: 'AI in RMG', label: 'AI & Technology', color: '#EAB308', Icon: Bot },
    { id: 'Production', label: 'Production Management', color: '#57ACAF', Icon: Factory },
    { id: 'Buyer Trends', label: 'Buyer Trends & Markets', color: '#EAB308', Icon: BarChart3 },
    { id: 'Sustainability', label: 'Sustainability & Green', color: '#57ACAF', Icon: Leaf },
    { id: 'Workforce', label: 'Workforce & Labor', color: '#6F83A7', Icon: Users },
    { id: 'Policy', label: 'Policy & Regulations', color: '#EAB308', Icon: FileText },
    { id: 'Compliance', label: 'Compliance & Safety', color: '#6F83A7', Icon: ShieldCheck },
    { id: 'Innovation', label: 'Innovation & R&D', color: '#57ACAF', Icon: Lightbulb },
    { id: 'Export Markets', label: 'Export Markets', color: '#EAB308', Icon: Globe2 },
    { id: 'Quality Control', label: 'Quality & Standards', color: '#57ACAF', Icon: Target },
    { id: 'Supply Chain', label: 'Supply Chain', color: '#6F83A7', Icon: Network },
    { id: 'Fashion Trends', label: 'Fashion & Design', color: '#EAB308', Icon: Palette },
    { id: 'Raw Materials', label: 'Raw Materials & Textiles', color: '#57ACAF', Icon: Package },
    { id: 'Finance', label: 'Finance & Investment', color: '#6F83A7', Icon: DollarSign },
    { id: 'Logistics', label: 'Logistics & Shipping', color: '#EAB308', Icon: Truck },
    { id: 'Trade Agreements', label: 'Trade Agreements', color: '#57ACAF', Icon: Scale },
    { id: 'Digitalization', label: 'Digital Transformation', color: '#6F83A7', Icon: Zap },
    { id: 'E-commerce', label: 'E-commerce & Online', color: '#EAB308', Icon: ShoppingCart },
    { id: 'Cost Optimization', label: 'Cost & Efficiency', color: '#57ACAF', Icon: Gauge },
    { id: 'Market Analysis', label: 'Market Intelligence', color: '#6F83A7', Icon: LineChart },
  ];

  const professions = [
    { value: 'factory-owner', label: 'Factory Owner', Icon: Building2 },
    { value: 'merchandiser', label: 'Merchandiser', Icon: Target },
    { value: 'buyer', label: 'Buyer', Icon: ShoppingCart },
    { value: 'compliance', label: 'Compliance Officer', Icon: ShieldCheck },
    { value: 'investor', label: 'Investor', Icon: TrendingUp },
    { value: 'analyst', label: 'Industry Analyst', Icon: BarChart3 },
    { value: 'production-manager', label: 'Production Manager', Icon: Factory },
    { value: 'export-manager', label: 'Export Manager', Icon: Globe2 },
    { value: 'quality-manager', label: 'Quality Manager', Icon: Target },
    { value: 'sourcing-manager', label: 'Sourcing Manager', Icon: PackageSearch },
    { value: 'supply-chain', label: 'Supply Chain Manager', Icon: Network },
    { value: 'designer', label: 'Fashion Designer', Icon: Palette },
    { value: 'pattern-maker', label: 'Pattern Maker', Icon: Scissors },
    { value: 'textile-engineer', label: 'Textile Engineer', Icon: GraduationCap },
    { value: 'hr-manager', label: 'HR Manager', Icon: Users },
    { value: 'sustainability', label: 'Sustainability Manager', Icon: Sprout },
    { value: 'logistics', label: 'Logistics Coordinator', Icon: Truck },
    { value: 'marketing', label: 'Marketing Manager', Icon: Megaphone },
    { value: 'business-dev', label: 'Business Development', Icon: TrendingUpDown },
    { value: 'finance', label: 'Finance Manager', Icon: DollarSign },
    { value: 'operations', label: 'Operations Manager', Icon: Gauge },
    { value: 'safety', label: 'Safety Officer', Icon: AlertTriangle },
    { value: 'tech-innovator', label: 'Technology Innovator', Icon: Zap },
    { value: 'consultant', label: 'Industry Consultant', Icon: Briefcase },
  ];

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  // Load existing preferences and subscription when modal opens
  useEffect(() => {
    if (open && accessToken) {
      loadPreferences();
      loadSubscription();
    }
  }, [open, accessToken]);

  const loadPreferences = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d57423f/preferences`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const { preferences } = await response.json();
        if (preferences) {
          setProfession(preferences.profession || '');
          setLanguage(preferences.language || '');
          setInterests(preferences.interests || []);
          setAiLearningEnabled(preferences.aiLearningEnabled !== undefined ? preferences.aiLearningEnabled : true);
        }
      }
    } catch (err) {
      console.error('Failed to load preferences:', err);
    }
  };

  const loadSubscription = async () => {
    try {
      const result = await AuthService.getProfile(accessToken || undefined);
      if (result.success && result.profile) {
        // Get subscription tier directly from profile (most reliable)
        // The database function returns 'subscription_tier' field
        const tier = result.profile.subscription_tier || result.profile.tier || 'free';
        console.log('PersonalizationModal - Loaded subscription tier:', tier, 'Full profile:', result.profile);
        setUserSubscription(tier);
        
        // Double-check: verify tier is valid
        if (tier !== 'free' && tier !== 'pro' && tier !== 'business') {
          console.warn('PersonalizationModal - Invalid tier detected:', tier, 'defaulting to free');
          setUserSubscription('free');
        }
      } else {
        console.warn('PersonalizationModal - No profile found, defaulting to free tier. Error:', result.error);
        setUserSubscription('free');
      }
    } catch (err) {
      console.error('Failed to load subscription:', err);
      setUserSubscription('free');
    }
  };

  const handleSave = async () => {
    if (!accessToken) {
      setError('Please log in to save preferences');
      return;
    }

    // Check subscription tier - Only Pro and Business tiers can save preferences
    // Free tier users cannot use preference-based personalization
    // Use userSubscription state which is loaded directly from database (most reliable)
    const currentTier = userSubscription || 'free';
    console.log('PersonalizationModal - handleSave - Current subscription tier:', currentTier, 'userSubscription state:', userSubscription);
    
    if (currentTier === 'free') {
      // Show error message and redirect to subscription page
      setError('Upgrade to Pro or Business tier to save preferences and enable AI-powered personalization');
      setTimeout(() => {
        onOpenChange(false);
        if (onSubscriptionRequired) {
          onSubscriptionRequired();
        }
      }, 2000);
      return;
    }

    setIsLoading(true);
    setError('');
    setSaveSuccess(false);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d57423f/preferences`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            profession,
            interests,
            language,
            aiLearningEnabled,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      if (onPreferencesSaved) {
        onPreferencesSaved({ profession, interests, language, aiLearningEnabled });
      }

      setSaveSuccess(true);
      
      // Close modal after brief success message
      setTimeout(() => {
        onOpenChange(false);
        setSaveSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error('Save preferences error:', err);
      setError(err.message || 'Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-white via-[#F9FAFB] to-white dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] border-2 border-[#101725] dark:border-[#EAB308] rounded-none w-[85vw] max-w-[720px] max-h-[80vh] p-0 shadow-2xl overflow-hidden">
        {/* Decorative Header */}
        <div className="relative bg-gradient-to-r from-[#101725] via-[#182336] to-[#101725] dark:from-[#EAB308] dark:via-[#F59E0B] dark:to-[#EAB308] p-4 sm:p-6 md:p-8 pb-8 sm:pb-10 md:pb-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)`,
            }} />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <Separator className="w-12 bg-[#EAB308] dark:bg-[#101725]" />
              <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-[#101725] rounded p-1.5">
                <img src={logoImage} alt="RMG Insight Logo" className="w-full h-full object-contain" />
              </div>
              <Separator className="w-12 bg-[#EAB308] dark:bg-[#101725]" />
            </motion.div>

            <DialogHeader>
              <DialogTitle className="text-white dark:text-[#101725] text-center text-3xl mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                Tailor Your News Experience
              </DialogTitle>
              <DialogDescription className="text-[#EAB308] dark:text-[#101725] text-center text-sm uppercase tracking-widest">
                Personalize Your RMG Insight Feed
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Curved Bottom Edge */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-white dark:bg-[#101725]" style={{
            clipPath: 'ellipse(70% 100% at 50% 100%)'
          }} />
        </div>

        <div className="px-8 pb-8 -mt-4 overflow-y-auto max-h-[calc(90vh-200px)] pr-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-4"
          >
            {/* Success Message */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 dark:border-green-600 p-4 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 dark:text-green-200 font-semibold">Preferences Saved!</p>
                    <p className="text-green-700 dark:text-green-300 text-sm">Your personalized feed is ready</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Banner */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#57ACAF]/10 dark:from-[#EAB308]/20 dark:to-[#57ACAF]/20 border-l-4 border-[#EAB308] p-5">
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[#101725] dark:text-[#F9FAFB] font-semibold mb-1">AI-Powered Personalization</h3>
                  <p className="text-[#6F83A7] dark:text-[#9BA5B7] text-sm leading-relaxed">
                    Get AI-curated news tailored to your role and interests. MARBIM learns from your preferences to deliver the most relevant industry insights.
                  </p>
                </div>
              </div>
            </div>

            {/* Profession Selection */}
            <div className="space-y-3">
              <Label className="text-[#101725] dark:text-[#E5E7EB] uppercase tracking-wider text-xs flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#57ACAF]" />
                Your Role in the Industry
              </Label>
              <Select value={profession} onValueChange={setProfession}>
                <SelectTrigger className="border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-[#E5E7EB] h-12 transition-all">
                  <SelectValue placeholder="Select your professional role..." />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#182336] border-2 border-[#E5E7EB] dark:border-[#6F83A7]">
                  {professions.map((prof) => {
                    const ProfIcon = prof.Icon;
                    return (
                      <SelectItem 
                        key={prof.value} 
                        value={prof.value}
                        className="text-[#101725] dark:text-[#E5E7EB] hover:bg-[#EAB308]/10 dark:hover:bg-[#EAB308]/20"
                      >
                        <span className="flex items-center gap-2">
                          <ProfIcon className="w-4 h-4 text-[#57ACAF]" />
                          <span>{prof.label}</span>
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {profession && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-[#57ACAF] dark:text-[#EAB308] flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  News will be tailored for {professions.find(p => p.value === profession)?.label}
                </motion.p>
              )}
            </div>

            {/* Interests Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[#101725] dark:text-[#E5E7EB] uppercase tracking-wider text-xs flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                  Topics of Interest
                </Label>
                {interests.length > 0 && (
                  <Badge className="bg-[#EAB308] text-[#101725] px-3 py-1">
                    {interests.length} selected
                  </Badge>
                )}
              </div>

              {/* Add Topic Dropdown */}
              <div className="flex gap-2">
                <Select 
                  value="" 
                  onValueChange={(value) => {
                    if (value && !interests.includes(value)) {
                      toggleInterest(value);
                    }
                  }}
                >
                  <SelectTrigger className="border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-[#E5E7EB] h-11 transition-all">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#57ACAF] dark:text-[#EAB308]" />
                      <SelectValue placeholder="Add topics to your interests..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#182336] border-2 border-[#E5E7EB] dark:border-[#6F83A7] max-h-[300px]">
                    {interestOptions
                      .filter(option => !interests.includes(option.id))
                      .map((interest) => {
                        const InterestIcon = interest.Icon;
                        return (
                          <SelectItem 
                            key={interest.id} 
                            value={interest.id}
                            className="text-[#101725] dark:text-[#E5E7EB] hover:bg-[#EAB308]/10 dark:hover:bg-[#EAB308]/20"
                          >
                            <span className="flex items-center gap-2">
                              <InterestIcon className="w-4 h-4 text-[#57ACAF]" />
                              <span>{interest.label}</span>
                            </span>
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Topics as Badges */}
              {interests.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-br from-[#EAB308]/5 via-[#57ACAF]/5 to-[#6F83A7]/5 dark:from-[#EAB308]/10 dark:via-[#57ACAF]/10 dark:to-[#6F83A7]/10 border-2 border-[#E5E7EB] dark:border-[#6F83A7] rounded-sm min-h-[60px]">
                  <AnimatePresence mode="popLayout">
                    {interests.map((interestId) => {
                      const interest = interestOptions.find(opt => opt.id === interestId);
                      if (!interest) return null;
                      const InterestIcon = interest.Icon;
                      
                      return (
                        <motion.div
                          key={interestId}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          layout
                        >
                          <Badge 
                            className="bg-gradient-to-r from-[#EAB308] to-[#F59E0B] hover:from-[#57ACAF] hover:to-[#6F83A7] text-[#101725] px-3 py-2 flex items-center gap-2 cursor-pointer transition-all group"
                            onClick={() => toggleInterest(interestId)}
                          >
                            <InterestIcon className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">{interest.label}</span>
                            <motion.div
                              whileHover={{ rotate: 90 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ArrowRight className="w-3.5 h-3.5 rotate-45 group-hover:opacity-100 opacity-70" />
                            </motion.div>
                          </Badge>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="p-6 bg-gradient-to-br from-[#6F83A7]/5 to-[#57ACAF]/5 dark:from-[#6F83A7]/10 dark:to-[#57ACAF]/10 border-2 border-dashed border-[#6F83A7] dark:border-[#57ACAF] text-center">
                  <TrendingUp className="w-8 h-8 text-[#6F83A7] dark:text-[#57ACAF] mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7]">
                    Select at least one topic to personalize your feed
                  </p>
                </div>
              )}
            </div>

            {/* AI Learning Toggle */}
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-[#EAB308]/5 via-[#57ACAF]/5 to-[#6F83A7]/5 dark:from-[#EAB308]/10 dark:via-[#57ACAF]/10 dark:to-[#6F83A7]/10 border-2 border-[#57ACAF] dark:border-[#EAB308] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-[#EAB308]" />
                      <Label className="text-[#101725] dark:text-[#E5E7EB] uppercase tracking-wider text-xs cursor-pointer">
                        AI Learning from Reading Patterns
                      </Label>
                    </div>
                    <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] leading-relaxed">
                      Allow our AI to learn from your reading behavior to provide increasingly personalized content recommendations
                    </p>
                  </div>
                  <div className="pt-1">
                    <Switch
                      id="ai-learning"
                      checked={aiLearningEnabled}
                      onCheckedChange={setAiLearningEnabled}
                      className="data-[state=checked]:bg-[#EAB308]"
                    />
                  </div>
                </div>
                {aiLearningEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-[#57ACAF]/30 dark:border-[#EAB308]/30"
                  >
                    <div className="flex items-center gap-2 text-xs text-[#57ACAF] dark:text-[#EAB308]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>AI is actively learning to personalize your experience</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-3">
              <Label className="text-[#101725] dark:text-[#E5E7EB] uppercase tracking-wider text-xs flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#57ACAF]" />
                Preferred Language
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-[#E5E7EB] h-12 transition-all">
                  <SelectValue placeholder="Select your preferred language..." />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#182336] border-2 border-[#E5E7EB] dark:border-[#6F83A7]">
                  <SelectItem value="english" className="text-[#101725] dark:text-[#E5E7EB]">
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#57ACAF]" />
                      English
                    </span>
                  </SelectItem>
                  <SelectItem value="bangla" className="text-[#101725] dark:text-[#E5E7EB]">
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#57ACAF]" />
                      বাংলা (Bangla)
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email for Daily Digest */}
            <div className="space-y-3">
              <Label className="text-[#101725] dark:text-[#E5E7EB] uppercase tracking-wider text-xs flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#57ACAF]" />
                Daily Digest Email <span className="text-[#6F83A7] normal-case">(Optional)</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-[#E5E7EB] h-12 transition-all"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
              </div>
              <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7]">
                Receive a curated summary of top RMG news every morning
              </p>
            </div>

            {/* Subscription Warning for Free Tier */}
            {accessToken && userSubscription === 'free' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#EAB308]/10 to-[#57ACAF]/10 dark:from-[#EAB308]/20 dark:to-[#57ACAF]/20 border-2 border-[#EAB308] dark:border-[#EAB308] p-5 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-[#101725] dark:text-[#F9FAFB] font-semibold mb-1">Upgrade Required</h4>
                    <p className="text-sm text-[#6F83A7] dark:text-[#9BA5B7] mb-3">
                      Preference-based personalization is available for <strong>Pro</strong> and <strong>Business</strong> tier subscribers. Upgrade to unlock AI-powered content recommendations tailored to your interests.
                    </p>
                    <Button
                      onClick={() => {
                        onOpenChange(false);
                        if (onSubscriptionRequired) {
                          onSubscriptionRequired();
                        }
                      }}
                      className="bg-gradient-to-r from-[#EAB308] to-[#F59E0B] hover:from-[#101725] hover:to-[#101725] dark:from-[#EAB308] dark:to-[#F59E0B] dark:hover:from-[#57ACAF] dark:hover:to-[#57ACAF] text-[#101725] hover:text-white dark:text-[#101725] dark:hover:text-white uppercase tracking-widest text-xs py-2 px-4 transition-all"
                    >
                      View Subscription Plans
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-800 p-4"
                >
                  <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save Button */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                onClick={handleSave}
                disabled={isLoading || !accessToken || interests.length === 0 || userSubscription === 'free' || userSubscription === null}
                className="w-full bg-gradient-to-r from-[#EAB308] to-[#F59E0B] hover:from-[#101725] hover:to-[#101725] dark:from-[#EAB308] dark:to-[#F59E0B] dark:hover:from-[#57ACAF] dark:hover:to-[#57ACAF] text-[#101725] hover:text-white dark:text-[#101725] dark:hover:text-white uppercase tracking-widest text-sm py-6 transition-all shadow-md disabled:opacity-50 group"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-[#101725] border-t-transparent rounded-full"
                    />
                    Saving Preferences...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Save My Preferences
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </motion.div>

            {!accessToken && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#101725]/5 via-[#57ACAF]/5 to-[#EAB308]/5 dark:from-[#EAB308]/10 dark:via-[#57ACAF]/10 dark:to-[#101725]/10 border-2 border-[#57ACAF] dark:border-[#EAB308] p-8 text-center"
              >
                <div className="flex flex-col items-center gap-5">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#6F83A7] dark:from-[#EAB308] dark:to-[#F59E0B]">
                    <ShieldCheck className="w-8 h-8 text-white dark:text-[#101725]" />
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-[#101725] dark:text-[#F9FAFB] font-semibold text-xl" style={{ fontFamily: 'Georgia, serif' }}>
                      Unlock Personalized Content
                    </h4>
                    
                    {/* Free Forever Badge - Centered */}
                    <div className="flex items-center justify-center gap-3 py-2">
                      <Separator className="flex-1 max-w-[60px] bg-[#6F83A7] dark:bg-[#9BA5B7]" />
                      <span className="uppercase tracking-widest text-xs text-[#6F83A7] dark:text-[#9BA5B7] whitespace-nowrap font-semibold">
                        Free forever
                      </span>
                      <Separator className="flex-1 max-w-[60px] bg-[#6F83A7] dark:bg-[#9BA5B7]" />
                    </div>

                    <p className="text-[#6F83A7] dark:text-[#9BA5B7] text-sm leading-relaxed max-w-md">
                      Create a free account to save your preferences and get AI-curated news tailored to your role in the RMG industry
                    </p>
                  </div>

                  <motion.div 
                    className="w-full"
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => {
                        onOpenChange(false);
                        onLoginClick?.();
                      }}
                      className="w-full bg-gradient-to-r from-[#57ACAF] to-[#6F83A7] hover:from-[#101725] hover:to-[#101725] dark:from-[#EAB308] dark:to-[#F59E0B] dark:hover:from-[#57ACAF] dark:hover:to-[#57ACAF] text-white dark:text-[#101725] dark:hover:text-white uppercase tracking-widest text-sm py-6 transition-all shadow-lg group"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <ShieldCheck className="w-5 h-5" />
                        Login or Subscribe
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Benefits Footer */}
            <div className="pt-4 border-t-2 border-[#E5E7EB] dark:border-[#6F83A7]">
              <p className="text-xs uppercase tracking-wider text-[#101725] dark:text-[#E5E7EB] mb-3 flex items-center gap-2">
                <Newspaper className="w-3 h-3" />
                Your Personalized Benefits
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'AI-curated articles',
                  'Industry insights',
                  'Market analysis',
                  'Expert opinions'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-[#57ACAF] dark:text-[#EAB308] flex-shrink-0" />
                    <span className="text-xs text-[#6F83A7] dark:text-[#9BA5B7]">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
