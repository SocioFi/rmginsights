// Comprehensive Authentication Service
// Handles signup, login, password reset, email verification

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface PasswordResetRequest {
  email: string;
}

interface PasswordUpdateRequest {
  access_token: string;
  new_password: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Route: POST /auth-service/signup
    if (path.endsWith("/signup") && req.method === "POST") {
      const { email, password, name }: SignupRequest = await req.json();

      // Validation
      if (!email || !password || !name) {
        return new Response(
          JSON.stringify({ error: "Email, password, and name are required" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ error: "Invalid email format" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Password strength validation
      if (password.length < 6) {
        return new Response(
          JSON.stringify({ error: "Password must be at least 6 characters long" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Check if email already exists using admin API
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      const existingUser = users?.find((u: any) => u.email === email);

      if (existingUser) {
        return new Response(
          JSON.stringify({ error: "An account with this email already exists" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 409,
          }
        );
      }

      // Create user with email confirmation required
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { name },
        email_confirm: false, // Require email verification
      });

      if (error) {
        console.error("Signup error:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Send verification email
      const { error: emailError } = await supabase.auth.admin.generateLink({
        type: "signup",
        email,
        options: {
          redirectTo: `${url.origin}/auth/verify-email`,
        },
      });

      if (emailError) {
        console.error("Email send error:", emailError);
        // Don't fail signup if email fails, but log it
      }

      return new Response(
        JSON.stringify({
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email,
            email_confirmed: data.user.email_confirmed_at !== null,
          },
          message: "Account created successfully. Please check your email to verify your account.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 201,
        }
      );
    }

    // Route: POST /auth-service/login
    if (path.endsWith("/login") && req.method === "POST") {
      const { email, password }: LoginRequest = await req.json();

      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: "Email and password are required" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Use client-side auth for login (better security)
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const clientSupabase = createClient(supabaseUrl, anonKey);

      const { data, error } = await clientSupabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = "Invalid email or password";
        
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please verify your email address before logging in. Check your inbox for the verification link.";
        } else if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        }

        return new Response(
          JSON.stringify({ error: errorMessage }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
          }
        );
      }

      // Get user profile with subscription info
      const { data: profile } = await supabase.rpc("get_user_profile", {
        p_user_id: data.user.id,
      });

      return new Response(
        JSON.stringify({
          success: true,
          user: data.user,
          session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
          },
          profile: profile?.[0] || null,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Route: POST /auth-service/forgot-password
    if (path.endsWith("/forgot-password") && req.method === "POST") {
      const { email }: PasswordResetRequest = await req.json();

      if (!email) {
        return new Response(
          JSON.stringify({ error: "Email is required" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Check if user exists
      const { data: user } = await supabase.auth.admin.listUsers();
      const userExists = user.users.some((u) => u.email === email);

      if (!userExists) {
        // Don't reveal if email exists (security best practice)
        return new Response(
          JSON.stringify({
            success: true,
            message: "If an account exists with this email, a password reset link has been sent.",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      // Generate password reset link
      const { data: linkData, error } = await supabase.auth.admin.generateLink({
        type: "recovery",
        email,
        options: {
          redirectTo: `${url.origin}/auth/reset-password`,
        },
      });

      if (error) {
        console.error("Password reset error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to send password reset email" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "If an account exists with this email, a password reset link has been sent.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Route: POST /auth-service/reset-password
    if (path.endsWith("/reset-password") && req.method === "POST") {
      const { access_token, new_password }: PasswordUpdateRequest = await req.json();

      if (!access_token || !new_password) {
        return new Response(
          JSON.stringify({ error: "Access token and new password are required" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      if (new_password.length < 6) {
        return new Response(
          JSON.stringify({ error: "Password must be at least 6 characters long" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Update password using the access token
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const clientSupabase = createClient(supabaseUrl, anonKey);

      const { data, error } = await clientSupabase.auth.updateUser({
        password: new_password,
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message || "Failed to reset password" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Password has been reset successfully. You can now login with your new password.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Route: POST /auth-service/resend-verification
    if (path.endsWith("/resend-verification") && req.method === "POST") {
      const { email } = await req.json();

      if (!email) {
        return new Response(
          JSON.stringify({ error: "Email is required" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      const { data: linkData, error } = await supabase.auth.admin.generateLink({
        type: "signup",
        email,
        options: {
          redirectTo: `${url.origin}/auth/verify-email`,
        },
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to send verification email" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Verification email has been sent. Please check your inbox.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Route: GET /auth-service/profile
    if (path.endsWith("/profile") && req.method === "GET") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
          }
        );
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);

      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: "Invalid or expired token" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
          }
        );
      }

      const { data: profile } = await supabase.rpc("get_user_profile", {
        p_user_id: user.id,
      });

      return new Response(
        JSON.stringify({
          success: true,
          profile: profile?.[0] || null,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      }
    );
  } catch (error: any) {
    console.error("Auth service error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});



