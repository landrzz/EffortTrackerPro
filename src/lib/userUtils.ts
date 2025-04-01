import { supabase } from './supabase';

// Define status levels and their point thresholds
export const STATUS_LEVELS = [
  { name: 'Bronze', minPoints: 0, maxPoints: 99 },
  { name: 'Silver', minPoints: 100, maxPoints: 499 },
  { name: 'Gold', minPoints: 500, maxPoints: 1999 },
  { name: 'Platinum', minPoints: 2000, maxPoints: Infinity }
];

// Define status level type
export type StatusLevel = {
  name: string;
  minPoints: number;
  maxPoints: number;
};

/**
 * Determines the correct status level based on points
 * @param points - Total points of the user
 * @returns The appropriate status level object
 */
export function getStatusLevelForPoints(points: number): StatusLevel {
  for (const level of STATUS_LEVELS) {
    if (points >= level.minPoints && points <= level.maxPoints) {
      return level;
    }
  }
  // Default to the highest level if no match is found (shouldn't happen with Infinity)
  return STATUS_LEVELS[STATUS_LEVELS.length - 1];
}

/**
 * Fetches a user profile from Supabase based on GHL identifiers
 * @param ghlUserId - Go High Level User ID
 * @param ghlLocationId - Go High Level Location ID
 * @returns User profile object or null if not found
 */
export async function getUserByGhlIds(ghlUserId: string, ghlLocationId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('ghl_user_id', ghlUserId)
      .eq('ghl_location_id', ghlLocationId)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    
    // Update last_login timestamp
    if (data) {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id);
      
      if (updateError) {
        console.error('Error updating last login:', updateError);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching user:', error);
    return null;
  }
}

/**
 * Extracts GHL parameters from URL search params
 * @param searchParams - URL search parameters
 * @returns Object containing GHL parameters
 */
export function extractGhlParams(searchParams: URLSearchParams) {
  const ghlUserId = searchParams.get('ghlUserId') || '';
  const ghlLocationId = searchParams.get('ghlLocationId') || '';
  const ghlUserName = searchParams.get('ghlUserName') || '';
  const ghlUserEmail = searchParams.get('ghlUserEmail') || '';
  const ghlUserPhone = searchParams.get('ghlUserPhone') || '';
  
  return { ghlUserId, ghlLocationId, ghlUserName, ghlUserEmail, ghlUserPhone };
}

/**
 * Type definition for user profile from database
 */
export interface UserProfile {
  id: string;
  ghl_user_id: string;
  ghl_location_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status_level: string;
  profile_creation_date: string;
  current_day_streak: number;
  longest_day_streak: number;
  streak_start_date: string | null;
  last_activity_date: string | null;
  weekly_activity_average: number;
  daily_goal: number;
  total_points: number;
  profile_image_url: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for updatable user profile fields
 */
export interface UserProfileUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string | null;
  total_points?: number;
  status_level?: string;
  daily_goal?: number;
  profile_image_url?: string | null;
}

/**
 * Updates a user profile in Supabase
 * @param userId - User ID (if available)
 * @param ghlUserId - Go High Level User ID (required if userId not provided)
 * @param ghlLocationId - Go High Level Location ID (required if userId not provided)
 * @param profileData - Object containing fields to update
 * @returns Updated user profile or null if update failed
 */
export async function updateUserProfile(
  userId: string | null,
  ghlUserId: string | null,
  ghlLocationId: string | null,
  profileData: UserProfileUpdate
) {
  try {
    // If points are being updated, automatically update the status level
    if (profileData.total_points !== undefined) {
      const statusLevel = getStatusLevelForPoints(profileData.total_points);
      profileData.status_level = statusLevel.name;
    }
    
    let query = supabase.from('user_profiles').update({
      ...profileData,
      updated_at: new Date().toISOString()
    });
    
    // If we have a user ID, use that for the update
    if (userId) {
      query = query.eq('id', userId);
    } 
    // Otherwise use GHL parameters
    else if (ghlUserId && ghlLocationId) {
      query = query.eq('ghl_user_id', ghlUserId).eq('ghl_location_id', ghlLocationId);
    }
    // If we don't have either, we can't update
    else {
      console.error('Error updating user profile: No identifier provided');
      return null;
    }
    
    const { data, error } = await query.select().single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception updating user profile:', error);
    return null;
  }
}

