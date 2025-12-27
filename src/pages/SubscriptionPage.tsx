import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { CheckCircle2, Crown, Sparkles, ArrowRight, Lock, Zap, TrendingUp, BarChart3, Brain, FileText, ShieldCheck, Users, Globe2, Target, Check } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { AuthService } from '../services/authService';
import logoImage from 'figma:asset/b912a80f881cf1ec7c838d822f0de9df1ed32ebf.png';

interface SubscriptionPageProps {
  user: any;
  accessToken: string | null;
  onBack: () => void;
  onUpgradeSuccess?: () => void;
}

export function SubscriptionPage({ user, accessToken, onBack, onUpgradeSuccess }: SubscriptionPageProps) {
  const [currentTier, setCurrentTier] = useState<'free' | 'pro' | 'business' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    if (accessToken && user) {
      loadSubscription();
    } else {
      setIsLoading(false);
    }
  }, [accessToken, user]);

  const loadSubscription = async () => {
    try {
      const { data: profile, error } = await AuthService.getProfile(accessToken || undefined);
      if (!error && profile) {
        setCurrentTier(profile.tier || 'free');
      } else {
        setCurrentTier('free');
      }
    } catch (err) {
      console.error('Failed to load subscription:', err);
      setCurrentTier('free');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (tier: 'pro' | 'business') => {
    if (!accessToken || !user) {
      alert('Please log in to upgrade your subscription');
      return;
    }

    setIsUpgrading(true);
    try {
      // TODO: Integrate with Stripe or payment provider
      // For now, we'll just show a message
      alert(`Upgrade to ${tier.toUpperCase()} coming soon! Payment integration will be added here.`);
      
      // In production, this would:
      // 1. Create a Stripe checkout session
      // 2. Redirect to Stripe payment page
      // 3. Handle webhook to update subscription in database
      
      if (onUpgradeSuccess) {
        onUpgradeSuccess();
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      alert('Failed to process upgrade. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const tiers = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'Forever',
      description: 'Perfect for getting started with RMG industry news',
      color: '#6F83A7',
      icon: Sparkles,
      features: [
        'Personalized news by role',
        'Access to all news articles',
        'Basic AI summaries',
        'Category filtering',
        'Search functionality',
        'Email notifications',
      ],
      limitations: [
        'No preference-based personalization',
        'No reading pattern analysis',
        'No advanced AI insights',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'AI-powered personalization and advanced insights',
      color: '#57ACAF',
      icon: Crown,
      features: [
        'Everything in Free',
        'AI-powered personalization by preferences',
        'Reading pattern analysis',
        'Advanced AI insights and recommendations',
        'Priority support',
        'Export articles to PDF',
        'Reading history analytics',
        'Custom news alerts',
      ],
      popular: true,
    },
    {
      id: 'business',
      name: 'Business',
      price: '$99',
      period: 'per month',
      description: 'Complete business intelligence for RMG professionals',
      color: '#EAB308',
      icon: Zap,
      features: [
        'Everything in Pro',
        'Market Analysis Copilot',
        'Business Analysis Reports',
        'Industry Analysis Reports',
        'PDF report export',
        'API access',
        'White-label reports',
        'Dedicated account manager',
        'Custom integrations',
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gradient-to-br dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#57ACAF] dark:border-[#EAB308] mx-auto mb-4"></div>
          <p className="text-[#6F83A7] dark:text-[#9BA5B7]">Loading subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Separator className="w-12 bg-[#EAB308] dark:bg-[#101725]" />
            <div className="w-16 h-16 flex items-center justify-center bg-white dark:bg-[#101725] rounded p-2">
              <img src={logoImage} alt="RMG Insight Logo" className="w-full h-full object-contain" />
            </div>
            <Separator className="w-12 bg-[#EAB308] dark:bg-[#101725]" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#101725] dark:text-[#E5E7EB] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Choose Your Plan
          </h1>
          <p className="text-lg text-[#6F83A7] dark:text-[#9BA5B7] max-w-2xl mx-auto">
            Unlock powerful features to get the most relevant RMG industry insights tailored to your needs
          </p>
        </motion.div>

        {/* Current Subscription Badge */}
        {currentTier && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="px-4 py-2 text-sm uppercase tracking-wider" style={{
              backgroundColor: tiers.find(t => t.id === currentTier)?.color || '#6F83A7',
              color: 'white',
            }}>
              Current Plan: {tiers.find(t => t.id === currentTier)?.name || 'Free'}
            </Badge>
          </motion.div>
        )}

        {/* Subscription Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            const isCurrentTier = currentTier === tier.id;
            const isUpgradeable = currentTier === 'free' && tier.id === 'pro' || 
                                 currentTier === 'pro' && tier.id === 'business' ||
                                 currentTier === 'free' && tier.id === 'business';

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${tier.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="px-4 py-1 text-xs uppercase tracking-wider bg-gradient-to-r from-[#EAB308] to-[#F59E0B] text-[#101725]">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <Card className={`h-full border-2 transition-all ${
                  isCurrentTier 
                    ? `border-[${tier.color}] dark:border-[${tier.color}] shadow-lg` 
                    : tier.popular
                    ? 'border-[#57ACAF] dark:border-[#EAB308] shadow-xl'
                    : 'border-[#E5E7EB] dark:border-[#6F83A7] hover:border-[#57ACAF] dark:hover:border-[#EAB308]'
                } bg-white dark:bg-[#182336]`}>
                  <div className="p-6">
                    {/* Tier Header */}
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4`} style={{
                        backgroundColor: `${tier.color}20`,
                      }}>
                        <Icon className="w-8 h-8" style={{ color: tier.color }} />
                      </div>
                      <h3 className="text-2xl font-bold text-[#101725] dark:text-[#E5E7EB] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                        {tier.name}
                      </h3>
                      <div className="mb-2">
                        <span className="text-4xl font-bold text-[#101725] dark:text-[#E5E7EB]" style={{ color: tier.color }}>
                          {tier.price}
                        </span>
                        <span className="text-[#6F83A7] dark:text-[#9BA5B7] text-sm ml-2">
                          /{tier.period}
                        </span>
                      </div>
                      <p className="text-sm text-[#6F83A7] dark:text-[#9BA5B7]">
                        {tier.description}
                      </p>
                    </div>

                    <Separator className="mb-6 bg-[#E5E7EB] dark:bg-[#6F83A7]" />

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                          <span className="text-sm text-[#101725] dark:text-[#E5E7EB]">
                            {feature}
                          </span>
                        </li>
                      ))}
                      {tier.limitations && tier.limitations.map((limitation, idx) => (
                        <li key={`lim-${idx}`} className="flex items-start gap-3 opacity-60">
                          <Lock className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#6F83A7] dark:text-[#9BA5B7]" />
                          <span className="text-sm text-[#6F83A7] dark:text-[#9BA5B7] line-through">
                            {limitation}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    <Button
                      onClick={() => {
                        if (isCurrentTier) {
                          // Already on this tier
                          return;
                        } else if (isUpgradeable) {
                          handleUpgrade(tier.id as 'pro' | 'business');
                        } else {
                          alert('Please upgrade to a lower tier first');
                        }
                      }}
                      disabled={isCurrentTier || isUpgrading || !accessToken}
                      className={`w-full py-6 uppercase tracking-wider transition-all ${
                        isCurrentTier
                          ? 'bg-[#6F83A7] dark:bg-[#6F83A7] text-white cursor-not-allowed'
                          : tier.popular
                          ? 'bg-gradient-to-r from-[#57ACAF] to-[#6F83A7] hover:from-[#101725] hover:to-[#101725] dark:from-[#EAB308] dark:to-[#F59E0B] dark:hover:from-[#57ACAF] dark:hover:to-[#57ACAF] text-white dark:text-[#101725] dark:hover:text-white'
                          : 'bg-gradient-to-r from-[#101725] to-[#182336] hover:from-[#57ACAF] hover:to-[#6F83A7] dark:from-[#6F83A7] dark:to-[#57ACAF] dark:hover:from-[#EAB308] dark:hover:to-[#F59E0B] text-white'
                      }`}
                    >
                      {isCurrentTier ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Current Plan
                        </>
                      ) : isUpgradeable ? (
                        <>
                          Upgrade to {tier.name}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Upgrade Required
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-2 border-[#E5E7EB] dark:border-[#6F83A7] hover:border-[#57ACAF] dark:hover:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-[#E5E7EB] px-8 py-6 uppercase tracking-wider"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

