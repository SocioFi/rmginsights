import image_7addd6f658e761c8c3d833232931a0929ec0356b from 'figma:asset/7addd6f658e761c8c3d833232931a0929ec0356b.png';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { User, Settings, LogOut, Menu, X, Sun, Moon, Sparkles, BookmarkCheck, TrendingUp, Award, Bot } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useTheme } from './ThemeProvider';
import { Badge } from './ui/badge';
import logoImage from 'figma:asset/b912a80f881cf1ec7c838d822f0de9df1ed32ebf.png';

interface HeaderProps {
  user: any | null;
  onLoginClick: () => void;
  onPersonalizeClick: () => void;
  onLogout: () => void;
  onNavigateHome?: () => void;
  onNavigateBusiness?: () => void;
  onNavigateIndustry?: () => void;
  onNavigateMarkets?: () => void;
  onNavigateSaved?: () => void;
  onNavigateHistory?: () => void;
}

export function Header({ 
  user, 
  onLoginClick, 
  onPersonalizeClick, 
  onLogout,
  onNavigateHome,
  onNavigateBusiness,
  onNavigateIndustry,
  onNavigateMarkets,
  onNavigateSaved,
  onNavigateHistory
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#101725] border-b-2 border-[#101725] dark:border-[#EAB308] shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Newspaper Style */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={onNavigateHome}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-300 hover:scale-105">
              <img 
                src={image_7addd6f658e761c8c3d833232931a0929ec0356b} 
                alt="RMG Insight Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 
                className="text-[#101725] dark:text-white text-base sm:text-lg leading-tight transition-colors duration-300" 
                style={{ fontFamily: 'Georgia, serif' }}
              >
                RMG Insight
              </h1>
              <p className="text-[#6F83A7] dark:text-[#57ACAF] text-[10px] uppercase tracking-wider transition-colors duration-300">
                Powered by FabricXAI
              </p>
            </div>
          </motion.div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={onNavigateHome}
              className="text-sm text-[#6F83A7] dark:text-[#57ACAF] hover:text-[#101725] dark:hover:text-[#EAB308] transition-colors uppercase tracking-wider"
            >
              Home
            </button>
            <button
              onClick={onNavigateBusiness}
              className="text-sm text-[#6F83A7] dark:text-[#57ACAF] hover:text-[#101725] dark:hover:text-[#EAB308] transition-colors uppercase tracking-wider"
            >
              Business
            </button>
            <button
              onClick={onNavigateIndustry}
              className="text-sm text-[#6F83A7] dark:text-[#57ACAF] hover:text-[#101725] dark:hover:text-[#EAB308] transition-colors uppercase tracking-wider"
            >
              Industry
            </button>
            <button
              onClick={onNavigateMarkets}
              className="text-sm text-[#6F83A7] dark:text-[#57ACAF] hover:text-[#101725] dark:hover:text-[#EAB308] transition-colors uppercase tracking-wider"
            >
              Markets
            </button>
          </nav>

          {/* Auth Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="text-[#6F83A7] dark:text-[#57ACAF] hover:text-[#101725] dark:hover:text-[#EAB308] hover:bg-gray-100 dark:hover:bg-[#182336] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>

            {user ? (
              <>
                <Button
                  onClick={onPersonalizeClick}
                  variant="ghost"
                  className="text-[#6F83A7] dark:text-[#57ACAF] hover:text-[#101725] dark:hover:text-[#EAB308] hover:bg-gray-100 dark:hover:bg-[#182336] hidden sm:flex text-xs uppercase tracking-wider transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Preferences
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-2 justify-end mb-1">
                          <p className="text-[#101725] dark:text-white text-sm transition-colors">
                            {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                          </p>
                          {user.user_metadata?.aiLearningEnabled && (
                            <Sparkles className="w-3 h-3 text-[#EAB308] animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <p className="text-[#6F83A7] dark:text-[#57ACAF] text-xs transition-colors">
                            {user.user_metadata?.profession?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Member'}
                          </p>
                          <Badge variant="outline" className="bg-[#EAB308] text-[#101725] border-[#EAB308] text-[10px] px-1 py-0">
                            PRO
                          </Badge>
                        </div>
                      </div>
                      <Avatar className="w-10 h-10 bg-gradient-to-br from-[#101725] to-[#6F83A7] dark:from-[#EAB308] dark:to-[#F59E0B] border-2 border-[#EAB308] dark:border-[#101725] transition-all group-hover:scale-105">
                        <AvatarFallback className="bg-transparent text-white dark:text-[#101725] transition-colors">
                          {user.user_metadata?.name
                            ? getInitials(user.user_metadata.name)
                            : <User className="w-5 h-5" />}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 bg-white dark:bg-[#182336] border-2 border-[#101725] dark:border-[#EAB308] shadow-xl">
                    {/* User Info Header */}
                    <div className="px-3 py-3 bg-gradient-to-br from-[#101725] to-[#6F83A7] dark:from-[#EAB308] dark:to-[#F59E0B] -m-1 mb-2">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12 bg-white dark:bg-[#101725] border-2 border-white dark:border-[#101725]">
                          <AvatarFallback className="bg-transparent text-[#101725] dark:text-[#EAB308]">
                            {user.user_metadata?.name
                              ? getInitials(user.user_metadata.name)
                              : <User className="w-6 h-6" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white dark:text-[#101725] truncate">
                              {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                            </p>
                            <Badge variant="outline" className="bg-white/20 text-white dark:bg-[#101725]/20 dark:text-[#101725] border-white/40 dark:border-[#101725]/40 text-[10px] px-1.5 py-0">
                              PRO
                            </Badge>
                          </div>
                          <p className="text-white/80 dark:text-[#101725]/80 text-xs truncate mt-0.5">
                            {user.email}
                          </p>
                          <p className="text-white/70 dark:text-[#101725]/70 text-xs mt-1">
                            {user.user_metadata?.profession?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Member'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <DropdownMenuLabel className="text-xs text-[#6F83A7] dark:text-[#57ACAF] uppercase tracking-wider px-3 py-2">
                      Quick Actions
                    </DropdownMenuLabel>

                    <DropdownMenuItem
                      onClick={onPersonalizeClick}
                      className="cursor-pointer dark:text-white dark:hover:bg-[#101725] mx-1 rounded flex items-center gap-3 px-3 py-2.5"
                    >
                      <div className="w-8 h-8 bg-[#EAB308]/10 dark:bg-[#EAB308]/20 rounded flex items-center justify-center">
                        <Settings className="w-4 h-4 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Preferences</p>
                        <p className="text-xs text-[#6F83A7] dark:text-[#57ACAF]">Customize your feed</p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={onNavigateSaved}
                      className="cursor-pointer dark:text-white dark:hover:bg-[#101725] mx-1 rounded flex items-center gap-3 px-3 py-2.5"
                    >
                      <div className="w-8 h-8 bg-[#57ACAF]/10 dark:bg-[#57ACAF]/20 rounded flex items-center justify-center">
                        <BookmarkCheck className="w-4 h-4 text-[#57ACAF]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Saved Articles</p>
                        <p className="text-xs text-[#6F83A7] dark:text-[#57ACAF]">Your bookmarks</p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={onNavigateHistory}
                      className="cursor-pointer dark:text-white dark:hover:bg-[#101725] mx-1 rounded flex items-center gap-3 px-3 py-2.5"
                    >
                      <div className="w-8 h-8 bg-[#6F83A7]/10 dark:bg-[#6F83A7]/20 rounded flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-[#6F83A7]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Reading History</p>
                        <p className="text-xs text-[#6F83A7] dark:text-[#57ACAF]">Recent articles</p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

                    <DropdownMenuLabel className="text-xs text-[#6F83A7] dark:text-[#57ACAF] uppercase tracking-wider px-3 py-2">
                      AI Status
                    </DropdownMenuLabel>

                    <div className="px-4 py-2.5 mx-1 rounded bg-[#EAB308]/5 dark:bg-[#EAB308]/10 border border-[#EAB308]/20">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-[#EAB308]" />
                          <span className="text-sm text-[#101725] dark:text-white">AI Learning</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] px-2 py-0.5 ${
                            user.user_metadata?.aiLearningEnabled 
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30' 
                              : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30'
                          }`}
                        >
                          {user.user_metadata?.aiLearningEnabled ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#6F83A7] dark:text-[#57ACAF] leading-relaxed">
                        {user.user_metadata?.aiLearningEnabled 
                          ? 'FabricXAI is personalizing your content' 
                          : 'Enable in preferences to personalize'}
                      </p>
                    </div>

                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700 my-2" />

                    <DropdownMenuItem
                      onClick={onLogout}
                      className="cursor-pointer text-red-600 dark:text-red-400 dark:hover:bg-red-500/10 mx-1 rounded flex items-center gap-3 px-3 py-2.5"
                    >
                      <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center">
                        <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Logout</p>
                        <p className="text-xs text-red-500/70">Sign out of your account</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                onClick={onLoginClick}
                className="bg-[#101725] dark:bg-[#EAB308] hover:bg-[#EAB308] dark:hover:bg-[#101725] text-white dark:text-[#101725] hover:text-[#101725] dark:hover:text-white px-4 sm:px-6 py-2 text-xs uppercase tracking-wider transition-all"
              >
                <span className="hidden sm:inline">Login / Subscribe</span>
                <span className="sm:hidden">Login</span>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-[#101725] dark:text-white p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </motion.div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-[#E5E7EB] dark:border-[#6F83A7]/30"
            >
              <div className="py-4 space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigateHome?.();
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-[#6F83A7] dark:text-[#57ACAF] hover:bg-[#F9FAFB] dark:hover:bg-[#182336] hover:text-[#101725] dark:hover:text-[#EAB308] transition-colors uppercase tracking-wider"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigateBusiness?.();
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-[#6F83A7] dark:text-[#57ACAF] hover:bg-[#F9FAFB] dark:hover:bg-[#182336] hover:text-[#101725] dark:hover:text-[#EAB308] transition-colors uppercase tracking-wider"
                >
                  Business
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigateIndustry?.();
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-[#6F83A7] dark:text-[#57ACAF] hover:bg-[#F9FAFB] dark:hover:bg-[#182336] hover:text-[#101725] dark:hover:text-[#EAB308] transition-colors uppercase tracking-wider"
                >
                  Industry
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigateMarkets?.();
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-[#6F83A7] dark:text-[#57ACAF] hover:bg-[#F9FAFB] dark:hover:bg-[#182336] hover:text-[#101725] dark:hover:text-[#EAB308] transition-colors uppercase tracking-wider"
                >
                  Markets
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
