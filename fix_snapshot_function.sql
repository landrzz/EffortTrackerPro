-- Fix the snapshot_leaderboard function to use user_profile_id instead of user_id
CREATE OR REPLACE FUNCTION snapshot_leaderboard()
RETURNS void AS $$
BEGIN
  -- Delete any existing snapshot for today to avoid duplicates
  DELETE FROM leaderboard_history WHERE snapshot_date = CURRENT_DATE;
  
  -- Insert current rankings
  INSERT INTO leaderboard_history (user_id, rank, points, activities, streak, snapshot_date)
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY total_points DESC),
    total_points,
    (SELECT COUNT(*) FROM activities WHERE user_profile_id = user_profiles.id),
    current_day_streak,
    CURRENT_DATE
  FROM
    user_profiles
  WHERE
    is_active = true;
    
  RETURN;
END;
$$ LANGUAGE plpgsql;
