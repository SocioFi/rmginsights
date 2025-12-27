// Password Reset Page
// Handles password reset with token from email

import { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ResetPasswordPageProps {
  onBack?: () => void;
}

export function ResetPasswordPage({ onBack }: ResetPasswordPageProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Extract token from URL hash or query params
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);
    const tokenMatch = hash.match(/access_token=([^&]+)/);
    const token = tokenMatch ? tokenMatch[1] : urlParams.get('token') || urlParams.get('access_token');
    
    if (token) {
      setAccessToken(token);
    } else {
      setError('Invalid or missing reset token. Please request a new password reset.');
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!accessToken) {
      setError('Invalid reset token');
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthService.resetPassword(accessToken, newPassword);

      if (!result.success) {
        setError(result.error || 'Failed to reset password');
        return;
      }

      setSuccess(true);
      
      // Call onBack after 3 seconds if provided
      if (onBack) {
        setTimeout(() => {
          onBack();
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-[#101725] dark:text-[#E5E7EB] mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-[#6F83A7] dark:text-[#9BA5B7] mb-6">
              Your password has been reset successfully. You will be redirected to the login page shortly.
            </p>
            <Button
              onClick={onBack || (() => window.location.href = '/')}
              className="bg-[#57ACAF] hover:bg-[#6F83A7] text-white"
            >
              Go to Login
            </Button>
          </motion.div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#57ACAF]/10 dark:bg-[#57ACAF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-[#57ACAF]" />
          </div>
          <h2 className="text-2xl font-bold text-[#101725] dark:text-[#E5E7EB] mb-2">
            Reset Your Password
          </h2>
          <p className="text-[#6F83A7] dark:text-[#9BA5B7]">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-[#101725] dark:text-[#E5E7EB]">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 pr-10 border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308]"
                placeholder="Enter new password"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F83A7] hover:text-[#57ACAF]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7]">
              Minimum 6 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-[#101725] dark:text-[#E5E7EB]">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 pr-10 border-2 border-[#E5E7EB] dark:border-[#6F83A7] focus:border-[#57ACAF] dark:focus:border-[#EAB308]"
                placeholder="Confirm new password"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
            </div>
          </div>

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

          <Button
            type="submit"
            disabled={isLoading || !accessToken}
            className="w-full bg-[#57ACAF] hover:bg-[#6F83A7] text-white"
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onBack || (() => window.location.href = '/')}
              className="text-sm text-[#6F83A7] dark:text-[#9BA5B7] hover:text-[#57ACAF] dark:hover:text-[#EAB308]"
            >
              Back to Login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

