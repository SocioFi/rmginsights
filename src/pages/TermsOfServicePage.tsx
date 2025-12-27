import { motion } from 'motion/react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowLeft, FileText, UserCheck, Scale, AlertCircle, Shield, Ban, Zap, HelpCircle, Gavel } from 'lucide-react';

interface TermsOfServicePageProps {
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
  onNavigatePrivacy?: () => void;
}

export function TermsOfServicePage({
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
  onNavigatePrivacy,
}: TermsOfServicePageProps) {
  const sections = [
    {
      icon: UserCheck,
      title: '1. Acceptance of Terms',
      content: [
        {
          subtitle: 'Agreement to Terms',
          text: 'By accessing or using RMG Insight — Powered by FabricXAI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. These terms apply to all users, including visitors, registered users, and premium subscribers.'
        },
        {
          subtitle: 'Eligibility',
          text: 'You must be at least 18 years old and have the legal capacity to enter into binding contracts to use this Service. By using RMG Insight, you represent and warrant that you meet these eligibility requirements.'
        },
        {
          subtitle: 'Business Use',
          text: 'This Service is designed for professionals in the Ready-Made Garments industry including factory owners, merchandisers, buyers, compliance officers, and investors. You agree to use the Service only for lawful business purposes related to the RMG sector.'
        }
      ]
    },
    {
      icon: FileText,
      title: '2. Account Registration',
      content: [
        {
          subtitle: 'Account Creation',
          text: 'To access certain features, you must create an account by providing accurate, complete, and current information including your name, email address, company name, and role within the garment industry. You are responsible for maintaining the confidentiality of your account credentials.'
        },
        {
          subtitle: 'Account Security',
          text: 'You are solely responsible for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other security breach. We will not be liable for any loss or damage arising from your failure to protect your account information.'
        },
        {
          subtitle: 'Account Termination',
          text: 'You may terminate your account at any time by contacting us at support@rmginsight.com. We reserve the right to suspend or terminate your account if you violate these Terms of Service or engage in conduct that we deem inappropriate or harmful to the Service or other users.'
        }
      ]
    },
    {
      icon: Scale,
      title: '3. User Responsibilities',
      content: [
        {
          subtitle: 'Lawful Use',
          text: 'You agree to use the Service only for lawful purposes and in compliance with all applicable local, national, and international laws and regulations. You shall not use the Service in any manner that could damage, disable, or impair the Service.'
        },
        {
          subtitle: 'Prohibited Activities',
          text: 'You may not: (a) use automated systems to access the Service without permission; (b) attempt to gain unauthorized access to any part of the Service; (c) interfere with or disrupt the Service; (d) transmit viruses or malicious code; (e) harvest or collect user information; or (f) use the Service for competitive analysis or to build similar products.'
        },
        {
          subtitle: 'Content Sharing',
          text: 'While we encourage sharing insights within your organization, you may not redistribute, republish, or resell our content without explicit written permission. Premium features and AI-generated insights are licensed for your individual or organizational use only.'
        }
      ]
    },
    {
      icon: Zap,
      title: '4. Service Description',
      content: [
        {
          subtitle: 'AI-Powered Features',
          text: 'RMG Insight uses FabricXAI\'s MARBIM agentic AI system to deliver personalized news curation, article rewriting, social media post generation, and AI Copilot services. These AI features are provided "as is" and may not always be 100% accurate. You should verify critical information before making business decisions.'
        },
        {
          subtitle: 'Service Availability',
          text: 'We strive to maintain high availability but do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or technical issues. We reserve the right to modify, suspend, or discontinue any feature at any time without prior notice.'
        },
        {
          subtitle: 'Content Sources',
          text: 'News articles and insights are aggregated from various sources. While we strive for accuracy, we do not guarantee the completeness, reliability, or timeliness of any content. Articles represent the views of their original publishers, not necessarily those of RMG Insight or FabricXAI.'
        }
      ]
    },
    {
      icon: Shield,
      title: '5. Intellectual Property',
      content: [
        {
          subtitle: 'Our Content',
          text: 'All content, features, and functionality of RMG Insight, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are owned by RMG Insight, FabricXAI, or our content suppliers and are protected by international copyright, trademark, and other intellectual property laws.'
        },
        {
          subtitle: 'Limited License',
          text: 'We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your personal or internal business purposes. This license does not permit you to download (except for page caching) or modify any portion of the Service without our express written consent.'
        },
        {
          subtitle: 'User-Generated Content',
          text: 'By submitting questions to AI Copilot, saving articles, or engaging with features, you grant us a worldwide, non-exclusive, royalty-free license to use this data to improve our AI algorithms and personalization features, always in accordance with our Privacy Policy.'
        }
      ]
    },
    {
      icon: AlertCircle,
      title: '6. Disclaimers',
      content: [
        {
          subtitle: 'No Professional Advice',
          text: 'The information provided through RMG Insight is for informational purposes only and should not be construed as professional, legal, financial, or business advice. You should consult with appropriate professionals before making business decisions based on content from our platform.'
        },
        {
          subtitle: '"As Is" Service',
          text: 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.'
        },
        {
          subtitle: 'AI Accuracy',
          text: 'While our AI-powered features use advanced technology, we do not guarantee the accuracy, completeness, or reliability of AI-generated summaries, rewrites, or recommendations. AI outputs should be reviewed and verified before being used for critical business purposes.'
        }
      ]
    },
    {
      icon: Ban,
      title: '7. Limitation of Liability',
      content: [
        {
          subtitle: 'Damages',
          text: 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, RMG INSIGHT AND FABRICXAI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.'
        },
        {
          subtitle: 'Maximum Liability',
          text: 'Our total liability to you for any claims arising out of or related to these Terms or the Service shall not exceed the amount you paid us in the twelve (12) months prior to the event giving rise to the liability, or $100 USD if you have not paid us anything.'
        },
        {
          subtitle: 'Jurisdiction Limitations',
          text: 'Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability for incidental or consequential damages. In such jurisdictions, our liability will be limited to the greatest extent permitted by law.'
        }
      ]
    },
    {
      icon: Gavel,
      title: '8. Subscription & Payment',
      content: [
        {
          subtitle: 'Premium Features',
          text: 'Certain features, including Market Copilot and advanced analytics, may require a premium subscription. Subscription fees are charged in advance on a recurring basis (monthly or annually) and are non-refundable except as required by law.'
        },
        {
          subtitle: 'Price Changes',
          text: 'We reserve the right to modify subscription pricing at any time. We will provide at least 30 days\' notice of any price changes. If you do not agree to the price change, you may cancel your subscription before the change takes effect.'
        },
        {
          subtitle: 'Cancellation',
          text: 'You may cancel your premium subscription at any time from your account settings. Cancellation will be effective at the end of your current billing period. You will continue to have access to premium features until the end of the paid period.'
        }
      ]
    },
    {
      icon: HelpCircle,
      title: '9. Dispute Resolution',
      content: [
        {
          subtitle: 'Governing Law',
          text: 'These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the courts located in Dhaka, Bangladesh.'
        },
        {
          subtitle: 'Informal Resolution',
          text: 'Before filing a claim, you agree to contact us at legal@rmginsight.com and attempt to resolve the dispute informally. We will attempt to resolve the dispute through good faith negotiations within 30 days of receiving your notice.'
        },
        {
          subtitle: 'Arbitration',
          text: 'If informal resolution fails, any dispute shall be resolved through binding arbitration in accordance with the Arbitration Act of Bangladesh. The arbitration will be conducted in English in Dhaka, Bangladesh. Each party shall bear its own costs.'
        }
      ]
    },
    {
      icon: FileText,
      title: '10. General Provisions',
      content: [
        {
          subtitle: 'Modifications',
          text: 'We reserve the right to modify these Terms at any time. We will notify you of material changes via email or through a notice on the Service. Your continued use of the Service after changes become effective constitutes acceptance of the modified Terms.'
        },
        {
          subtitle: 'Severability',
          text: 'If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.'
        },
        {
          subtitle: 'Entire Agreement',
          text: 'These Terms, together with our Privacy Policy, constitute the entire agreement between you and RMG Insight regarding the use of the Service and supersede all prior agreements and understandings, whether written or oral.'
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
              <Scale className="w-8 h-8 sm:w-10 sm:h-10 text-[#101725]" />
            </div>
            <div className="flex-1">
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl text-white mb-3"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Terms of Service
              </h1>
              <p className="text-[#9BA5B7] text-sm sm:text-base max-w-3xl">
                Please read these terms carefully before using RMG Insight — Powered by FabricXAI. By using our Service, you agree to be bound by these terms.
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
            Welcome to <strong>RMG Insight</strong>. These Terms of Service ("Terms") govern your access to and use of our AI-powered news platform designed for professionals in Bangladesh's Ready-Made Garments industry. By creating an account or using any part of the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms.
          </p>
        </div>

        {/* Terms Sections */}
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

        {/* Contact Section */}
        <div className="mt-16 p-6 bg-gradient-to-br from-[#101725] to-[#182336] dark:from-[#0a0e1a] dark:to-[#101725] border-2 border-[#EAB308] rounded-lg">
          <div className="flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-[#EAB308] flex-shrink-0 mt-1" />
            <div>
              <h3 
                className="text-lg text-white mb-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Questions About These Terms?
              </h3>
              <p className="text-[#9BA5B7] text-sm leading-relaxed mb-3">
                If you have any questions or concerns about these Terms of Service, please contact our legal team at <a href="mailto:legal@rmginsight.com" className="text-[#EAB308] hover:underline">legal@rmginsight.com</a> or reach out to general support at <a href="mailto:support@rmginsight.com" className="text-[#EAB308] hover:underline">support@rmginsight.com</a>.
              </p>
              <p className="text-[#9BA5B7] text-sm">
                For privacy-related matters, please refer to our{' '}
                {onNavigatePrivacy ? (
                  <button 
                    onClick={onNavigatePrivacy}
                    className="text-[#EAB308] hover:underline"
                  >
                    Privacy Policy
                  </button>
                ) : (
                  <span className="text-[#EAB308]">Privacy Policy</span>
                )}.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigatePrivacy={onNavigatePrivacy} />
    </div>
  );
}
