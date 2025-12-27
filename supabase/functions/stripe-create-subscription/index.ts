// Stripe Create Subscription Edge Function
// Creates a new subscription in Stripe and updates the database

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Use npm: prefix for better Deno compatibility
import Stripe from "npm:stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY")!;

    // Validate environment variables
    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL not configured");
    }
    if (!supabaseServiceKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
    }
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY not configured. Please add it to Supabase Edge Function secrets.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { tier, payment_method_id } = await req.json();

    if (!tier || !["pro", "business"].includes(tier)) {
      throw new Error("Invalid tier");
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("user_preferences")
      .select("email")
      .eq("user_id", user.id)
      .single();

    const { data: { user: authUser } } = await supabase.auth.admin.getUserById(user.id);
    const email = authUser?.email || profile?.email;

    let customerId: string;
    const { data: existingCustomer } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
    }

    // Create subscription
    const priceId = tier === "pro" 
      ? Deno.env.get("STRIPE_PRO_PRICE_ID") 
      : Deno.env.get("STRIPE_BUSINESS_PRICE_ID");

    if (!priceId) {
      const missingVar = tier === "pro" ? "STRIPE_PRO_PRICE_ID" : "STRIPE_BUSINESS_PRICE_ID";
      throw new Error(`${missingVar} not configured. Please add it to Supabase Edge Function secrets and create a ${tier} product/price in Stripe Dashboard.`);
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    // Update subscription in database
    await supabase
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        tier,
        status: "active",
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        started_at: new Date().toISOString(),
      });

    return new Response(
      JSON.stringify({
        subscription_id: subscription.id,
        client_secret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Stripe subscription creation error:", {
      message: error.message,
      stack: error.stack,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
    });
    
    // Return detailed error for debugging
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to create subscription",
        details: process.env.NODE_ENV === "development" ? {
          type: error.type,
          code: error.code,
          statusCode: error.statusCode,
        } : undefined
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});

