-- Fix get_user_profile function return type
-- The function should return a single row, not a table
-- This fixes the "structure of query does not match function result type" error

DROP FUNCTION IF EXISTS get_user_profile(uuid);

CREATE OR REPLACE FUNCTION get_user_profile(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'user_id', u.id,
    'email', u.email,
    'name', u.raw_user_meta_data->>'name',
    'subscription_tier', COALESCE(s.tier, 'free'),
    'subscription_status', COALESCE(s.status, 'active'),
    'preferences', COALESCE(
      jsonb_build_object(
        'profession', up.profession,
        'interests', up.interests,
        'language', up.language,
        'ai_learning_enabled', up.ai_learning_enabled
      ),
      '{}'::jsonb
    ),
    'created_at', u.created_at
  ) INTO result
  FROM auth.users u
  LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
  LEFT JOIN user_preferences up ON up.user_id = u.id
  WHERE u.id = p_user_id;
  
  RETURN result;
END;
$$;

