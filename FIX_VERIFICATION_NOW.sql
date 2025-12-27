-- Fix Email Verification - Manual Confirmation
-- Run this to manually confirm the email so you can test login
-- ⚠️ Only use this for testing/debugging

-- Confirm the email
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'kamrul.sociofi@gmail.com';

-- Verify it worked
SELECT 
  email,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmed'
    ELSE '❌ NOT Confirmed'
  END as status
FROM auth.users
WHERE email = 'kamrul.sociofi@gmail.com';

