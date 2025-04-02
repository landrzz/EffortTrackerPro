import { supabase } from './supabase';
import { Activity, updateUserPoints } from './userUtils';
import { updateStreakAfterActivity } from './streakUtils';

/**
 * Interface for creating a new activity
 */
export interface NewActivity {
  user_profile_id: string;
  ghl_user_id: string;
  ghl_location_id: string;
  activity_type: string;
  client_name: string;
  client_type: string;
  activity_date: string;
  potential_value?: number | null;
  notes?: string | null;
  status: string;
  points: number;
  tags?: string[] | null;
}

/**
 * Default point values for different activity types
 */
export const ACTIVITY_POINT_VALUES = {
  'call': 2,
  'email': 1,
  'meeting_referral': 12,
  'meeting_new_referral': 20,
  'message': 1,
  'social_post': 5,
  'default': 5
};

/**
 * Normalizes a client name for consistent comparison
 * - Converts to lowercase
 * - Removes extra spaces
 * - Removes punctuation
 * @param name - The client name to normalize
 * @returns Normalized client name
 */
function normalizeClientName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
    .trim()                // Remove leading/trailing spaces
    .replace(/[^\w\s]/g, ''); // Remove punctuation
}

/**
 * Creates a new activity in the database
 * @param activityData - Object containing the activity data
 * @returns Created activity or null if creation failed
 */
export async function createActivity(activityData: Omit<NewActivity, 'points'> & { points?: number }): Promise<Activity | null> {
  try {
    // Validate required fields
    const requiredFields = [
      'user_profile_id', 
      'ghl_user_id', 
      'ghl_location_id', 
      'activity_type', 
      'client_name', 
      'client_type', 
      'activity_date',
      'status'
    ];
    
    const missingFields = requiredFields.filter(field => 
      !activityData[field as keyof typeof activityData]
    );
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return null;
    }
    
    // Check for "per contact per day" rule for call, email, and message activity types
    const perContactPerDayTypes = ['call', 'email', 'message'];
    if (perContactPerDayTypes.includes(activityData.activity_type)) {
      // Check if there's already an activity of this type with this client on the same day
      const startOfDay = new Date(activityData.activity_date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(activityData.activity_date);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Normalize the client name for comparison
      const normalizedClientName = normalizeClientName(activityData.client_name);
      
      // Get all activities of this type for this user on this day
      const { data: existingActivities } = await supabase
        .from('activities')
        .select('*')
        .eq('user_profile_id', activityData.user_profile_id)
        .eq('activity_type', activityData.activity_type)
        .gte('activity_date', startOfDay.toISOString())
        .lte('activity_date', endOfDay.toISOString());
      
      // Check if any of the existing activities have a matching normalized client name
      const hasMatchingClient = existingActivities?.some(activity => 
        normalizeClientName(activity.client_name) === normalizedClientName
      );
      
      if (hasMatchingClient) {
        console.log(`Already recorded a ${activityData.activity_type} with ${activityData.client_name} today. Points will not be awarded again.`);
        // Set points to 0 for duplicate activities
        activityData.points = 0;
      }
    }
    
    // Calculate points based on activity type if not provided
    if (!activityData.points && activityData.points !== 0) {
      const activityType = activityData.activity_type;
      activityData.points = ACTIVITY_POINT_VALUES[activityType as keyof typeof ACTIVITY_POINT_VALUES] || ACTIVITY_POINT_VALUES.default;
    }

    console.log('Creating activity with data:', {
      ...activityData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Insert the new activity
    const { data, error } = await supabase
      .from('activities')
      .insert({
        ...activityData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating activity:', error);
      // Log more details about the error
      if (error.details) console.error('Error details:', error.details);
      if (error.hint) console.error('Error hint:', error.hint);
      if (error.code) console.error('Error code:', error.code);
      return null;
    }
    
    // Update user points directly using the updateUserPoints function
    if (data && activityData.user_profile_id) {
      try {
        // Use the updateUserPoints function from userUtils instead of RPC
        const updatedUser = await updateUserPoints(
          activityData.user_profile_id,
          activityData.points
        );
        
        if (!updatedUser) {
          console.error('Error updating user points after activity creation');
        } else {
          console.log('Successfully updated user points:', updatedUser.total_points);
        }
        
        // Calculate and update streak after recording activity
        const streakResult = await updateStreakAfterActivity(activityData.user_profile_id);
        if (streakResult.success) {
          console.log('Successfully updated user streak:', streakResult.currentStreak);
        } else {
          console.error('Error updating user streak:', streakResult.error);
        }
      } catch (e) {
        console.error('Exception updating user points or streak:', e);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Exception creating activity:', error);
    return null;
  }
}

/**
 * Updates an existing activity in the database
 * @param activityId - ID of the activity to update
 * @param activityData - Object containing the fields to update
 * @returns Updated activity or null if update failed
 */
export async function updateActivity(
  activityId: string,
  activityData: Partial<NewActivity>
): Promise<Activity | null> {
  try {
    const { data, error } = await supabase
      .from('activities')
      .update({
        ...activityData,
        updated_at: new Date().toISOString()
      })
      .eq('id', activityId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating activity:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception updating activity:', error);
    return null;
  }
}
