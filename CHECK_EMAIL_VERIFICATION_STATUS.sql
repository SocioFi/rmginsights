-- Check Email Verification Status
-- Run this query to see if your email is actually confirmed

-- Replace 'your-email@example.com' with your actual email
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email Confirmed'
    ELSE '❌ Email NOT Confirmed'
  END as verification_status,
  EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600 as hours_since_signup
FROM auth.users
WHERE email = 'your-email@example.com';  -- Replace with your email

-- To see all users and their verification status:
-- SELECT 
--   email,
--   email_confirmed_at IS NOT NULL as is_verified,
--   created_at
-- FROM auth.users
-- ORDER BY created_at DESC
-- LIMIT 10;

-- If email is NOT confirmed, you can manually confirm it (FOR TESTING ONLY):
-- UPDATE auth.users
-- SET email_confirmed_at = NOW()
-- WHERE email = 'your-email@example.com';

