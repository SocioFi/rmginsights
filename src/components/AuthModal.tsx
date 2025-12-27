import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AuthService } from '../services/authService';
import { Newspaper, Sparkles, Lock, Mail, User, ArrowRight, Eye, EyeOff, CheckCircle2, Linkedin, AlertCircle } from 'lucide-react';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import logoImage from 'figma:asset/b912a80f881cf1ec7c838d822f0de9df1ed32ebf.png';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: (user: any, accessToken: string) => void;
}

export function AuthModal({ open, onOpenChange, onAuthSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const result = await AuthService.login({
        email: loginEmail,
        password: loginPassword,
      });

      if (!result.success) {
        setError(result.error || 'Failed to login. Please try again.');
        return;
      }

      if (result.user && result.session?.access_token) {
        onAuthSuccess(result.user, result.session.access_token);
        onOpenChange(false);
        setLoginEmail('');
        setLoginPassword('');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const result = await AuthService.signup({
        email: signupEmail,
        password: signupPassword,
        name: signupName,
      });

      if (!result.success) {
        setError(result.error || 'Failed to create account. Please try again.');
        return;
      }

      // Show success message about email verification
      setSuccessMessage(result.message || 'Account created successfully! Please check your email to verify your account.');
      
      // Clear form
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');

      // Don't auto-login - user needs to verify email first
      // Show message to check email
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const result = await AuthService.forgotPassword(forgotPasswordEmail);

      if (!result.success) {
        setError(result.error || 'Failed to send password reset email.');
        return;
      }

      setSuccessMessage(result.message || 'If an account exists with this email, a password reset link has been sent.');
      setForgotPasswordEmail('');
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await AuthService.loginWithOAuth('google');
      // OAuth will redirect, so we don't need to handle success here
      // The session will be picked up on redirect
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Failed to login with Google. Please try again.');
      setIsLoading(false);
    }
  };

  const handleLinkedInLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await AuthService.loginWithOAuth('linkedin');
      // OAuth will redirect, so we don't need to handle success here
      // The session will be picked up on redirect
    } catch (err: any) {
      console.error('LinkedIn login error:', err);
      setError(err.message || 'Failed to login with LinkedIn. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-white via-[#F9FAFB] to-white dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] border-2 border-[#101725] dark:border-[#EAB308] rounded-none w-[85vw] max-w-[480px] max-h-[80vh] p-0 shadow-2xl overflow-hidden">
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
              <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-[#101725] rounded p-1.5">
                <img src={logoImage} alt="RMG Insight Logo" className="w-full h-full object-contain" />
              </div>
              <Separator className="w-12 bg-[#EAB308] dark:bg-[#101725]" />
            </motion.div>

            <DialogHeader>
              <DialogTitle className="text-white dark:text-[#101725] text-center text-3xl mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                RMG Insight
              </DialogTitle>
              <DialogDescription className="text-[#EAB308] dark:text-[#101725] text-center text-sm uppercase tracking-widest">
                Powered by FabricXAI
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Curved Bottom Edge */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-white dark:bg-[#101725]" style={{
            clipPath: 'ellipse(70% 100% at 50% 100%)'
          }} />
        </div>

        <div className="px-8 pb-8 -mt-4">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#F3F4F6] dark:bg-[#182336] p-1 border border-[#E5E7EB] dark:border-[#6F83A7]">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-[#101725] data-[state=active]:text-white dark:data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-[#EAB308] dark:data-[state=active]:to-[#F59E0B] dark:data-[state=active]:text-[#101725] uppercase tracking-wider text-xs transition-all"
              >
                <Lock className="w-3 h-3 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-[#101725] data-[state=active]:text-white dark:data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-[#EAB308] dark:data-[state=active]:to-[#F59E0B] dark:data-[state=active]:text-[#101725] uppercase tracking-wider text-xs transition-all"
              >
                <Sparkles className="w-3 h-3 mr-2" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-[#101725] dark:text-[#E5E7EB] uppercase tracking-wider text-xs flex items-center gap-2">
                    <Mail className="w-3 h-3 text-[#57ACAF]" />
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="pl-10 border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-[#E5E7EB] transition-all"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-[#101725] dark:text-[#E5E7EB] uppercase tracking-wider text-xs flex items-center gap-2">
                    <Lock className="w-3 h-3 text-[#57ACAF]" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-[#E5E7EB] transition-all"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F83A7] hover:text-[#57ACAF] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded"
                    >
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#57ACAF] to-[#6F83A7] hover:from-[#101725] hover:to-[#101725] dark:from-[#EAB308] dark:to-[#F59E0B] dark:hover:from-[#57ACAF] dark:hover:to-[#57ACAF] text-white dark:text-[#101725] dark:hover:text-white uppercase tracking-widest text-sm py-6 transition-all shadow-md group"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Logging in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Login
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </motion.div>

                {/* Success Message */}
                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded"
                    >
                      <p className="text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {successMessage}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Forgot Password Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#57ACAF] dark:hover:text-[#EAB308] transition-colors uppercase tracking-wider"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Forgot Password Form */}
                <AnimatePresence>
                  {showForgotPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-gradient-to-br from-[#EAB308]/5 to-[#57ACAF]/5 dark:from-[#EAB308]/10 dark:to-[#57ACAF]/10 border border-[#EAB308]/20 dark:border-[#EAB308]/30 rounded"
                    >
                      <h3 className="text-sm font-semibold text-[#101725] dark:text-[#E5E7EB] mb-3">Reset Password</h3>
                      <form onSubmit={handleForgotPassword} className="space-y-3">
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            required
                            className="pl-10 border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-[#E5E7EB]"
                          />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            disabled={isLoading}
                            size="sm"
                            className="flex-1 bg-[#57ACAF] hover:bg-[#6F83A7] text-white"
                          >
                            Send Reset Link
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              setShowForgotPassword(false);
                              setForgotPasswordEmail('');
                              setError('');
                              setSuccessMessage('');
                            }}
                            size="sm"
                            variant="outline"
                            className="border-[#E5E7EB] dark:border-[#6F83A7]"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Social Login Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-[#E5E7EB] dark:bg-[#6F83A7]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-[#101725] px-2 text-[#6F83A7] dark:text-[#9BA5B7]">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-full border-2 border-[#E5E7EB] dark:border-[#6F83A7] hover:border-[#4285F4] dark:hover:border-[#4285F4] bg-white dark:bg-[#182336] hover:bg-[#4285F4]/5 dark:hover:bg-[#4285F4]/10 text-[#101725] dark:text-[#E5E7EB] py-6 transition-all group"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLinkedInLogin}
                      disabled={isLoading}
                      className="w-full border-2 border-[#E5E7EB] dark:border-[#6F83A7] hover:border-[#0077B5] dark:hover:border-[#0077B5] bg-white dark:bg-[#182336] hover:bg-[#0077B5]/5 dark:hover:bg-[#0077B5]/10 text-[#101725] dark:text-[#E5E7EB] py-6 transition-all group"
                    >
                      <Linkedin className="w-5 h-5 mr-2 text-[#0077B5]" />
                      LinkedIn
                    </Button>
                  </motion.div>
                </div>
              </motion.form>
            </TabsContent>

            <TabsContent value="signup">
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSignup}
                className="space-y-5"
              >
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-[#101725] dark:text-[#E5E7EB] uppercase tracking-wider text-xs flex items-center gap-2">
                    <User className="w-3 h-3 text-[#57ACAF]" />
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your Name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      className="pl-10 border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-[#E5E7EB] transition-all"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-[#101725] dark:text-[#E5E7EB] uppercase tracking-wider text-xs flex items-center gap-2">
                    <Mail className="w-3 h-3 text-[#57ACAF]" />
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="pl-10 border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-[#E5E7EB] transition-all"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-[#101725] dark:text-[#E5E7EB] uppercase tracking-wider text-xs flex items-center gap-2">
                    <Lock className="w-3 h-3 text-[#57ACAF]" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10 pr-10 border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308] bg-white dark:bg-[#182336] text-[#101725] dark:text-[#E5E7EB] transition-all"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F83A7] hover:text-[#57ACAF] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7]">
                    Minimum 6 characters
                  </p>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded"
                    >
                      <p className="text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {successMessage}
                      </p>
                      {signupEmail && (
                        <button
                          type="button"
                          onClick={async () => {
                            const result = await AuthService.resendVerification(signupEmail);
                            if (result.success) {
                              setSuccessMessage(result.message || 'Verification email sent!');
                              setError('');
                            } else {
                              setError(result.error || 'Failed to resend verification email');
                              setSuccessMessage('');
                            }
                          }}
                          className="text-xs text-green-700 dark:text-green-300 underline mt-2"
                        >
                          Resend verification email
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded"
                    >
                      <p className="text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Benefits List */}
                <div className="bg-gradient-to-br from-[#EAB308]/5 to-[#57ACAF]/5 dark:from-[#EAB308]/10 dark:to-[#57ACAF]/10 border border-[#EAB308]/20 dark:border-[#EAB308]/30 p-4 rounded">
                  <p className="text-xs uppercase tracking-wider text-[#101725] dark:text-[#E5E7EB] mb-3">
                    Your membership includes:
                  </p>
                  <div className="space-y-2">
                    {[
                      'AI-curated industry insights',
                      'Personalized news feed',
                      'Market intelligence reports'
                    ].map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#57ACAF] dark:text-[#EAB308] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#6F83A7] dark:text-[#9BA5B7]">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#EAB308] to-[#F59E0B] hover:from-[#101725] hover:to-[#101725] dark:from-[#EAB308] dark:to-[#F59E0B] dark:hover:from-[#57ACAF] dark:hover:to-[#57ACAF] text-[#101725] hover:text-white dark:text-[#101725] dark:hover:text-white uppercase tracking-widest text-sm py-6 transition-all shadow-md group"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-[#101725] border-t-transparent rounded-full"
                        />
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Create Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </motion.div>

                {/* Social Login Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-[#E5E7EB] dark:bg-[#6F83A7]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-[#101725] px-2 text-[#6F83A7] dark:text-[#9BA5B7]">
                      Or sign up with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-full border-2 border-[#E5E7EB] dark:border-[#6F83A7] hover:border-[#4285F4] dark:hover:border-[#4285F4] bg-white dark:bg-[#182336] hover:bg-[#4285F4]/5 dark:hover:bg-[#4285F4]/10 text-[#101725] dark:text-[#E5E7EB] py-6 transition-all group"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLinkedInLogin}
                      disabled={isLoading}
                      className="w-full border-2 border-[#E5E7EB] dark:border-[#6F83A7] hover:border-[#0077B5] dark:hover:border-[#0077B5] bg-white dark:bg-[#182336] hover:bg-[#0077B5]/5 dark:hover:bg-[#0077B5]/10 text-[#101725] dark:text-[#E5E7EB] py-6 transition-all group"
                    >
                      <Linkedin className="w-5 h-5 mr-2 text-[#0077B5]" />
                      LinkedIn
                    </Button>
                  </motion.div>
                </div>
              </motion.form>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <Separator className="my-6 bg-[#E5E7EB] dark:bg-[#6F83A7]" />
          <p className="text-center text-xs text-[#6F83A7] dark:text-[#9BA5B7]">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
