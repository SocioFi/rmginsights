-- Check User Subscription Tier
-- Run this to verify what tier a user has in the database

-- Replace with your user email
SELECT 
  u.id,
  u.email,
  s.tier as subscription_tier,
  s.status as subscription_status,
  s.started_at,
  s.expires_at
FROM auth.users u
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
WHERE u.email = 'kamrul.sociofi@gmail.com';

-- Also check what get_user_profile returns
SELECT * FROM get_user_profile(
  (SELECT id FROM auth.users WHERE email = 'kamrul.sociofi@gmail.com')
);

