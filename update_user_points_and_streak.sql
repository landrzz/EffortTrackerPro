-- Function to update user points and streak when an activity is recorded
CREATE OR REPLACE FUNCTION update_user_points_and_streak(
  user_id UUID,
  points_to_add INTEGER
)
RETURNS VOID AS $$
DECLARE
  current_date TIMESTAMP := NOW();
  last_activity_date TIMESTAMP;
  streak_start_date TIMESTAMP;
  current_streak INTEGER;
  longest_streak INTEGER;
  total_points INTEGER;
BEGIN
  -- Get current user data
  SELECT 
    up.last_activity_date, 
    up.streak_start_date, 
    up.current_day_streak,
    up.longest_day_streak,
    up.total_points
  INTO 
    last_activity_date, 
    streak_start_date, 
    current_streak,
    longest_streak,
    total_points
  FROM user_profiles up
  WHERE up.id = user_id;
  
  -- Update total points
  total_points := COALESCE(total_points, 0) + points_to_add;
  
  -- Handle streak logic
  IF last_activity_date IS NULL THEN
    -- First activity ever
    current_streak := 1;
    longest_streak := 1;
    streak_start_date := current_date;
  ELSE
    -- Check if the last activity was yesterday or earlier today
    IF DATE(last_activity_date) = DATE(current_date) THEN
      -- Activity on the same day, streak continues but doesn't increment
      NULL;
    ELSIF DATE(last_activity_date) = DATE(current_date - INTERVAL '1 day') THEN
      -- Activity was yesterday, increment streak
      current_streak := current_streak + 1;
      
      -- Update longest streak if current is now longer
      IF current_streak > longest_streak THEN
        longest_streak := current_streak;
      END IF;
    ELSE
      -- Activity was more than a day ago, reset streak
      current_streak := 1;
      streak_start_date := current_date;
    END IF;
  END IF;
  
  -- Update user profile
  UPDATE user_profiles
  SET 
    total_points = total_points,
    current_day_streak = current_streak,
    longest_day_streak = longest_streak,
    streak_start_date = streak_start_date,
    last_activity_date = current_date,
    status_level = (
      SELECT sl.name
      FROM (
        SELECT 'Bronze' as name, 0 as min_points, 99 as max_points
        UNION ALL SELECT 'Silver', 100, 499
        UNION ALL SELECT 'Gold', 500, 1999
        UNION ALL SELECT 'Platinum', 2000, 2147483647
      ) sl
      WHERE total_points BETWEEN sl.min_points AND sl.max_points
      LIMIT 1
    ),
    updated_at = current_date
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;
