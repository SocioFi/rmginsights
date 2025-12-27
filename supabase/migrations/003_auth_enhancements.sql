-- Authentication Enhancements
-- Proper user setup with subscriptions and preferences on signup

-- Function to create default subscription for new users
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
    -- Create free subscription
    INSERT INTO subscriptions (user_id, tier, status)
    VALUES (NEW.id, 'free', 'active')
    ON CONFLICT DO NOTHING;
    
    -- Initialize user preferences table (migrate from KV if needed)
    INSERT INTO user_preferences (user_id, language, ai_learning_enabled)
    VALUES (NEW.id, 'english', true)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Initialize user activity vector (empty, will be populated later)
    -- Only if table exists (for Phase 2)
    BEGIN
        INSERT INTO user_activity_vectors (user_id, total_articles_read, last_updated_at)
        VALUES (NEW.id, 0, NOW())
        ON CONFLICT (user_id) DO NOTHING;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist yet (Phase 1), skip
        NULL;
    END;
    
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to run on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_default_subscription();

-- Function to handle email verification
CREATE OR REPLACE FUNCTION handle_email_verification()
RETURNS TRIGGER AS $$
BEGIN
    -- When email is verified, ensure subscription is active
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        -- Update subscription status if needed
        UPDATE subscriptions
        SET status = 'active'
        WHERE user_id = NEW.id AND status = 'expired';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for email verification
DROP TRIGGER IF EXISTS on_email_verified ON auth.users;
CREATE TRIGGER on_email_verified
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_email_verification();

-- Function to get user profile with subscription info
CREATE OR REPLACE FUNCTION get_user_profile(p_user_id uuid)
RETURNS TABLE (
    user_id uuid,
    email text,
    name text,
    subscription_tier text,
    subscription_status text,
    preferences jsonb,
    created_at timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.email,
        u.raw_user_meta_data->>'name' as name,
        COALESCE(s.tier, 'free') as subscription_tier,
        COALESCE(s.status, 'active') as subscription_status,
        COALESCE(
            jsonb_build_object(
                'profession', up.profession,
                'interests', up.interests,
                'language', up.language,
                'ai_learning_enabled', up.ai_learning_enabled
            ),
            '{}'::jsonb
        ) as preferences,
        u.created_at
    FROM auth.users u
    LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
    LEFT JOIN user_preferences up ON up.user_id = u.id
    WHERE u.id = p_user_id;
END;
$$;

-- Add indexes for better auth query performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_active ON subscriptions(user_id, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Function to check if email exists
CREATE OR REPLACE FUNCTION check_email_exists(p_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_exists boolean;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = p_email) INTO v_exists;
    RETURN v_exists;
END;
$$;

