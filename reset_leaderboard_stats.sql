-- Script to drop and recreate the leaderboard_stats view
-- First drop the existing view
DROP VIEW IF EXISTS leaderboard_stats;

-- Then recreate the view with the simplified implementation
CREATE OR REPLACE VIEW leaderboard_stats AS
SELECT
  -- Total activities (simple count)
  (SELECT COUNT(*) FROM activities) AS total_activities,
  
  -- Monthly activities (last 30 days)
  (SELECT COUNT(*) FROM activities WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') AS monthly_activities,
  
  -- Monthly activity change (simplified with placeholder until historical data accumulates)
  10 AS monthly_activity_change,
  
  -- Achievement rate (percentage of active users with at least one activity)
  (SELECT 
    COUNT(DISTINCT up.id) FILTER (WHERE a.id IS NOT NULL)::float / 
    NULLIF(COUNT(DISTINCT up.id), 0) * 100
   FROM user_profiles up
   LEFT JOIN activities a ON up.id = a.user_profile_id AND a.created_at >= CURRENT_DATE - INTERVAL '30 days'
   WHERE up.is_active = true
  ) AS achievement_rate,
  
  -- Achievement rate change (simplified with placeholder until historical data accumulates)
  5 AS achievement_rate_change,
  
  -- Total points earned
  (SELECT COALESCE(SUM(total_points), 0) FROM user_profiles) AS total_points,
  
  -- Points change (simplified with placeholder until historical data accumulates)
  1000 AS points_change,
  
  -- Points change percentage (simplified with placeholder until historical data accumulates)
  15 AS points_change_percentage;
