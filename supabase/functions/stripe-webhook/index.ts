// Stripe Webhook Handler Edge Function
// Handles Stripe webhook events to keep subscription status in sync

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

serve(async (req) => {
  const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY")!;
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      const { data: customer } = await stripe.customers.retrieve(customerId);
      const userId = (customer as Stripe.Customer).metadata?.user_id;

      if (userId) {
        const tier = subscription.items.data[0]?.price?.nickname || "pro";
        await supabase
          .from("subscriptions")
          .upsert({
            user_id: userId,
            tier: tier.toLowerCase(),
            status: subscription.status === "active" ? "active" : "cancelled",
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customerId,
            expires_at: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null,
          });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      const { data: customer } = await stripe.customers.retrieve(customerId);
      const userId = (customer as Stripe.Customer).metadata?.user_id;

      if (userId) {
        await supabase
          .from("subscriptions")
          .update({
            status: "cancelled",
            expires_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});

