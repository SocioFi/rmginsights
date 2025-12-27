import { motion } from 'motion/react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowLeft, Shield, Eye, Cookie, Database, Lock, Users, Mail, FileText } from 'lucide-react';

interface PrivacyPolicyPageProps {
  user: any;
  onLoginClick: () => void;
  onPersonalizeClick: () => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateBusiness: () => void;
  onNavigateIndustry: () => void;
  onNavigateMarkets: () => void;
  onNavigateSaved: () => void;
  onNavigateHistory: () => void;
  onNavigateTerms?: () => void;
}

export function PrivacyPolicyPage({
  user,
  onLoginClick,
  onPersonalizeClick,
  onLogout,
  onNavigateHome,
  onNavigateBusiness,
  onNavigateIndustry,
  onNavigateMarkets,
  onNavigateSaved,
  onNavigateHistory,
  onNavigateTerms,
}: PrivacyPolicyPageProps) {
  const sections = [
    {
      icon: Database,
      title: '1. Information We Collect',
      content: [
        {
          subtitle: 'Account Information',
          text: 'When you create an account with RMG Insight, we collect your name, email address, company name, and role within the garment industry. This information helps us personalize your news experience and provide relevant industry insights.'
        },
        {
          subtitle: 'Usage Data',
          text: 'We automatically collect information about how you interact with our platform, including articles read, time spent on pages, search queries, and feature usage. This data powers our AI recommendation engine to deliver content tailored to your interests.'
        },
        {
          subtitle: 'Device Information',
          text: 'We collect technical information such as IP address, browser type, device type, and operating system to ensure optimal performance and security of our services across all platforms.'
        }
      ]
    },
    {
      icon: Eye,
      title: '2. How We Use Your Information',
      content: [
        {
          subtitle: 'Content Personalization',
          text: 'Your preferences, role, and reading history enable our AI-powered system (FabricXAI) to curate news, insights, and market analysis specifically relevant to your position in the RMG industry.'
        },
        {
          subtitle: 'Service Improvement',
          text: 'We analyze aggregated usage patterns to enhance our platform features, improve article recommendations, and develop new tools like our AI Copilot services for Business, Industry, and Markets sections.'
        },
        {
          subtitle: 'Communications',
          text: 'We use your email to send important platform updates, personalized newsletters, breaking news alerts, and premium feature announcements. You can manage your communication preferences in your account settings.'
        }
      ]
    },
    {
      icon: Cookie,
      title: '3. Cookies and Tracking',
      content: [
        {
          subtitle: 'Essential Cookies',
          text: 'We use necessary cookies to maintain your session, remember your login status, and ensure secure access to your personalized dashboard and saved articles.'
        },
        {
          subtitle: 'Analytics Cookies',
          text: 'Analytics tools help us understand user behavior, popular content categories, and feature engagement. This data is anonymized and used solely for platform improvement.'
        },
        {
          subtitle: 'Preference Cookies',
          text: 'We store your theme preferences (dark/light mode), language settings, and content filters to provide a consistent experience across devices.'
        }
      ]
    },
    {
      icon: Users,
      title: '4. Third-Party Services',
      content: [
        {
          subtitle: 'Authentication Providers',
          text: 'We integrate with Supabase Auth for secure user authentication. When you sign up or log in using social providers (Google, GitHub), we receive only basic profile information as permitted by those platforms.'
        },
        {
          subtitle: 'AI Processing',
          text: 'FabricXAI, our AI partner, processes your reading patterns and preferences to generate personalized insights, article rewrites, and copilot responses. All data is encrypted and handled according to strict confidentiality standards.'
        },
        {
          subtitle: 'Analytics Services',
          text: 'We use privacy-focused analytics tools to monitor platform performance and user engagement. These services are configured to respect user privacy and comply with international data protection standards.'
        }
      ]
    },
    {
      icon: Lock,
      title: '5. Data Security',
      content: [
        {
          subtitle: 'Encryption',
          text: 'All data transmission between your device and our servers is encrypted using industry-standard TLS/SSL protocols. Your password is hashed using bcrypt with secure salt rounds.'
        },
        {
          subtitle: 'Access Controls',
          text: 'We implement strict role-based access controls. Only authorized personnel with legitimate business needs can access user data, and all access is logged and monitored.'
        },
        {
          subtitle: 'Data Storage',
          text: 'Your data is stored on secure Supabase infrastructure with automatic backups, geographic redundancy, and compliance with international data protection regulations including GDPR.'
        }
      ]
    },
    {
      icon: Shield,
      title: '6. Your Rights',
      content: [
        {
          subtitle: 'Access and Portability',
          text: 'You have the right to access all personal data we hold about you. You can export your reading history, saved articles, and preferences at any time from your account dashboard.'
        },
        {
          subtitle: 'Correction and Deletion',
          text: 'You can update your profile information, preferences, and communication settings at any time. You may also request complete account deletion, which will permanently remove all your personal data within 30 days.'
        },
        {
          subtitle: 'Opt-Out Rights',
          text: 'You can opt out of personalized recommendations, marketing communications, and analytics tracking. Note that some features may be limited if you disable personalization.'
        }
      ]
    },
    {
      icon: FileText,
      title: '7. Data Retention',
      content: [
        {
          subtitle: 'Active Accounts',
          text: 'We retain your account data and reading history for as long as your account remains active. This enables continuous improvement of personalization and access to your saved content.'
        },
        {
          subtitle: 'Inactive Accounts',
          text: 'If your account is inactive for 24 months, we will send notification emails. After 36 months of inactivity, we may archive or delete your account data in accordance with our data retention policy.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may retain certain data for longer periods when required by law, for legitimate business purposes, or to resolve disputes and enforce our agreements.'
        }
      ]
    },
    {
      icon: Mail,
      title: '8. Contact Information',
      content: [
        {
          subtitle: 'Privacy Questions',
          text: 'For any privacy-related inquiries, data access requests, or concerns about how your information is handled, please contact our Data Protection Officer at privacy@rmginsight.com'
        },
        {
          subtitle: 'General Support',
          text: 'For platform support and general inquiries, reach us at support@rmginsight.com or call +880 1234-567890 (Monday to Saturday, 9 AM - 6 PM Bangladesh Time).'
        },
        {
          subtitle: 'Policy Updates',
          text: 'We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify users of significant changes via email and platform notifications.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a]">
      <Header
        user={user}
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

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#101725] via-[#182336] to-[#101725] dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] border-b-4 border-[#EAB308]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* Back Button */}
          <motion.button
            onClick={onNavigateHome}
            className="flex items-center gap-2 mb-6 text-[#9BA5B7] hover:text-[#EAB308] transition-colors group"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:text-[#EAB308]" />
            <span className="text-sm uppercase tracking-wider">Back to Home</span>
          </motion.button>

          {/* Title */}
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-[#EAB308] to-[#F59E0B] rounded-lg">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#101725]" />
            </div>
            <div className="flex-1">
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl text-white mb-3"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Privacy Policy
              </h1>
              <p className="text-[#9BA5B7] text-sm sm:text-base max-w-3xl">
                Your privacy is paramount. This policy outlines how RMG Insight — Powered by FabricXAI collects, uses, and protects your personal information.
              </p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-[#6F83A7]">
            <span>Last Updated: November 3, 2025</span>
            <span className="hidden sm:inline">•</span>
            <span>Effective Date: January 1, 2025</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Introduction */}
        <div className="mb-12 p-6 bg-gradient-to-br from-[#EAB308]/5 to-[#57ACAF]/5 dark:from-[#EAB308]/10 dark:to-[#57ACAF]/10 border-l-4 border-[#EAB308] rounded-r-lg">
          <p className="text-[#101725] dark:text-[#E5E7EB] leading-relaxed">
            At <strong>RMG Insight</strong>, we are committed to protecting your privacy and maintaining transparency about our data practices. This Privacy Policy explains how we collect, use, share, and safeguard your information when you use our AI-powered news platform tailored for the Ready-Made Garments industry in Bangladesh.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-12">
          {sections.map((section, idx) => {
            const IconComponent = section.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border-b border-[#E5E7EB] dark:border-[#2D3748] pb-8 last:border-b-0"
              >
                {/* Section Title */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-gradient-to-br from-[#57ACAF]/20 to-[#6F83A7]/20 dark:from-[#57ACAF]/30 dark:to-[#6F83A7]/30 rounded-lg">
                    <IconComponent className="w-5 h-5 text-[#57ACAF]" />
                  </div>
                  <h2 
                    className="text-xl sm:text-2xl text-[#101725] dark:text-[#F9FAFB]"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {section.title}
                  </h2>
                </div>

                {/* Section Content */}
                <div className="space-y-6 pl-0 sm:pl-12">
                  {section.content.map((item, itemIdx) => (
                    <div key={itemIdx}>
                      <h3 className="uppercase tracking-wider text-sm text-[#57ACAF] dark:text-[#57ACAF] mb-2">
                        {item.subtitle}
                      </h3>
                      <p className="text-[#4B5563] dark:text-[#9BA5B7] leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-16 p-6 bg-gradient-to-br from-[#101725] to-[#182336] dark:from-[#0a0e1a] dark:to-[#101725] border-2 border-[#EAB308] rounded-lg">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-[#EAB308] flex-shrink-0 mt-1" />
            <div>
              <h3 
                className="text-lg text-white mb-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Your Trust Matters
              </h3>
              <p className="text-[#9BA5B7] text-sm leading-relaxed">
                We are dedicated to earning and maintaining your trust. If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact us at <a href="mailto:privacy@rmginsight.com" className="text-[#EAB308] hover:underline">privacy@rmginsight.com</a>. We're here to help.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
