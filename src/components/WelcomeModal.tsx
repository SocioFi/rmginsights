import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, Crown, ArrowRight, X } from 'lucide-react';
import { Separator } from './ui/separator';
import logoImage from 'figma:asset/b912a80f881cf1ec7c838d822f0de9df1ed32ebf.png';

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
  onViewSubscriptions: () => void;
}

export function WelcomeModal({ open, onOpenChange, userName, onViewSubscriptions }: WelcomeModalProps) {
  const subscriptionTiers = [
    {
      tier: 'Free',
      features: [
        'Personalized news by role',
        'Access to all news articles',
        'Basic AI summaries',
        'Category filtering',
      ],
      color: '#6F83A7',
    },
    {
      tier: 'Pro',
      features: [
        'Everything in Free',
        'AI-powered personalization',
        'Reading pattern analysis',
        'Advanced AI insights',
        'Priority support',
      ],
      color: '#57ACAF',
    },
    {
      tier: 'Business',
      features: [
        'Everything in Pro',
        'Market Analysis Copilot',
        'Business Analysis Reports',
        'Industry Analysis Reports',
        'PDF report export',
        'API access',
      ],
      color: '#EAB308',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-white via-[#F9FAFB] to-white dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] border-2 border-[#101725] dark:border-[#EAB308] rounded-none w-[90vw] max-w-[800px] max-h-[90vh] p-0 shadow-2xl overflow-hidden">
        {/* Decorative Header */}
        <div className="relative bg-gradient-to-r from-[#101725] via-[#182336] to-[#101725] dark:from-[#EAB308] dark:via-[#F59E0B] dark:to-[#EAB308] p-8 pb-12">
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
              <div className="w-16 h-16 flex items-center justify-center bg-white dark:bg-[#101725] rounded p-2">
                <img src={logoImage} alt="RMG Insight Logo" className="w-full h-full object-contain" />
              </div>
              <Separator className="w-12 bg-[#EAB308] dark:bg-[#101725]" />
            </motion.div>

            <DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="w-8 h-8 text-white dark:text-[#101725]" />
                  <DialogTitle className="text-white dark:text-[#101725] text-3xl mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    Welcome to RMG Insight!
                  </DialogTitle>
                </div>
                <DialogDescription className="text-[#EAB308] dark:text-[#101725] text-center text-sm uppercase tracking-widest">
                  {userName ? `Hello, ${userName}!` : 'Your account is verified'}
                </DialogDescription>
              </motion.div>
            </DialogHeader>
          </div>

          {/* Curved Bottom Edge */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-white dark:bg-[#101725]" style={{
            clipPath: 'ellipse(70% 100% at 50% 100%)'
          }} />
        </div>

        <div className="px-8 pb-8 -mt-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <p className="text-[#101725] dark:text-[#E5E7EB] text-lg mb-2">
              Your email has been verified successfully!
            </p>
            <p className="text-[#6F83A7] dark:text-[#9BA5B7] text-sm">
              You're all set to explore personalized news and insights for the RMG industry.
            </p>
          </motion.div>

          {/* Subscription Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Separator className="w-12 bg-[#E5E7EB] dark:bg-[#6F83A7]" />
              <h3 className="text-[#101725] dark:text-[#E5E7EB] text-xl font-semibold uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                Subscription Tiers
              </h3>
              <Separator className="w-12 bg-[#E5E7EB] dark:bg-[#6F83A7]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subscriptionTiers.map((tier, index) => (
                <motion.div
                  key={tier.tier}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="border-2 border-[#E5E7EB] dark:border-[#6F83A7] p-6 bg-white dark:bg-[#182336] hover:border-[#57ACAF] dark:hover:border-[#EAB308] transition-all"
                >
                  <div className="flex items-center gap-2 mb-4">
                    {tier.tier === 'Free' ? (
                      <Sparkles className="w-5 h-5" style={{ color: tier.color }} />
                    ) : tier.tier === 'Pro' ? (
                      <Crown className="w-5 h-5" style={{ color: tier.color }} />
                    ) : (
                      <Crown className="w-5 h-5" style={{ color: tier.color }} />
                    )}
                    <h4 className="text-[#101725] dark:text-[#E5E7EB] text-lg font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                      {tier.tier}
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#6F83A7] dark:text-[#9BA5B7]">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={onViewSubscriptions}
              className="flex-1 bg-gradient-to-r from-[#EAB308] to-[#F59E0B] hover:from-[#101725] hover:to-[#101725] dark:from-[#EAB308] dark:to-[#F59E0B] dark:hover:from-[#57ACAF] dark:hover:to-[#57ACAF] text-[#101725] hover:text-white dark:text-[#101725] dark:hover:text-white uppercase tracking-widest text-sm py-6 transition-all shadow-md group"
            >
              <Crown className="w-4 h-4 mr-2" />
              View Subscriptions
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 border-2 border-[#E5E7EB] dark:border-[#6F83A7] hover:border-[#57ACAF] dark:hover:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-[#E5E7EB] uppercase tracking-widest text-sm py-6 transition-all"
            >
              Start Exploring
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

