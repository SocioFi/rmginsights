-- Database Setup Verification Queries
-- Run these queries in Supabase SQL Editor to verify everything is set up correctly

-- ============================================
-- 1. Verify Tables Exist
-- ============================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Expected results: subscriptions, user_preferences, news_articles, etc.

-- ============================================
-- 2. Verify Trigger Exists
-- ============================================
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name = 'on_auth_user_created';

-- Expected: Should return 1 row with trigger details

-- ============================================
-- 3. Verify Function Exists
-- ============================================
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'create_default_subscription';

-- Expected: Should return 1 row with function details

-- ============================================
-- 4. Verify RLS Policies on subscriptions
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'subscriptions';

-- Expected: Should return multiple policies

-- ============================================
-- 5. Verify RLS Policies on user_preferences
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_preferences';

-- Expected: Should return multiple policies

-- ============================================
-- 6. Check if RLS is Enabled
-- ============================================
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('subscriptions', 'user_preferences', 'user_activity_vectors')
ORDER BY tablename;

-- Expected: rowsecurity should be 't' (true) for all tables

-- ============================================
-- 7. Test: Check Existing Users and Subscriptions
-- ============================================
SELECT 
  u.id as user_id,
  u.email,
  u.email_confirmed_at,
  s.tier,
  s.status,
  s.created_at as subscription_created
FROM auth.users u
LEFT JOIN public.subscriptions s ON s.user_id = u.id
ORDER BY u.created_at DESC
LIMIT 10;

-- Expected: Should show users and their subscriptions (if any exist)

-- ============================================
-- 8. Test: Check User Preferences
-- ============================================
SELECT 
  up.user_id,
  up.profession,
  up.interests,
  up.language,
  up.ai_learning_enabled,
  up.created_at
FROM public.user_preferences up
ORDER BY up.created_at DESC
LIMIT 10;

-- Expected: Should show user preferences (if any exist)

-- ============================================
-- 9. Verify Extensions are Installed
-- ============================================
SELECT 
  extname,
  extversion
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'vector');

-- Expected: Should return both extensions

-- ============================================
-- 10. Check Trigger Function Security
-- ============================================
SELECT 
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'create_default_subscription';

-- Expected: Should show the function definition with SECURITY DEFINER

