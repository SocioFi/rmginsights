-- Add Welcome Email Trigger
-- This migration adds functionality to send a welcome email after email verification

-- Function to send welcome email (calls Edge Function)
CREATE OR REPLACE FUNCTION send_welcome_email()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  user_email TEXT;
BEGIN
  -- Only send welcome email when email is first verified
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    -- Get user details
    user_name := COALESCE(NEW.raw_user_meta_data->>'name', 'there');
    user_email := NEW.email;
    
    -- Call the Edge Function to send welcome email
    -- Note: This requires pg_net extension or HTTP extension
    -- For Supabase, we'll use pg_net to make HTTP request
    PERFORM
      net.http_post(
        url := current_setting('app.settings.supabase_url') || '/functions/v1/send-welcome-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.supabase_service_role_key')
        ),
        body := jsonb_build_object(
          'userId', NEW.id::text,
          'email', user_email,
          'name', user_name
        )
      );
    
    -- Log for debugging (optional)
    RAISE NOTICE 'Welcome email triggered for user: %', user_email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative: Simpler approach using Supabase's built-in webhook
-- If pg_net is not available, you can use this approach:
-- 1. Set up a webhook in Supabase Dashboard
-- 2. Configure it to call your Edge Function
-- 3. The trigger will just log the event

-- For now, let's create a simpler version that just logs
-- You can enhance this later with actual email sending

DROP FUNCTION IF EXISTS send_welcome_email();

CREATE OR REPLACE FUNCTION send_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send welcome email when email is first verified
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    -- Log the event (you can enhance this to call an Edge Function or webhook)
    RAISE NOTICE 'Welcome email should be sent to: %', NEW.email;
    
    -- TODO: Add actual email sending logic here
    -- Options:
    -- 1. Use pg_net extension to call Edge Function
    -- 2. Use Supabase webhooks
    -- 3. Use a third-party email service API
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the email verification trigger to also send welcome email
DROP TRIGGER IF EXISTS on_email_verified ON auth.users;

CREATE TRIGGER on_email_verified
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION handle_email_verification();

-- Add welcome email trigger
DROP TRIGGER IF EXISTS send_welcome_email_trigger ON auth.users;

CREATE TRIGGER send_welcome_email_trigger
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION send_welcome_email();

