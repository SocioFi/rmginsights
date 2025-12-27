import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { PersonalizationModal } from './components/PersonalizationModal';
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
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'story' | 'business' | 'industry' | 'markets' | 'saved' | 'history' | 'privacy' | 'terms' | 'reset-password'>('home');
  const [currentStoryId, setCurrentStoryId] = useState<string>('');

  // Check if we're on password reset page
  useEffect(() => {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);
    const hasResetToken = hash.includes('access_token') || urlParams.has('token') || urlParams.has('access_token');
    
    if (hasResetToken && currentPage !== 'reset-password') {
      setCurrentPage('reset-password');
    }
  }, []);

  // Check for existing session on mount and listen for auth changes
  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    checkSession();

    // Listen for auth state changes (important for OAuth redirects)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (session?.access_token && session?.user) {
        setUser(session.user);
        setAccessToken(session.access_token);
        setIsAuthModalOpen(false); // Close modal on successful OAuth login
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAccessToken(null);
        setUserPreferences(null);
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
