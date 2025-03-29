-- Sample activities for testing the leaderboard
-- This will create activities for the sample users with appropriate point values

-- First, let's make sure we have the points column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'activities' AND column_name = 'points'
  ) THEN
    ALTER TABLE activities ADD COLUMN points INTEGER NOT NULL DEFAULT 10;
  END IF;
END $$;

-- Insert sample activities for each user
-- We'll create activities over the past 30 days with different point values

-- Helper function to generate random timestamps within the past 30 days
CREATE OR REPLACE FUNCTION random_recent_timestamp() 
RETURNS TIMESTAMP WITH TIME ZONE AS $$
DECLARE
  random_days INTEGER;
  random_hours INTEGER;
  random_minutes INTEGER;
BEGIN
  random_days := floor(random() * 30);
  random_hours := floor(random() * 24);
  random_minutes := floor(random() * 60);
  RETURN (CURRENT_TIMESTAMP - (random_days || ' days')::INTERVAL - (random_hours || ' hours')::INTERVAL - (random_minutes || ' minutes')::INTERVAL);
END;
$$ LANGUAGE plpgsql;

-- Insert activities for each user
DO $$
DECLARE
  user_record RECORD;
  activity_types TEXT[] := ARRAY['call', 'email', 'meeting', 'message', 'visit', 'proposal'];
  client_types TEXT[] := ARRAY['individual', 'business'];
  status_options TEXT[] := ARRAY['follow-up-required', 'proposal-sent', 'pending-response', 'waiting-for-documents', 'preparing-terms', 'approved'];
  activity_type TEXT;
  client_type TEXT;
  client_name TEXT;
  activity_count INTEGER;
  activity_date TIMESTAMP WITH TIME ZONE;
  points INTEGER;
  status TEXT;
  i INTEGER;
BEGIN
  -- Loop through each user
  FOR user_record IN SELECT id, ghl_user_id, ghl_location_id, first_name, last_name FROM user_profiles WHERE is_active = true
  LOOP
    -- Generate between 5-20 activities per user
    activity_count := 5 + floor(random() * 16);
    
    FOR i IN 1..activity_count LOOP
      -- Select random activity type
      activity_type := activity_types[1 + floor(random() * array_length(activity_types, 1))];
      
      -- Select random client type
      client_type := client_types[1 + floor(random() * array_length(client_types, 1))];
      
      -- Select random status
      status := status_options[1 + floor(random() * array_length(status_options, 1))];
      
      -- Generate client name
      client_name := 'Client ' || floor(random() * 1000)::TEXT;
      
      -- Generate random activity date in the past 30 days
      activity_date := random_recent_timestamp();
      
      -- Assign points based on activity type
      CASE activity_type
        WHEN 'call' THEN points := 10;
        WHEN 'meeting' THEN points := 15;
        WHEN 'email' THEN points := 5;
        WHEN 'message' THEN points := 5;
        WHEN 'visit' THEN points := 20;
        WHEN 'proposal' THEN points := 50;
        ELSE points := 10;
      END CASE;
      
      -- Insert the activity
      INSERT INTO activities (
        user_profile_id,
        ghl_user_id,
        ghl_location_id,
        activity_type,
        client_name,
        client_type,
        activity_date,
        potential_value,
        notes,
        status,
        points,
        created_at,
        updated_at
      ) VALUES (
        user_record.id,
        user_record.ghl_user_id,
        user_record.ghl_location_id,
        activity_type,
        client_name,
        client_type,
        activity_date,
        CASE WHEN random() > 0.5 THEN (100000 + floor(random() * 400000)) ELSE NULL END,
        CASE WHEN random() > 0.7 THEN 'Notes for ' || client_name ELSE NULL END,
        status,
        points,
        activity_date,
        activity_date
      );
    END LOOP;
    
    -- Update the user's total_points based on their activities
    UPDATE user_profiles
    SET 
      total_points = (SELECT COALESCE(SUM(activities.points), 0) FROM activities WHERE user_profile_id = user_record.id),
      last_activity_date = (SELECT MAX(activities.activity_date) FROM activities WHERE user_profile_id = user_record.id)
    WHERE id = user_record.id;
  END LOOP;
  
  -- Clean up the helper function
  DROP FUNCTION IF EXISTS random_recent_timestamp();
END $$;

-- Take an initial snapshot of the leaderboard
SELECT snapshot_leaderboard();

-- Display the current leaderboard
SELECT * FROM current_leaderboard ORDER BY rank;
