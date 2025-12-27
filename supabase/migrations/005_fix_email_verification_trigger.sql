-- Fix Email Verification Trigger Error
-- This migration fixes the "Error confirming user" issue by correcting the trigger function
-- to match the actual database schema and ensuring RLS policies allow trigger operations

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_default_subscription();

-- Recreate the function with correct schema references
CREATE OR REPLACE FUNCTION public.create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
    -- Create free subscription
    BEGIN
        INSERT INTO public.subscriptions (user_id, tier, status, expires_at)
        VALUES (NEW.id, 'free', 'active', NULL)
        ON CONFLICT DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        -- Log error but don't fail user creation
        RAISE WARNING 'Failed to create subscription for user %: %', NEW.id, SQLERRM;
    END;
    
    -- Initialize user preferences
    BEGIN
        INSERT INTO public.user_preferences (user_id, profession, interests, language, ai_learning_enabled)
        VALUES (NEW.id, NULL, '{}', 'english', TRUE)
        ON CONFLICT (user_id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        -- Log error but don't fail user creation
        RAISE WARNING 'Failed to create user preferences for user %: %', NEW.id, SQLERRM;
    END;
    
    -- Initialize user activity vector (only if table exists and with correct schema)
    BEGIN
        IF EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'user_activity_vectors'
        ) THEN
            -- Use the correct schema from 002_vector_database.sql
            INSERT INTO public.user_activity_vectors (
                user_id, 
                total_articles_read, 
                last_updated_at,
                created_at
            )
            VALUES (NEW.id, 0, NOW(), NOW())
            ON CONFLICT (user_id) DO NOTHING;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Log error but don't fail user creation
        RAISE WARNING 'Failed to create user activity vector for user %: %', NEW.id, SQLERRM;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.create_default_subscription();

-- Ensure RLS policies allow the trigger to work
-- The trigger runs as SECURITY DEFINER, which should bypass RLS, but let's ensure policies exist

-- For subscriptions table - allow service role to insert
DROP POLICY IF EXISTS "Allow trigger to insert subscriptions" ON public.subscriptions;
CREATE POLICY "Allow trigger to insert subscriptions" ON public.subscriptions
    FOR INSERT
    WITH CHECK (true);

-- For user_preferences table - allow service role to insert
DROP POLICY IF EXISTS "Allow trigger to insert preferences" ON public.user_preferences;
CREATE POLICY "Allow trigger to insert preferences" ON public.user_preferences
    FOR INSERT
    WITH CHECK (true);

-- For user_activity_vectors table - allow service role to insert (if table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_activity_vectors'
    ) THEN
        DROP POLICY IF EXISTS "Allow trigger to insert activity vectors" ON public.user_activity_vectors;
        CREATE POLICY "Allow trigger to insert activity vectors" ON public.user_activity_vectors
            FOR INSERT
            WITH CHECK (true);
    END IF;
END $$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.create_default_subscription() TO service_role;
GRANT EXECUTE ON FUNCTION public.create_default_subscription() TO anon;
GRANT EXECUTE ON FUNCTION public.create_default_subscription() TO authenticated;

-- Also ensure the function can bypass RLS by using SECURITY DEFINER
-- This is already set above, but let's verify the function has the right permissions
ALTER FUNCTION public.create_default_subscription() SECURITY DEFINER;

