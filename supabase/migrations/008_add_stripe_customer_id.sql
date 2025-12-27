-- Add stripe_customer_id column to subscriptions table
-- This is needed for Stripe integration

ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id 
ON subscriptions(stripe_customer_id) 
WHERE stripe_customer_id IS NOT NULL;

