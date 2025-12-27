// Stripe Create Subscription Edge Function
// Creates a new subscription in Stripe and updates the database

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

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
      throw new Error("Price ID not configured");
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
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});

