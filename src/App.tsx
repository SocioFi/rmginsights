import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { PersonalizationModal } from './components/PersonalizationModal';
import { WelcomeModal } from './components/WelcomeModal';
import { NewsFeed } from './components/NewsFeed';
import { AnalyticsStrip } from './components/AnalyticsStrip';
import { RoleTabs } from './components/RoleTabs';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { ThemeProvider } from './components/ThemeProvider';
import { StoryPage } from './pages/StoryPage';
import { CategoryPage } from './pages/CategoryPage';
import { SavedArticlesPage } from './pages/SavedArticlesPage';
import { ReadingHistoryPage } from './pages/ReadingHistoryPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { supabase } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPersonalizeModalOpen, setIsPersonalizeModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'story' | 'business' | 'industry' | 'markets' | 'saved' | 'history' | 'privacy' | 'terms' | 'reset-password'>('home');
  const [currentStoryId, setCurrentStoryId] = useState<string>('');

  // Track if we've shown welcome modal for this session
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  // Check for email verification or password reset tokens in URL
  useEffect(() => {
    const hash = window.location.hash;
    const pathname = window.location.pathname;
    
    // Supabase automatically handles email verification when tokens are in the URL hash
    // The Supabase client will process the hash automatically on page load
    // We just need to clean up the URL after processing
    if (hash && (hash.includes('type=signup') || hash.includes('type=email'))) {
      // This is an email verification link - Supabase will handle it automatically
      // Clean up the URL after a delay to let Supabase process it first
      const cleanupTimer = setTimeout(() => {
        if (window.location.hash && (window.location.hash.includes('type=signup') || window.location.hash.includes('type=email'))) {
          window.history.replaceState({}, '', pathname || '/');
        }
      }, 1000);
      
      return () => clearTimeout(cleanupTimer);
    }
    
    // Check for password reset (not email verification)
    const hasResetToken = hash.includes('access_token') && 
                         !hash.includes('type=signup') && 
                         !hash.includes('type=email') &&
                         pathname !== '/auth/verify-email';
    
    if (hasResetToken && currentPage !== 'reset-password') {
      setCurrentPage('reset-password');
    }
  }, [currentPage]);

  // Check for existing session on mount and listen for auth changes
  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    checkSession();

      // Listen for auth state changes (important for OAuth redirects and email verification)
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        // Only log important events (skip INITIAL_SESSION and SIGNED_OUT on startup)
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || (event === 'SIGNED_OUT' && user)) {
          console.log('Auth state changed:', event, session?.user?.email || 'logged out');
        }
        
        if (session?.access_token && session?.user) {
          const wasLoggedOut = !user; // Check if user was logged out before
          const hash = window.location.hash;
          const isEmailVerification = event === 'SIGNED_IN' && 
                                     session.user.email_confirmed_at && 
                                     wasLoggedOut &&
                                     (hash.includes('type=signup') || hash.includes('type=email'));
          
          setUser(session.user);
          setAccessToken(session.access_token);
          setIsAuthModalOpen(false); // Close modal on successful login/OAuth/verification
          
          // Show welcome modal if this is a new email verification
          if (isEmailVerification && !hasShownWelcome) {
            setHasShownWelcome(true);
            // Clean up URL hash
            if (window.location.hash) {
              window.history.replaceState({}, '', window.location.pathname || '/');
            }
            setCurrentPage('home');
            // Small delay to ensure state is updated
            setTimeout(() => {
              setIsWelcomeModalOpen(true);
            }, 100);
            console.log('Email verified successfully - showing welcome modal');
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setAccessToken(null);
          setUserPreferences(null);
          setIsWelcomeModalOpen(false);
          setHasShownWelcome(false);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Update access token if it was refreshed
          setAccessToken(session.access_token);
        }
      });

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Load user preferences when user logs in
  useEffect(() => {
    if (user && accessToken) {
      loadUserPreferences();
    }
  }, [user, accessToken]);

  // Scroll to top whenever page changes or story changes
  useEffect(() => {
    // Immediate scroll reset - use all methods for maximum compatibility
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Backup scroll reset using requestAnimationFrame for next paint
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    
    // Additional backup for async-loaded content
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [currentPage, currentStoryId]);

  const checkSession = async () => {
    try {
      // Check for hash tokens first (email verification, password reset, etc.)
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        if (accessToken && refreshToken) {
          console.log('Found tokens in URL hash, type:', type);
          // Set session from hash tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            console.error('Error setting session from hash:', error);
          } else if (data.session) {
            console.log('Session set successfully from hash tokens');
            setUser(data.session.user);
            setAccessToken(data.session.access_token);
            return; // Don't check regular session if we just set one
          }
        }
      }
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token && session?.user) {
        setUser(session.user);
        setAccessToken(session.access_token);
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const loadUserPreferences = async () => {
    if (!accessToken) return;

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
        setUserPreferences(preferences);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const handleAuthSuccess = (userData: any, token: string) => {
    setUser(userData);
    setAccessToken(token);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
      setUserPreferences(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePreferencesSaved = (prefs: any) => {
    setUserPreferences(prefs);
  };

  const navigateToStory = (storyId: string) => {
    // Force immediate scroll reset before state change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Use requestAnimationFrame to ensure scroll completes before state change
    requestAnimationFrame(() => {
      setCurrentStoryId(storyId);
      setCurrentPage('story');
    });
  };

  const navigateToHome = () => {
    // Force immediate scroll reset before state change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Use requestAnimationFrame to ensure scroll completes before state change
    requestAnimationFrame(() => {
      setCurrentPage('home');
    });
  };

  const navigateToBusiness = () => {
    // Force immediate scroll reset before state change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Use requestAnimationFrame to ensure scroll completes before state change
    requestAnimationFrame(() => {
      setCurrentPage('business');
    });
  };

  const navigateToIndustry = () => {
    // Force immediate scroll reset before state change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Use requestAnimationFrame to ensure scroll completes before state change
    requestAnimationFrame(() => {
      setCurrentPage('industry');
    });
  };

  const navigateToMarkets = () => {
    // Force immediate scroll reset before state change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Use requestAnimationFrame to ensure scroll completes before state change
    requestAnimationFrame(() => {
      setCurrentPage('markets');
    });
  };

  const navigateToSaved = () => {
    // Force immediate scroll reset before state change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Use requestAnimationFrame to ensure scroll completes before state change
    requestAnimationFrame(() => {
      setCurrentPage('saved');
    });
  };

  const navigateToHistory = () => {
    // Force immediate scroll reset before state change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Use requestAnimationFrame to ensure scroll completes before state change
    requestAnimationFrame(() => {
      setCurrentPage('history');
    });
  };

  const navigateToPrivacy = () => {
    // Force immediate scroll reset before state change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Use requestAnimationFrame to ensure scroll completes before state change
    requestAnimationFrame(() => {
      setCurrentPage('privacy');
    });
  };

  const navigateToTerms = () => {
    // Force immediate scroll reset before state change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Use requestAnimationFrame to ensure scroll completes before state change
    requestAnimationFrame(() => {
      setCurrentPage('terms');
    });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen w-full max-w-full overflow-x-hidden font-['Open_Sans'] bg-white dark:bg-gradient-to-br dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] transition-all duration-300">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap');
            
            h1, h2, h3, h4, h5, h6 {
              font-family: 'Poppins', sans-serif;
            }
            
            body, p, span, div, a, button, input, label {
              font-family: 'Open Sans', sans-serif;
            }
            
            /* Ensure instant scroll behavior for page navigation */
            html {
              scroll-behavior: auto !important;
            }
          `}
        </style>

        {/* Auth Modal */}
        <AuthModal
          open={isAuthModalOpen}
          onOpenChange={setIsAuthModalOpen}
          onAuthSuccess={handleAuthSuccess}
        />

        {/* Personalization Modal */}
        <PersonalizationModal
          open={isPersonalizeModalOpen}
          onOpenChange={setIsPersonalizeModalOpen}
          accessToken={accessToken}
          onPreferencesSaved={handlePreferencesSaved}
          onLoginClick={() => setIsAuthModalOpen(true)}
        />

        {/* Welcome Modal - Shown after email verification */}
        <WelcomeModal
          open={isWelcomeModalOpen}
          onOpenChange={setIsWelcomeModalOpen}
          userName={user?.user_metadata?.name || user?.email?.split('@')[0]}
          onViewSubscriptions={() => {
            setIsWelcomeModalOpen(false);
            // You can add subscription page/modal here
            alert('Subscription management coming soon! For now, you\'re on the Free tier with access to all basic features.');
          }}
        />

        {/* Conditional Page Rendering */}
        {currentPage === 'home' ? (
          <div key="home">
            <Header
              user={user}
              onLoginClick={() => setIsAuthModalOpen(true)}
              onPersonalizeClick={() => setIsPersonalizeModalOpen(true)}
              onLogout={handleLogout}
              onNavigateHome={navigateToHome}
              onNavigateBusiness={navigateToBusiness}
              onNavigateIndustry={navigateToIndustry}
              onNavigateMarkets={navigateToMarkets}
              onNavigateSaved={navigateToSaved}
              onNavigateHistory={navigateToHistory}
            />
            <Hero 
              onPersonalize={() => setIsPersonalizeModalOpen(true)}
              onReadStory={navigateToStory}
            />
            <NewsFeed 
              user={user} 
              userPreferences={userPreferences}
              accessToken={accessToken}
              onReadStory={navigateToStory}
            />
            <AnalyticsStrip />
            <RoleTabs />
            <Newsletter />
            <Footer onNavigatePrivacy={navigateToPrivacy} onNavigateTerms={navigateToTerms} />
          </div>
        ) : currentPage === 'story' ? (
          <StoryPage
            key={`story-${currentStoryId}`}
            user={user}
            accessToken={accessToken}
            userPreferences={userPreferences}
            storyId={currentStoryId}
            onLoginClick={() => setIsAuthModalOpen(true)}
            onPersonalizeClick={() => setIsPersonalizeModalOpen(true)}
            onLogout={handleLogout}
            onBack={navigateToHome}
            onNavigateHome={navigateToHome}
            onNavigateBusiness={navigateToBusiness}
            onNavigateIndustry={navigateToIndustry}
            onNavigateMarkets={navigateToMarkets}
            onNavigateSaved={navigateToSaved}
            onNavigateHistory={navigateToHistory}
            onNavigatePrivacy={navigateToPrivacy}
            onNavigateTerms={navigateToTerms}
          />
        ) : currentPage === 'saved' ? (
          <SavedArticlesPage
            key="saved"
            user={user}
            onLoginClick={() => setIsAuthModalOpen(true)}
            onPersonalizeClick={() => setIsPersonalizeModalOpen(true)}
            onLogout={handleLogout}
            onNavigateHome={navigateToHome}
            onNavigateBusiness={navigateToBusiness}
            onNavigateIndustry={navigateToIndustry}
            onNavigateMarkets={navigateToMarkets}
            onReadStory={navigateToStory}
            onNavigatePrivacy={navigateToPrivacy}
            onNavigateTerms={navigateToTerms}
          />
        ) : currentPage === 'history' ? (
          <ReadingHistoryPage
            key="history"
            user={user}
            onLoginClick={() => setIsAuthModalOpen(true)}
            onPersonalizeClick={() => setIsPersonalizeModalOpen(true)}
            onLogout={handleLogout}
            onNavigateHome={navigateToHome}
            onNavigateBusiness={navigateToBusiness}
            onNavigateIndustry={navigateToIndustry}
            onNavigateMarkets={navigateToMarkets}
            onReadStory={navigateToStory}
            onNavigatePrivacy={navigateToPrivacy}
            onNavigateTerms={navigateToTerms}
          />
        ) : currentPage === 'privacy' ? (
          <PrivacyPolicyPage
            key="privacy"
            user={user}
            onLoginClick={() => setIsAuthModalOpen(true)}
            onPersonalizeClick={() => setIsPersonalizeModalOpen(true)}
            onLogout={handleLogout}
            onNavigateHome={navigateToHome}
            onNavigateBusiness={navigateToBusiness}
            onNavigateIndustry={navigateToIndustry}
            onNavigateMarkets={navigateToMarkets}
            onNavigateSaved={navigateToSaved}
            onNavigateHistory={navigateToHistory}
            onNavigateTerms={navigateToTerms}
          />
        ) : currentPage === 'terms' ? (
          <TermsOfServicePage
            key="terms"
            user={user}
            onLoginClick={() => setIsAuthModalOpen(true)}
            onPersonalizeClick={() => setIsPersonalizeModalOpen(true)}
            onLogout={handleLogout}
            onNavigateHome={navigateToHome}
            onNavigateBusiness={navigateToBusiness}
            onNavigateIndustry={navigateToIndustry}
            onNavigateMarkets={navigateToMarkets}
            onNavigateSaved={navigateToSaved}
            onNavigateHistory={navigateToHistory}
            onNavigatePrivacy={navigateToPrivacy}
          />
        ) : currentPage === 'reset-password' ? (
          <ResetPasswordPage
            key="reset-password"
            onBack={() => {
              window.location.hash = '';
              window.history.replaceState({}, '', window.location.pathname);
              setCurrentPage('home');
            }}
          />
        ) : (
          <CategoryPage
            key={currentPage}
            user={user}
            category={currentPage as 'business' | 'industry' | 'markets'}
            onLoginClick={() => setIsAuthModalOpen(true)}
            onPersonalizeClick={() => setIsPersonalizeModalOpen(true)}
            onLogout={handleLogout}
            onBack={navigateToHome}
            onReadStory={navigateToStory}
            onNavigateHome={navigateToHome}
            onNavigateBusiness={navigateToBusiness}
            onNavigateIndustry={navigateToIndustry}
            onNavigateMarkets={navigateToMarkets}
            onUpgradeClick={() => alert('Premium subscription coming soon! Contact FabricXAI for early access to Market Copilot and advanced analytics.')}
            onNavigatePrivacy={navigateToPrivacy}
            onNavigateTerms={navigateToTerms}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
