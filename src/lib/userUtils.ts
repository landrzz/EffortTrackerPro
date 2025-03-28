import { supabase } from './supabase';

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
