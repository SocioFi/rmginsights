import { motion } from 'motion/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { Mail, Bell, Loader2, CheckCircle2 } from 'lucide-react';
import { Separator } from './ui/separator';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubscribeStatus('idle');
    setErrorMessage('');

    try {
      // Simulate API call - replace with actual subscription logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Subscribe:', email);
      setSubscribeStatus('success');
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubscribeStatus('idle');
      }, 5000);
    } catch (error) {
      setSubscribeStatus('error');
      setErrorMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-white dark:bg-gradient-to-br dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] border-y-4 border-[#101725] dark:border-[#EAB308] transition-all duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Newspaper Style Subscription Box */}
          <div className="border-4 border-[#101725] dark:border-[#EAB308] bg-gray-50 dark:bg-gradient-to-br dark:from-[#101725]/80 dark:to-[#182336]/80 backdrop-blur-sm p-8 transition-all shadow-xl dark:shadow-[#EAB308]/10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Headline */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-6 h-6 text-[#EAB308]" />
                  <span 
                    className="text-xs uppercase tracking-[0.3em] text-[#6F83A7] dark:text-[#9BA5B7] transition-all"
                  >
                    Daily Digest
                  </span>
                </div>
                
                <h3 
                  className="text-3xl md:text-4xl text-[#101725] dark:text-[#F9FAFB] mb-4 leading-tight transition-all" 
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Get Tomorrow's News Today
                </h3>
                
                <div className="space-y-2 text-[#6F83A7] dark:text-[#9BA5B7] mb-4 transition-all">
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#EAB308] rounded-full"></span>
                    AI-curated industry insights delivered at 6 AM
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#EAB308] rounded-full"></span>
                    Personalized for your role and interests
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#EAB308] rounded-full"></span>
                    Weekly market analysis and trends
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-300 dark:border-gray-600 transition-all">
                  <span className="text-sm text-[#6F83A7] dark:text-[#9BA5B7] italic transition-all">
                    Join 12,847 industry professionals
                  </span>
                </div>
              </div>

              {/* Right Side - Subscription Form */}
              <div className="bg-white dark:bg-gradient-to-br dark:from-[#0a0e1a] dark:to-[#101725] border-2 border-[#101725] dark:border-[#EAB308] p-6 transition-all">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b-2 border-[#EAB308] transition-all">
                  <Mail className="w-5 h-5 text-[#EAB308]" />
                  <h4 
                    className="text-xl text-[#101725] dark:text-[#F9FAFB] transition-all" 
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {subscribeStatus === 'success' ? 'Subscribed!' : 'Subscribe Now'}
                  </h4>
                </div>

                {subscribeStatus === 'success' ? (
                  /* Success State */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center space-y-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="flex justify-center"
                    >
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                      </div>
                    </motion.div>
                    
                    <div>
                      <h5 className="text-lg text-[#101725] dark:text-[#F9FAFB] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                        Welcome to RMG Insight!
                      </h5>
                      <p className="text-sm text-[#6F83A7] dark:text-[#9BA5B7]">
                        Check your inbox for a confirmation email. Your first daily digest will arrive tomorrow at 6 AM.
                      </p>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={() => setSubscribeStatus('idle')}
                        variant="outline"
                        className="border-2 border-[#101725] dark:border-[#EAB308] text-[#101725] dark:text-[#EAB308] hover:bg-[#101725] hover:text-white dark:hover:bg-[#EAB308] dark:hover:text-[#101725] rounded-none uppercase tracking-wider text-xs"
                      >
                        Subscribe Another Email
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  /* Form State */
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#6F83A7] dark:text-[#9BA5B7] mb-2 block transition-all">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-[#101725] dark:text-white focus:border-[#101725] dark:focus:border-[#EAB308] rounded-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>

                    {/* Error Message */}
                    {subscribeStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-sm"
                      >
                        <p className="text-xs text-red-600 dark:text-red-400 text-center">
                          {errorMessage}
                        </p>
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#101725] dark:bg-gradient-to-r dark:from-[#EAB308] dark:to-[#F59E0B] hover:bg-[#EAB308] dark:hover:from-[#101725] dark:hover:to-[#101725] text-white hover:text-[#101725] dark:text-[#101725] dark:hover:text-white rounded-none py-6 uppercase tracking-widest text-sm transition-all shadow-md dark:shadow-[#EAB308]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Subscribing...
                        </span>
                      ) : (
                        'Subscribe Free'
                      )}
                    </Button>

                    <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] text-center italic transition-all">
                      Free forever. Unsubscribe anytime.
                    </p>
                  </form>
                )}

                {/* Testimonial - Only show when not in success state */}
                {subscribeStatus !== 'success' && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 transition-all">
                    <p className="text-sm text-[#6F83A7] dark:text-[#9BA5B7] italic mb-2 transition-all">
                      "Essential reading for anyone in the RMG sector. The AI insights are incredibly valuable."
                    </p>
                    <p className="text-xs text-[#101725] dark:text-[#E5E7EB] transition-all">
                      — Rahman Ahmed, Factory Owner
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#101725] dark:bg-[#EAB308] mt-6 transition-all">
            <div className="bg-white dark:bg-gradient-to-br dark:from-[#101725] dark:to-[#182336] p-4 text-center transition-all">
              <p className="text-2xl text-[#101725] dark:text-[#EAB308] transition-all" style={{ fontFamily: 'Georgia, serif' }}>
                50K+
              </p>
              <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider transition-all">
                Daily Readers
              </p>
            </div>
            <div className="bg-white dark:bg-gradient-to-br dark:from-[#101725] dark:to-[#182336] p-4 text-center transition-all">
              <p className="text-2xl text-[#101725] dark:text-[#EAB308] transition-all" style={{ fontFamily: 'Georgia, serif' }}>
                2,847
              </p>
              <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider transition-all">
                Factory Partners
              </p>
            </div>
            <div className="bg-white dark:bg-gradient-to-br dark:from-[#101725] dark:to-[#182336] p-4 text-center transition-all">
              <p className="text-2xl text-[#101725] dark:text-[#EAB308] transition-all" style={{ fontFamily: 'Georgia, serif' }}>
                100+
              </p>
              <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider transition-all">
                AI Insights/Day
              </p>
            </div>
            <div className="bg-white dark:bg-gradient-to-br dark:from-[#101725] dark:to-[#182336] p-4 text-center transition-all">
              <p className="text-2xl text-[#101725] dark:text-[#EAB308] transition-all" style={{ fontFamily: 'Georgia, serif' }}>
                24/7
              </p>
              <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] uppercase tracking-wider transition-all">
                Live Updates
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
