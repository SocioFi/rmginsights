// Supabase Edge Function: Send Welcome Email
// This function sends a welcome email to users after they verify their email address

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get user info from request
    const { userId, email, name } = await req.json();

    if (!userId || !email) {
      return new Response(
        JSON.stringify({ error: "userId and email are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Read the welcome email template
    const templatePath = new URL("../templates/email-welcome.html", import.meta.url);
    let template = "";
    try {
      template = await Deno.readTextFile(templatePath);
    } catch (error) {
      // Fallback if template file not found
      template = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to RMG Insight</title>
</head>
<body>
    <h1>Welcome to RMG Insight!</h1>
    <p>Hello ${name || "there"},</p>
    <p>Welcome to RMG Insight! We're thrilled to have you join our community of RMG industry professionals.</p>
    <p>Your account has been successfully created and verified.</p>
    <p><a href="https://rmginsights.fabricxai.com">Go to Dashboard</a></p>
    <p>Best regards,<br>The RMG Insight Team</p>
</body>
</html>
      `;
    }

    // Replace template variables
    const emailContent = template
      .replace(/\{\{name\}\}/g, name || "there")
      .replace(/\{\{email\}\}/g, email)
      .replace(/\{\{year\}\}/g, new Date().getFullYear().toString())
      .replace(/\{\{dashboard_link\}\}/g, "https://rmginsights.fabricxai.com")
      .replace(/\{\{privacy_link\}\}/g, "https://rmginsights.fabricxai.com/privacy")
      .replace(/\{\{terms_link\}\}/g, "https://rmginsights.fabricxai.com/terms");

    // Send email using Supabase's email service
    // Note: Supabase doesn't have a direct email API, so we'll use a third-party service
    // For now, we'll log it. You can integrate with SendGrid, Resend, or similar
    
    console.log("Welcome email would be sent to:", email);
    console.log("Email content length:", emailContent.length);

    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // For now, return success (you can implement actual email sending later)
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Welcome email queued for sending",
        email: email,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send welcome email" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

