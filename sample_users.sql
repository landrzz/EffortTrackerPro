-- SQL to insert 10 sample users into user_profiles table
INSERT INTO user_profiles (
  ghl_user_id, 
  ghl_location_id, 
  first_name, 
  last_name, 
  email, 
  phone, 
  status_level, 
  profile_creation_date, 
  current_day_streak, 
  longest_day_streak, 
  streak_start_date, 
  last_activity_date, 
  weekly_activity_average, 
  daily_goal, 
  total_points, 
  profile_image_url, 
  is_active, 
  last_login, 
  created_at, 
  updated_at
) VALUES
  -- User 1: High performer with long streak
  ('ghl_123456', 'loc_789012', 'Sarah', 'Johnson', 'sarah.johnson@example.com', '(555) 123-4567', 'Gold', '2024-12-01', 28, 35, '2025-03-01', '2025-03-28', 4.8, 3, 1450, 'https://randomuser.me/api/portraits/women/22.jpg', true, '2025-03-28T18:30:00', '2024-12-01', '2025-03-28'),
  
  -- User 2: New user just getting started
  ('ghl_234567', 'loc_890123', 'Michael', 'Chen', 'michael.chen@example.com', '(555) 234-5678', 'Bronze', '2025-03-15', 3, 3, '2025-03-26', '2025-03-28', 1.5, 2, 45, 'https://randomuser.me/api/portraits/men/34.jpg', true, '2025-03-28T09:15:00', '2025-03-15', '2025-03-28'),
  
  -- User 3: Consistent performer with moderate streak
  ('ghl_345678', 'loc_901234', 'Jessica', 'Williams', 'jessica.williams@example.com', '(555) 345-6789', 'Silver', '2025-01-10', 14, 21, '2025-03-15', '2025-03-28', 3.2, 3, 780, 'https://randomuser.me/api/portraits/women/56.jpg', true, '2025-03-28T12:45:00', '2025-01-10', '2025-03-28'),
  
  -- User 4: Inactive user who started strong
  ('ghl_456789', 'loc_012345', 'David', 'Miller', 'david.miller@example.com', '(555) 456-7890', 'Bronze', '2025-02-05', 0, 12, null, '2025-03-15', 0.8, 2, 320, 'https://randomuser.me/api/portraits/men/45.jpg', true, '2025-03-15T16:20:00', '2025-02-05', '2025-03-15'),
  
  -- User 5: Power user with highest points
  ('ghl_567890', 'loc_123456', 'Emma', 'Garcia', 'emma.garcia@example.com', '(555) 567-8901', 'Platinum', '2024-10-15', 45, 45, '2025-02-12', '2025-03-28', 5.0, 4, 2250, 'https://randomuser.me/api/portraits/women/33.jpg', true, '2025-03-28T20:10:00', '2024-10-15', '2025-03-28'),
  
  -- User 6: Sporadic user with broken streaks
  ('ghl_678901', 'loc_234567', 'James', 'Taylor', 'james.taylor@example.com', null, 'Silver', '2025-01-20', 5, 15, '2025-03-24', '2025-03-28', 2.1, 2, 510, 'https://randomuser.me/api/portraits/men/67.jpg', true, '2025-03-28T11:05:00', '2025-01-20', '2025-03-28'),
  
  -- User 7: New but enthusiastic user
  ('ghl_789012', 'loc_345678', 'Olivia', 'Brown', 'olivia.brown@example.com', '(555) 789-0123', 'Bronze', '2025-03-01', 10, 10, '2025-03-19', '2025-03-28', 3.5, 3, 180, 'https://randomuser.me/api/portraits/women/44.jpg', true, '2025-03-28T14:30:00', '2025-03-01', '2025-03-28'),
  
  -- User 8: Inactive user
  ('ghl_890123', 'loc_456789', 'Robert', 'Martinez', 'robert.martinez@example.com', '(555) 890-1234', 'Bronze', '2025-02-10', 0, 5, null, '2025-03-01', 0.2, 1, 95, 'https://randomuser.me/api/portraits/men/22.jpg', false, '2025-03-01T10:45:00', '2025-02-10', '2025-03-01'),
  
  -- User 9: Moderate user with decent streak
  ('ghl_901234', 'loc_567890', 'Sophia', 'Lee', 'sophia.lee@example.com', '(555) 901-2345', 'Silver', '2025-01-05', 8, 18, '2025-03-21', '2025-03-28', 2.8, 2, 640, 'https://randomuser.me/api/portraits/women/65.jpg', true, '2025-03-28T17:15:00', '2025-01-05', '2025-03-28'),
  
  -- User 10: High performer who recently broke streak
  ('ghl_012345', 'loc_678901', 'Daniel', 'Wilson', 'daniel.wilson@example.com', '(555) 012-3456', 'Gold', '2024-11-20', 0, 32, null, '2025-03-26', 3.9, 3, 1680, 'https://randomuser.me/api/portraits/men/78.jpg', true, '2025-03-28T08:50:00', '2024-11-20', '2025-03-28');
