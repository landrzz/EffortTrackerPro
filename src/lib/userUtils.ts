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
 * @returns Object containing ghlUserId and ghlLocationId
 */
export function extractGhlParams(searchParams: URLSearchParams) {
  const ghlUserId = searchParams.get('ghlUserId') || '';
  const ghlLocationId = searchParams.get('ghlLocationId') || '';
  
  return { ghlUserId, ghlLocationId };
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
