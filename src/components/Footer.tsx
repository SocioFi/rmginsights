import { motion } from 'motion/react';
import { Separator } from './ui/separator';
import { Mail, MapPin, Phone, Globe, Facebook, Linkedin, Youtube } from 'lucide-react';

interface FooterProps {
  onNavigatePrivacy?: () => void;
  onNavigateTerms?: () => void;
}

export function Footer({ onNavigatePrivacy, onNavigateTerms }: FooterProps = { onNavigatePrivacy: undefined, onNavigateTerms: undefined }) {
  return (
    <footer className="bg-white dark:bg-gradient-to-br dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] border-t-4 border-[#101725] dark:border-[#EAB308] transition-all duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
            {/* Column 1 - About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <h3 
                className="text-2xl text-[#101725] dark:text-[#F9FAFB] mb-4 border-b-2 border-[#EAB308] pb-2 inline-block transition-all" 
                style={{ fontFamily: 'Georgia, serif' }}
              >
                RMG Insight
              </h3>
              <p className="text-[#6F83A7] dark:text-[#9BA5B7] text-sm mb-4 leading-relaxed transition-all">
                Your trusted source for Bangladesh's garment industry news. Powered by FabricXAI's MARBIM agentic AI system, delivering personalized insights to factory owners, merchandisers, buyers, compliance officers, and investors.
              </p>
              <div className="space-y-2 text-sm text-[#6F83A7] dark:text-[#9BA5B7] transition-all">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#EAB308]" />
                  Dhaka, Bangladesh
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#EAB308]" />
                  <a href="mailto:info@fabricxai.com" className="hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    info@fabricxai.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#EAB308]" />
                  <a href="https://www.fabricxai.com" className="hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    www.fabricxai.com
                  </a>
                </p>
              </div>
            </motion.div>

            {/* Column 2 - Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-sm uppercase tracking-widest text-[#101725] dark:text-[#E5E7EB] mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 transition-all">
                Sections
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    Business
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    Industry
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    Compliance
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    Markets
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    Technology
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    Sustainability
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Column 3 - Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-sm uppercase tracking-widest text-[#101725] dark:text-[#E5E7EB] mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 transition-all">
                Services
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    AI Insights
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    Market Data
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    Daily Digest
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    Personalization
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    Analytics
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Column 4 - Legal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-sm uppercase tracking-widest text-[#101725] dark:text-[#E5E7EB] mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 transition-all">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    Contact
                  </a>
                </li>
                <li>
                  <button 
                    onClick={onNavigatePrivacy}
                    className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onNavigateTerms}
                    className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <a href="#" className="text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#101725] dark:hover:text-[#EAB308] transition-all">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Middle Divider with Social */}
        <div className="py-6 border-y-2 border-gray-200 dark:border-gray-700 transition-all">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider transition-all">
                Follow Us
              </span>
              <Separator orientation="vertical" className="h-4 bg-gray-300 dark:bg-gray-700" />
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-8 h-8 border border-[#101725] dark:border-[#EAB308] text-[#101725] dark:text-[#9BA5B7] flex items-center justify-center hover:bg-[#101725] dark:hover:bg-[#EAB308] hover:text-white dark:hover:text-[#101725] transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 border border-[#101725] dark:border-[#EAB308] text-[#101725] dark:text-[#9BA5B7] flex items-center justify-center hover:bg-[#101725] dark:hover:bg-[#EAB308] hover:text-white dark:hover:text-[#101725] transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 border border-[#101725] dark:border-[#EAB308] text-[#101725] dark:text-[#9BA5B7] flex items-center justify-center hover:bg-[#101725] dark:hover:bg-[#EAB308] hover:text-white dark:hover:text-[#101725] transition-all"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider transition-all">
                Powered by
              </p>
              <p 
                className="text-lg text-[#101725] dark:text-transparent dark:bg-gradient-to-r dark:from-[#EAB308] dark:to-[#F59E0B] dark:bg-clip-text transition-all" 
                style={{ fontFamily: 'Georgia, serif' }}
              >
                FabricXAI • MARBIM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#6F83A7] dark:text-[#9BA5B7] transition-all">
            <p>
              © 2025 SocioFi Technology. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span>Made in Bangladesh</span>
              <span className="text-xl">🇧🇩</span>
            </div>
            <p className="italic">
              "All the News That's Fit to Print"
            </p>
          </div>
        </div>

        {/* Final Border */}
        <div className="border-t-2 border-[#101725] dark:border-[#EAB308] transition-all"></div>
      </div>
    </footer>
  );
}