/**
 * Updates a user's points and automatically updates their status level
 * @param userId - User ID
 * @param pointsToAdd - Number of points to add (can be negative to subtract)
 * @returns Updated user profile or null if update failed
 */
export async function updateUserPoints(
  userId: string,
  pointsToAdd: number
) {
  try {
    // First get the current user profile
    const { data: userData, error: fetchError } = await supabase
      .from('user_profiles')
      .select('total_points')
      .eq('id', userId)
      .single();
    
    if (fetchError || !userData) {
      console.error('Error fetching user points:', fetchError);
      return null;
    }
    
    // Calculate new points total
    const newTotalPoints = Math.max(0, (userData.total_points || 0) + pointsToAdd);
    
    // Get the appropriate status level
    const statusLevel = getStatusLevelForPoints(newTotalPoints);
    
    // Update the user profile
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        total_points: newTotalPoints,
        status_level: statusLevel.name,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user points:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception updating user points:', error);
    return null;
  }
}

/**
 * Type definition for activity from database
 */
export interface Activity {
  id: string;
  user_profile_id: string;
  ghl_user_id: string;
  ghl_location_id: string;
  activity_type: string;
  client_name: string;
  client_type: string;
  activity_date: string;
  potential_value: number | null;
  notes: string | null;
  status: string;
  points: number;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches user activities from Supabase
 * @param userId - User ID (if available)
 * @param ghlUserId - Go High Level User ID (required if userId not provided)
 * @param ghlLocationId - Go High Level Location ID (required if userId not provided)
 * @param limit - Maximum number of activities to return (default: 10)
 * @returns Array of activities or empty array if none found
 */
export async function getUserActivities(
  userId: string | null,
  ghlUserId: string | null,
  ghlLocationId: string | null,
  limit: number = 10
): Promise<Activity[]> {
  try {
    let query = supabase
      .from('activities')
      .select('*')
      .order('activity_date', { ascending: false })
      .limit(limit);
    
    // If we have a user ID, use that for the query
    if (userId) {
      query = query.eq('user_profile_id', userId);
    } 
    // Otherwise use GHL parameters
    else if (ghlUserId && ghlLocationId) {
      query = query.eq('ghl_user_id', ghlUserId).eq('ghl_location_id', ghlLocationId);
    }
    // If we don't have either, we can't query
    else {
      console.error('Error fetching user activities: No identifier provided');
      return [];
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching user activities:', error);
    return [];
  }
}

/**
 * Calculates the total points earned in the current month
 * @param activities - Array of user activities
 * @returns Total points earned in the current month
 */
export function calculateMonthlyPoints(activities: Activity[]): number {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return activities
    .filter(activity => new Date(activity.activity_date) >= startOfMonth)
    .reduce((total, activity) => total + activity.points, 0);
}

/**
 * Counts the number of activities completed today
 * @param userId - User ID (if available)
 * @param ghlUserId - Go High Level User ID (required if userId not provided)
 * @param ghlLocationId - Go High Level Location ID (required if userId not provided)
 * @returns Number of activities completed today
 */
export async function getTodayActivitiesCount(
  userId: string | null,
  ghlUserId: string | null,
  ghlLocationId: string | null
): Promise<number> {
  try {
    // Log the input parameters
    console.log('getTodayActivitiesCount called with:', { userId, ghlUserId, ghlLocationId });
    
    // Get today's date in local timezone
    const now = new Date();
    
    // Create a date string in YYYY-MM-DD format for the current day
    const todayDateString = now.toISOString().split('T')[0]; // Gets YYYY-MM-DD
    
    console.log('Querying activities for date:', todayDateString);
    
    // Log the exact query we're about to run
    const queryParams = {
      date: todayDateString,
      userId: userId || 'null',
      ghlUserId: ghlUserId || 'null',
      ghlLocationId: ghlLocationId || 'null'
    };
    console.log('Query parameters:', queryParams);
    
    // Use a different approach - query with date range instead of LIKE
    // Start of day in UTC
    const startOfDay = new Date(todayDateString + 'T00:00:00.000Z');
    // End of day in UTC
    const endOfDay = new Date(todayDateString + 'T23:59:59.999Z');
    
    console.log('Date range query:', {
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString()
    });
    
    let query = supabase
      .from('activities')
      .select('id, activity_date, activity_type, user_profile_id, ghl_user_id, ghl_location_id', { count: 'exact' })
      .gte('activity_date', startOfDay.toISOString())
      .lte('activity_date', endOfDay.toISOString());
    
    // If we have a user ID, use that for the query
    if (userId) {
      console.log(`Filtering by user_profile_id: ${userId}`);
      query = query.eq('user_profile_id', userId);
    } 
    // Otherwise use GHL parameters
    else if (ghlUserId && ghlLocationId) {
      console.log(`Filtering by ghl_user_id: ${ghlUserId} and ghl_location_id: ${ghlLocationId}`);
      query = query.eq('ghl_user_id', ghlUserId).eq('ghl_location_id', ghlLocationId);
    }
    // If we don't have either, we can't query
    else {
      console.error('Error counting today\'s activities: No identifier provided');
      return 0;
    }
    
    // Execute the query and log the raw response
    console.log('Executing Supabase query...');
    const response = await query;
    console.log('Raw Supabase response:', response);
    
    const { count, error, data } = response;
    
    if (error) {
      console.error('Error counting today\'s activities:', error);
      return 0;
    }
    
    // Log the actual data for debugging
    console.log('Today\'s activities data:', data);
    console.log('Today\'s activities count:', count);
    
    // Double-check the count by counting the array length
    const manualCount = data ? data.length : 0;
    console.log('Manual count from data array:', manualCount);
    
    // Return the count from the query, or fall back to manual count if needed
    return count !== null ? count : manualCount;
  } catch (error) {
    console.error('Exception counting today\'s activities:', error);
    return 0;
  }
}

/**
 * Gets the user's daily activity goal
 * @param userId - User ID (if available)
 * @param ghlUserId - Go High Level User ID (required if userId not provided)
 * @param ghlLocationId - Go High Level Location ID (required if userId not provided)
 * @returns User's daily goal or default value of 5 if not found
 */
export async function getUserDailyGoal(
  userId: string | null,
  ghlUserId: string | null,
  ghlLocationId: string | null
): Promise<number> {
  try {
    let query = supabase
      .from('user_profiles')
      .select('daily_goal');
    
    // If we have a user ID, use that for the query
    if (userId) {
      query = query.eq('id', userId);
    } 
    // Otherwise use GHL parameters
    else if (ghlUserId && ghlLocationId) {
      query = query.eq('ghl_user_id', ghlUserId).eq('ghl_location_id', ghlLocationId);
    }
    // If we don't have either, we can't query
    else {
      console.error('Error fetching user daily goal: No identifier provided');
      return 5; // Default value
    }
    
    const { data, error } = await query.single();
    
    if (error) {
      console.error('Error fetching user daily goal:', error);
      return 5; // Default value
    }
    
    return data?.daily_goal || 5; // Default to 5 if not set
  } catch (error) {
    console.error('Exception fetching user daily goal:', error);
    return 5; // Default value
  }
}

/**
 * Creates a new user profile in Supabase using GHL identifiers
 * @param ghlUserId - Go High Level User ID
 * @param ghlLocationId - Go High Level Location ID
 * @param initialData - Optional initial user data
 * @returns Newly created user profile or null if creation failed
 */
export async function createUserProfile(
  ghlUserId: string,
  ghlLocationId: string,
  initialData: Partial<UserProfileUpdate> = {}
): Promise<UserProfile | null> {
  try {
    const now = new Date().toISOString();
    
    // Set up default values for a new user
    const userData = {
      ghl_user_id: ghlUserId,
      ghl_location_id: ghlLocationId,
      first_name: initialData.first_name || '',
      last_name: initialData.last_name || '',
      email: initialData.email || '',
      phone: initialData.phone || null,
      status_level: 'Bronze',
      profile_creation_date: now,
      current_day_streak: 0,
      longest_day_streak: 0,
      streak_start_date: null,
      last_activity_date: null,
      weekly_activity_average: 0,
      daily_goal: initialData.daily_goal || 5,
      total_points: 0,
      profile_image_url: null,
      is_active: true,
      last_login: now,
      created_at: now,
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(userData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception creating user profile:', error);
    return null;
  }
}

/**
 * Gets the user's weekly activities count
 * @param userId - User ID (if available)
 * @param ghlUserId - Go High Level User ID (required if userId not provided)
 * @param ghlLocationId - Go High Level Location ID (required if userId not provided)
 * @returns Number of activities completed this week
 */
export async function getWeeklyActivitiesCount(
  userId: string | null,
  ghlUserId: string | null,
  ghlLocationId: string | null
): Promise<number> {
  try {
    // Get the start of the current week (Monday)
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    
    let query = supabase
      .from('activities')
      .select('id', { count: 'exact' })
      .gte('activity_date', startOfWeek.toISOString());
    
    // If we have a user ID, use that for the query
    if (userId) {
      query = query.eq('user_profile_id', userId);
    } 
    // Otherwise use GHL parameters
    else if (ghlUserId && ghlLocationId) {
      query = query.eq('ghl_user_id', ghlUserId).eq('ghl_location_id', ghlLocationId);
    }
    // If we don't have either, we can't query
    else {
      console.error('Error counting weekly activities: No identifier provided');
      return 0;
    }
    
    const { count, error } = await query;
    
    if (error) {
      console.error('Error counting weekly activities:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Exception counting weekly activities:', error);
    return 0;
  }
}

/**
 * Gets the user's weekly points
 * @param userId - User ID (if available)
 * @param ghlUserId - Go High Level User ID (required if userId not provided)
 * @param ghlLocationId - Go High Level Location ID (required if userId not provided)
 * @returns Total points earned this week
 */
export async function getWeeklyPoints(
  userId: string | null,
  ghlUserId: string | null,
  ghlLocationId: string | null
): Promise<number> {
  try {
    // Get the start of the current week (Monday)
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    
    let query = supabase
      .from('activities')
      .select('points');
      
    // Add date filter
    query = query.gte('activity_date', startOfWeek.toISOString());
    
    // If we have a user ID, use that for the query
    if (userId) {
      query = query.eq('user_profile_id', userId);
    } 
    // Otherwise use GHL parameters
    else if (ghlUserId && ghlLocationId) {
      query = query.eq('ghl_user_id', ghlUserId).eq('ghl_location_id', ghlLocationId);
    }
    // If we don't have either, we can't query
    else {
      console.error('Error calculating weekly points: No identifier provided');
      return 0;
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error calculating weekly points:', error);
      return 0;
    }
    
    // Sum up all the points
    return data.reduce((total, activity) => total + (activity.points || 0), 0);
  } catch (error) {
    console.error('Exception calculating weekly points:', error);
    return 0;
  }
}

/**
 * Gets the user's weekly goal completion percentage
 * @param userId - User ID (if available)
 * @param ghlUserId - Go High Level User ID (required if userId not provided)
 * @param ghlLocationId - Go High Level Location ID (required if userId not provided)
 * @returns Percentage of weekly goal completed (0-100)
 */
export async function getWeeklyGoalCompletion(
  userId: string | null,
  ghlUserId: string | null,
  ghlLocationId: string | null
): Promise<number> {
  try {
    // Get daily goal first
    const dailyGoal = await getUserDailyGoal(userId, ghlUserId, ghlLocationId);
    
    // Weekly goal is daily goal * 7
    const weeklyGoal = dailyGoal * 7;
    
    // Get weekly activities count
    const weeklyActivities = await getWeeklyActivitiesCount(userId, ghlUserId, ghlLocationId);
    
    // Calculate percentage
    const percentage = (weeklyActivities / weeklyGoal) * 100;
    
    // Return percentage, capped at 100%
    return Math.min(percentage, 100);
  } catch (error) {
    console.error('Exception calculating weekly goal completion:', error);
    return 0;
  }
}

/**
 * Gets the user's daily activity counts for the past 7 days
 * @param userId - User ID (if available)
 * @param ghlUserId - Go High Level User ID (required if userId not provided)
 * @param ghlLocationId - Go High Level Location ID (required if userId not provided)
 * @returns Array of daily activity counts for the past 7 days
 */
export async function getWeeklyActivityData(
  userId: string | null,
  ghlUserId: string | null,
  ghlLocationId: string | null
): Promise<{ day: string; value: number; date: string }[]> {
  try {
    // Get the date 7 days ago
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6); // Get 7 days including today
    sevenDaysAgo.setHours(0, 0, 0, 0);
    
    let query = supabase
      .from('activities')
      .select('activity_date')
      .gte('activity_date', sevenDaysAgo.toISOString());
    
    // If we have a user ID, use that for the query
    if (userId) {
      query = query.eq('user_profile_id', userId);
    } 
    // Otherwise use GHL parameters
    else if (ghlUserId && ghlLocationId) {
      query = query.eq('ghl_user_id', ghlUserId).eq('ghl_location_id', ghlLocationId);
    }
    // If we don't have either, we can't query
    else {
      console.error('Error fetching weekly activity data: No identifier provided');
      return generateEmptyWeekData();
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching weekly activity data:', error);
      return generateEmptyWeekData();
    }
    
    // Process the data to get counts per day
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    
    // Create array for the past 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - 6 + i);
      
      const dayName = dayNames[date.getDay()];
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Count activities for this day
      const dayActivities = data?.filter(activity => {
        const activityDate = new Date(activity.activity_date);
        return activityDate.toISOString().split('T')[0] === dateString;
      }) || [];
      
      result.push({
        day: dayName,
        value: dayActivities.length,
        date: dateString
      });
    }
    
    return result;
  } catch (error) {
    console.error('Exception fetching weekly activity data:', error);
    return generateEmptyWeekData();
  }
}

/**
 * Gets the user's weekly activity counts for the past 4 weeks
 * @param userId - User ID (if available)
 * @param ghlUserId - Go High Level User ID (required if userId not provided)
 * @param ghlLocationId - Go High Level Location ID (required if userId not provided)
 * @returns Array of weekly activity counts for the past 4 weeks
 */
export async function getMonthlyActivityData(
  userId: string | null,
  ghlUserId: string | null,
  ghlLocationId: string | null
): Promise<{ week: string; value: number }[]> {
  try {
    // Get the date 4 weeks ago
    const now = new Date();
    const fourWeeksAgo = new Date(now);
    fourWeeksAgo.setDate(now.getDate() - 28); // 4 weeks
    fourWeeksAgo.setHours(0, 0, 0, 0);
    
    let query = supabase
      .from('activities')
      .select('activity_date')
      .gte('activity_date', fourWeeksAgo.toISOString());
    
    // If we have a user ID, use that for the query
    if (userId) {
      query = query.eq('user_profile_id', userId);
    } 
    // Otherwise use GHL parameters
    else if (ghlUserId && ghlLocationId) {
      query = query.eq('ghl_user_id', ghlUserId).eq('ghl_location_id', ghlLocationId);
    }
    // If we don't have either, we can't query
    else {
      console.error('Error fetching monthly activity data: No identifier provided');
      return generateEmptyMonthData();
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching monthly activity data:', error);
      return generateEmptyMonthData();
    }
    
    const result = [];
    
    // Create array for the past 4 weeks
    for (let i = 0; i < 4; i++) {
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - (i * 7));
      
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      
      // Format dates as MM/DD
      const formatDate = (date: Date) => {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}/${day}`;
      };
      
      const weekRange = `${formatDate(weekStart)}-${formatDate(weekEnd)}`;
      
      // Count activities for this week
      const weekActivities = data?.filter(activity => {
        const activityDate = new Date(activity.activity_date);
        return activityDate >= weekStart && activityDate <= weekEnd;
      }) || [];
      
      result.push({
        week: weekRange,
        value: weekActivities.length
      });
    }
    
    // Reverse the array so it's in chronological order
    return result.reverse();
  } catch (error) {
    console.error('Exception fetching monthly activity data:', error);
    return generateEmptyMonthData();
  }
}

// Helper function to generate empty week data
function generateEmptyWeekData(): { day: string; value: number; date: string }[] {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const result = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - 6 + i);
    
    const dayName = dayNames[date.getDay()];
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    result.push({
      day: dayName,
      value: 0,
      date: dateString
    });
  }
  
  return result;
}

// Helper function to generate empty month data
function generateEmptyMonthData(): { week: string; value: number }[] {
  const now = new Date();
  const result = [];
  
  for (let i = 0; i < 4; i++) {
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() - (i * 7));
    
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6);
    
    // Format dates as MM/DD
    const formatDate = (date: Date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}/${day}`;
    };
    
    const weekRange = `${formatDate(weekStart)}-${formatDate(weekEnd)}`;
    
    result.push({
      week: weekRange,
      value: 0
    });
  }
  
  // Reverse the array so it's in chronological order
  return result.reverse();
}
