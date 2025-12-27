// Authentication Service
// Handles all authentication-related API calls using Direct Supabase Auth
// No Edge Functions required - works locally and on Vercel

import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: any;
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  profile?: any;
  message?: string;
  error?: string;
}

export class AuthService {
  /**
   * Sign up a new user using Direct Supabase Auth
   */
  static async signup(data: SignupData): Promise<AuthResponse> {
    try {
      // Log signup attempt for debugging
      console.log('Attempting signup for:', data.email);
      console.log('Supabase config:', {
        projectId: projectId,
        hasAnonKey: !!publicAnonKey,
      });
      
      // Get the correct redirect URL (handle both http and https)
      // Using root path is simpler and works better with Supabase redirect URL whitelisting
      const redirectUrl = `${window.location.origin}/`;
      console.log('Using redirect URL:', redirectUrl);
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name, // Stored in user_metadata
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('Signup error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        
        let errorMessage = error.message;
        
        // User-friendly error messages
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          errorMessage = 'An account with this email already exists';
        } else if (error.message.includes('Password') || error.message.includes('password')) {
          errorMessage = 'Password must be at least 6 characters long';
        } else if (error.message.includes('Invalid email') || error.message.includes('email')) {
          errorMessage = 'Please enter a valid email address';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Too many signup attempts. Please try again in a few minutes.';
        } else if (error.message.includes('API key') || error.message.includes('Invalid API')) {
          errorMessage = 'Configuration error. Please contact support.';
          console.error('API key issue - check VITE_SUPABASE_ANON_KEY in .env.local');
        }

        return {
          success: false,
          error: errorMessage,
        };
      }

      console.log('Signup successful:', {
        userId: authData.user?.id,
        email: authData.user?.email,
        emailConfirmed: authData.user?.email_confirmed_at !== null,
      });

      return {
        success: true,
        user: authData.user,
        session: authData.session ? {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at || 0,
        } : undefined,
        message: 'Account created successfully! Please check your email to verify your account.',
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create account',
      };
    }
  }

  /**
   * Login user using Direct Supabase Auth
   */
  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        let errorMessage = 'Invalid email or password';
        
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          errorMessage = 'Please verify your email address before logging in. Check your inbox for the verification link.';
        } else if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        }

        return {
          success: false,
          error: errorMessage,
        };
      }

      // Supabase's signInWithPassword already blocks unverified users
      // If we get here, the user is authenticated and email should be confirmed
      // Just refresh user data to ensure we have the latest status
      if (authData.user) {
        const { data: { user: refreshedUser } } = await supabase.auth.getUser();
        if (refreshedUser) {
          // Use refreshed user data (has latest email_confirmed_at)
          authData.user = refreshedUser;
          console.log('Login successful. Email confirmed:', !!refreshedUser.email_confirmed_at);
        }
      }

      // Get user profile with subscription info
      let profile = null;
      if (authData.user) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .rpc('get_user_profile', { p_user_id: authData.user.id });
          
          if (!profileError && profileData) {
            // Function now returns a single jsonb object, not an array
            profile = profileData;
          }
        } catch (profileErr) {
          console.warn('Could not fetch user profile:', profileErr);
          // Don't fail login if profile fetch fails
        }
      }

      return {
        success: true,
        user: authData.user,
        session: authData.session ? {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at || 0,
        } : undefined,
        profile: profile,
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Failed to login',
      };
    }
  }

  /**
   * Request password reset using Direct Supabase Auth
   */
  static async forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to send password reset email',
        };
      }

      // Don't reveal if email exists (security best practice)
      return {
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to request password reset',
      };
    }
  }

  /**
   * Reset password with token using Direct Supabase Auth
   * Note: Supabase password reset flow requires the user to be redirected from email link
   * The token in the URL hash is automatically handled by Supabase client
   */
  static async resetPassword(accessToken: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // If access token is provided, set the session first
      if (accessToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: '', // Not needed for password reset
        });

        if (sessionError) {
          return {
            success: false,
            error: 'Invalid or expired reset token. Please request a new password reset link.',
          };
        }
      }

      // Check if user is authenticated (session should be set from the reset link)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return {
          success: false,
          error: 'Invalid or expired reset token. Please request a new password reset link.',
        };
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        return {
          success: false,
          error: updateError.message || 'Failed to reset password',
        };
      }

      return {
        success: true,
        message: 'Password has been reset successfully. You can now login with your new password.',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to reset password',
      };
    }
  }

  /**
   * Resend verification email using Direct Supabase Auth
   */
  static async resendVerification(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Get the correct redirect URL (handle both http and https)
      // Using root path is simpler and works better with Supabase redirect URL whitelisting
      const redirectUrl = `${window.location.origin}/`;
      console.log('Using redirect URL for resend:', redirectUrl);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to send verification email',
        };
      }

      return {
        success: true,
        message: 'Verification email has been sent. Please check your inbox.',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to resend verification email',
      };
    }
  }

  /**
   * Send welcome email after email verification
   * Uses Vercel API route (simpler than Edge Functions)
   * No Supabase Edge Functions needed - just uses your Vercel deployment
   */
  static async sendWelcomeEmail(userId: string, email: string, name: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Call Vercel API route (deployed at /api/send-welcome-email)
      const apiUrl = `${window.location.origin}/api/send-welcome-email`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, email, name }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn('Welcome email API not available or failed:', errorData);
        // Don't fail - welcome email is optional
        return {
          success: false,
          error: 'Welcome email service not configured',
        };
      }

      const result = await response.json();
      return {
        success: true,
        message: result.message || 'Welcome email sent',
      };
    } catch (error: any) {
      // Don't fail - welcome email is optional
      console.warn('Could not send welcome email:', error);
      return {
        success: false,
        error: error.message || 'Welcome email service not available',
      };
    }
  }

  /**
   * Get user profile using Direct Supabase Auth
   */
  static async getProfile(accessToken?: string): Promise<{ success: boolean; profile?: any; error?: string }> {
    try {
      // Get current user (session is already managed by Supabase client)
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        return {
          success: false,
          error: 'User not authenticated',
        };
      }

      // Get user profile with subscription info from database
      const { data: profileData, error: profileError } = await supabase
        .rpc('get_user_profile', { p_user_id: user.id });

      if (profileError) {
        console.error('get_user_profile error:', profileError);
        return {
          success: false,
          error: profileError.message || 'Failed to get profile',
        };
      }

      // Function now returns a single jsonb object, not an array
      return {
        success: true,
        profile: profileData || null,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get profile',
      };
    }
  }

  /**
   * Login with OAuth provider
   */
  static async loginWithOAuth(provider: 'google' | 'linkedin'): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  /**
   * Get current session
   */
  static async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
}


