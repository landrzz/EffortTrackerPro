-- Leaderboard Schema for EffortTrackerPro
-- This file contains SQL to create tables and views for the leaderboard functionality

-- 0. Add points column to activities table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'activities' AND column_name = 'points'
  ) THEN
    ALTER TABLE activities ADD COLUMN points INTEGER NOT NULL DEFAULT 10;
    
    -- Update existing activities with points based on activity_type
    -- You can customize this logic based on your business rules
    UPDATE activities SET points = 
      CASE 
        WHEN activity_type = 'call' THEN 10
        WHEN activity_type = 'meeting' THEN 15
        WHEN activity_type = 'email' THEN 5
        WHEN activity_type = 'text' THEN 5
        WHEN activity_type = 'application' THEN 20
        WHEN activity_type = 'closing' THEN 50
        ELSE 10
      END;
      
    COMMENT ON COLUMN activities.points IS 'Points earned for this activity';
  END IF;
END $$;

-- 1. Create a table to track historical rankings
CREATE TABLE IF NOT EXISTS leaderboard_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  rank INTEGER NOT NULL,
  points INTEGER NOT NULL,
  activities INTEGER NOT NULL,
  streak INTEGER NOT NULL,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure we only have one ranking per user per day
  UNIQUE (user_id, snapshot_date)
);

-- 2. Create a view for current leaderboard data
CREATE OR REPLACE VIEW current_leaderboard AS
WITH ranked_users AS (
  SELECT
    id,
    first_name || ' ' || last_name AS name,
    'Loan Officer' AS title, -- This could be dynamic based on status_level or another field
    profile_image_url,
    total_points AS activity_points,
    (SELECT COUNT(*) FROM activities WHERE user_profile_id = user_profiles.id) AS activities_count,
    current_day_streak AS streak,
    ROW_NUMBER() OVER (ORDER BY total_points DESC) AS current_rank,
    CASE
      WHEN last_activity_date IS NULL THEN 'Never'
      WHEN last_activity_date::date = CURRENT_DATE THEN 'Today'
      WHEN last_activity_date::date = CURRENT_DATE - INTERVAL '1 day' THEN 'Yesterday'
      WHEN last_activity_date::date > CURRENT_DATE - INTERVAL '7 days' THEN (CURRENT_DATE - last_activity_date::date) || ' days ago'
      ELSE to_char(last_activity_date, 'Mon DD, YYYY')
    END AS last_active,
    is_active
  FROM
    user_profiles
  WHERE
    is_active = true
)
SELECT
  ru.id,
  ru.name,
  ru.title,
  COALESCE(ru.profile_image_url, '/avatars/default.png') AS avatar_url,
  ru.activity_points,
  ru.activities_count,
  ru.streak,
  ru.current_rank AS rank,
  ru.last_active,
  -- Compare with previous day's ranking to determine change
  CASE
    WHEN prev.rank IS NULL THEN 'new'
    WHEN ru.current_rank < prev.rank THEN 'up'
    WHEN ru.current_rank > prev.rank THEN 'down'
    ELSE 'same'
  END AS change,
  -- Calculate the amount of change
  CASE
    WHEN prev.rank IS NULL THEN NULL
    WHEN ru.current_rank < prev.rank THEN prev.rank - ru.current_rank
    WHEN ru.current_rank > prev.rank THEN ru.current_rank - prev.rank
    ELSE NULL
  END AS change_amount
FROM
  ranked_users ru
LEFT JOIN (
  -- Get the previous day's ranking
  SELECT
    user_id,
    rank
  FROM
    leaderboard_history
  WHERE
    snapshot_date = CURRENT_DATE - INTERVAL '1 day'
) prev ON prev.user_id = ru.id
ORDER BY
  ru.current_rank;

