-- Script to create the weekly_leaderboard view
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
