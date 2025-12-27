-- Fix Database Trigger Errors
-- This migration fixes issues with the user creation trigger

-- Drop and recreate the function with better error handling
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
    -- Create free subscription
    BEGIN
        INSERT INTO public.subscriptions (user_id, tier, status)
        VALUES (NEW.id, 'free', 'active')
        ON CONFLICT DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        -- Log error but don't fail user creation
        RAISE WARNING 'Failed to create subscription for user %: %', NEW.id, SQLERRM;
    END;
    
    -- Initialize user preferences
    BEGIN
        INSERT INTO public.user_preferences (user_id, language, ai_learning_enabled)
        VALUES (NEW.id, 'english', true)
        ON CONFLICT (user_id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        -- Log error but don't fail user creation
        RAISE WARNING 'Failed to create user preferences for user %: %', NEW.id, SQLERRM;
    END;
    
    -- Initialize user activity vector (only if table exists)
    BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_activity_vectors') THEN
            INSERT INTO public.user_activity_vectors (user_id, embedding, last_updated_at)
            VALUES (NEW.id, NULL, NOW())
            ON CONFLICT (user_id) DO NOTHING;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Log error but don't fail user creation
        RAISE WARNING 'Failed to create user activity vector for user %: %', NEW.id, SQLERRM;
    END;
    
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Ensure RLS policies allow the trigger to insert
-- The trigger runs as SECURITY DEFINER, so it should bypass RLS, but let's make sure

-- Check and fix subscriptions table RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow service role (used by triggers) to insert
DROP POLICY IF EXISTS "Allow trigger to insert subscriptions" ON public.subscriptions;
CREATE POLICY "Allow trigger to insert subscriptions" ON public.subscriptions
    FOR INSERT
    WITH CHECK (true);

-- Allow service role to select (for trigger operations)
DROP POLICY IF EXISTS "Allow trigger to select subscriptions" ON public.subscriptions;
CREATE POLICY "Allow trigger to select subscriptions" ON public.subscriptions
    FOR SELECT
    USING (true);

-- Check and fix user_preferences table RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert
DROP POLICY IF EXISTS "Allow trigger to insert preferences" ON public.user_preferences;
CREATE POLICY "Allow trigger to insert preferences" ON public.user_preferences
    FOR INSERT
    WITH CHECK (true);

-- Allow service role to select
DROP POLICY IF EXISTS "Allow trigger to select preferences" ON public.user_preferences;
CREATE POLICY "Allow trigger to select preferences" ON public.user_preferences
    FOR SELECT
    USING (true);

-- Recreate the trigger to ensure it's active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.create_default_subscription();

-- Grant necessary permissions to the function
GRANT EXECUTE ON FUNCTION public.create_default_subscription() TO service_role;
GRANT EXECUTE ON FUNCTION public.create_default_subscription() TO anon;
GRANT EXECUTE ON FUNCTION public.create_default_subscription() TO authenticated;