-- 3. Create a view for leaderboard statistics
CREATE OR REPLACE VIEW leaderboard_stats AS
SELECT
  (SELECT COUNT(*) FROM activities) AS total_activities,
  (SELECT COUNT(*) FROM activities WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') AS monthly_activities,
  (SELECT COUNT(*) FROM activities WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') / 
    NULLIF((SELECT COUNT(*) FROM activities WHERE created_at >= CURRENT_DATE - INTERVAL '60 days' 
            AND created_at < CURRENT_DATE - INTERVAL '30 days'), 0) * 100 - 100 AS monthly_activity_change,
  
  -- Achievement rate (percentage of users who completed their daily goal)
  (SELECT 
    COUNT(DISTINCT user_profile_id)::float / NULLIF(COUNT(DISTINCT user_profiles.id), 0) * 100
   FROM activities 
   CROSS JOIN user_profiles
   WHERE activities.created_at >= CURRENT_DATE - INTERVAL '30 days'
   GROUP BY DATE_TRUNC('day', activities.created_at)
  ) AS achievement_rate,
  
  -- Achievement rate change
  (SELECT 
    (COUNT(DISTINCT user_profile_id)::float / NULLIF(COUNT(DISTINCT user_profiles.id), 0) * 100) - 
    (SELECT COUNT(DISTINCT user_profile_id)::float / NULLIF(COUNT(DISTINCT user_profiles.id), 0) * 100
     FROM activities 
     CROSS JOIN user_profiles
     WHERE activities.created_at >= CURRENT_DATE - INTERVAL '60 days' 
       AND activities.created_at < CURRENT_DATE - INTERVAL '30 days'
     GROUP BY DATE_TRUNC('day', activities.created_at))
   FROM activities 
   CROSS JOIN user_profiles
   WHERE activities.created_at >= CURRENT_DATE - INTERVAL '30 days'
   GROUP BY DATE_TRUNC('day', activities.created_at)
  ) AS achievement_rate_change,
  
  -- Total points earned
  (SELECT SUM(total_points) FROM user_profiles) AS total_points,
  
  -- Points change
  (SELECT SUM(total_points) FROM user_profiles) - 
  (SELECT SUM(points) FROM leaderboard_history WHERE snapshot_date = CURRENT_DATE - INTERVAL '30 days') AS points_change,
  
  -- Points change percentage
  ((SELECT SUM(total_points) FROM user_profiles) - 
   (SELECT SUM(points) FROM leaderboard_history WHERE snapshot_date = CURRENT_DATE - INTERVAL '30 days')) / 
   NULLIF((SELECT SUM(points) FROM leaderboard_history WHERE snapshot_date = CURRENT_DATE - INTERVAL '30 days'), 0) * 100 AS points_change_percentage;

-- 4. Create a function to snapshot the current leaderboard rankings daily
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

-- 5. Create a weekly leaderboard view
CREATE OR REPLACE VIEW weekly_leaderboard AS
WITH weekly_points AS (
  SELECT
    user_profile_id,
    SUM(points) AS weekly_points
  FROM
    activities
  WHERE
    created_at >= DATE_TRUNC('week', CURRENT_DATE)
  GROUP BY
    user_profile_id
),
ranked_users AS (
  SELECT
    up.id,
    up.first_name || ' ' || up.last_name AS name,
    'Loan Officer' AS title,
    up.profile_image_url,
    COALESCE(wp.weekly_points, 0) AS activity_points,
    COUNT(a.id) AS activities_count,
    up.current_day_streak AS streak,
    ROW_NUMBER() OVER (ORDER BY COALESCE(wp.weekly_points, 0) DESC) AS current_rank,
    CASE
      WHEN up.last_activity_date IS NULL THEN 'Never'
      WHEN up.last_activity_date::date = CURRENT_DATE THEN 'Today'
      WHEN up.last_activity_date::date = CURRENT_DATE - INTERVAL '1 day' THEN 'Yesterday'
      WHEN up.last_activity_date::date > CURRENT_DATE - INTERVAL '7 days' THEN (CURRENT_DATE - up.last_activity_date::date) || ' days ago'
      ELSE to_char(up.last_activity_date, 'Mon DD, YYYY')
    END AS last_active
  FROM
    user_profiles up
  LEFT JOIN
    weekly_points wp ON up.id = wp.user_profile_id
  LEFT JOIN
    activities a ON up.id = a.user_profile_id AND a.created_at >= DATE_TRUNC('week', CURRENT_DATE)
  WHERE
    up.is_active = true
  GROUP BY
    up.id, up.first_name, up.last_name, up.profile_image_url, wp.weekly_points, up.current_day_streak, up.last_activity_date
)
SELECT
  ru.id,
  ru.name,
  ru.title,
  COALESCE(ru.profile_image_url, '/avatars/default.png') AS avatar_url,
  ru.activity_points,
  ru.activities_count,
  ru.streak,
  ru.current_rank AS rank,
  ru.last_active,
  -- We don't track weekly rank changes, so set to 'same'
  'same' AS change,
  NULL AS change_amount
FROM
  ranked_users ru
ORDER BY
  ru.current_rank;

-- 6. Create a monthly leaderboard view
CREATE OR REPLACE VIEW monthly_leaderboard AS
WITH monthly_points AS (
  SELECT
    user_profile_id,
    SUM(points) AS monthly_points
  FROM
    activities
  WHERE
    created_at >= DATE_TRUNC('month', CURRENT_DATE)
  GROUP BY
    user_profile_id
),
ranked_users AS (
  SELECT
    up.id,
    up.first_name || ' ' || up.last_name AS name,
    'Loan Officer' AS title,
    up.profile_image_url,
    COALESCE(mp.monthly_points, 0) AS activity_points,
    COUNT(a.id) AS activities_count,
    up.current_day_streak AS streak,
    ROW_NUMBER() OVER (ORDER BY COALESCE(mp.monthly_points, 0) DESC) AS current_rank,
    CASE
      WHEN up.last_activity_date IS NULL THEN 'Never'
      WHEN up.last_activity_date::date = CURRENT_DATE THEN 'Today'
      WHEN up.last_activity_date::date = CURRENT_DATE - INTERVAL '1 day' THEN 'Yesterday'
      WHEN up.last_activity_date::date > CURRENT_DATE - INTERVAL '7 days' THEN (CURRENT_DATE - up.last_activity_date::date) || ' days ago'
      ELSE to_char(up.last_activity_date, 'Mon DD, YYYY')
    END AS last_active
  FROM
    user_profiles up
  LEFT JOIN
    monthly_points mp ON up.id = mp.user_profile_id
  LEFT JOIN
    activities a ON up.id = a.user_profile_id AND a.created_at >= DATE_TRUNC('month', CURRENT_DATE)
  WHERE
    up.is_active = true
  GROUP BY
    up.id, up.first_name, up.last_name, up.profile_image_url, mp.monthly_points, up.current_day_streak, up.last_activity_date
)
SELECT
  ru.id,
  ru.name,
  ru.title,
  COALESCE(ru.profile_image_url, '/avatars/default.png') AS avatar_url,
  ru.activity_points,
  ru.activities_count,
  ru.streak,
  ru.current_rank AS rank,
  ru.last_active,
  -- Compare with previous month's ranking
  CASE
    WHEN prev.rank IS NULL THEN 'new'
    WHEN ru.current_rank < prev.rank THEN 'up'
    WHEN ru.current_rank > prev.rank THEN 'down'
    ELSE 'same'
  END AS change,
  -- Calculate the amount of change
  CASE
    WHEN prev.rank IS NULL THEN NULL
    WHEN ru.current_rank < prev.rank THEN prev.rank - ru.current_rank
    WHEN ru.current_rank > prev.rank THEN ru.current_rank - prev.rank
    ELSE NULL
  END AS change_amount
FROM
  ranked_users ru
LEFT JOIN (
  -- Get the previous month's ranking
  WITH prev_month_points AS (
    SELECT
      user_profile_id,
      SUM(points) AS points
    FROM
      activities
    WHERE
      created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND
      created_at < DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY
      user_profile_id
  )
  SELECT
    user_profile_id,
    ROW_NUMBER() OVER (ORDER BY points DESC) AS rank
  FROM
    prev_month_points
) prev ON prev.user_profile_id = ru.id
ORDER BY
  ru.current_rank;
