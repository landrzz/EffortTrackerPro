import { supabase } from './supabase'

/**
 * Calculates the current streak for a user based on their activity history
 * @param userId - The user's ID in the database
 * @returns Object containing streak information
 */
export async function calculateUserStreak(userId: string): Promise<{
  success: boolean;
  currentStreak: number;
  longestStreak: number;
  streakStartDate: string | null;
  lastActivityDate: string | null;
  error?: string;
}> {
  try {
    // Get all user activities sorted by date (descending)
    const { data: activities, error } = await supabase
      .from('activities')
      .select('activity_date')
      .eq('user_profile_id', userId)
      .order('activity_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching activities for streak calculation:', error);
      return { 
        success: false, 
        error: 'Failed to fetch activities',
        currentStreak: 0,
        longestStreak: 0,
        streakStartDate: null,
        lastActivityDate: null
      };
    }
    
    if (!activities || activities.length === 0) {
      // No activities found, streak is 0
      return { 
        success: true, 
        currentStreak: 0,
        longestStreak: 0,
        streakStartDate: null,
        lastActivityDate: null
      };
    }
    
    // Get the dates of all activities (convert to YYYY-MM-DD format to handle time zones)
    const activityDates = activities.map((activity: { activity_date: string }) => {
      const date = new Date(activity.activity_date);
      return date.toISOString().split('T')[0];
    });
    
    // Remove duplicate dates (multiple activities on same day count as one day)
    const uniqueDatesSet = new Set(activityDates);
    const uniqueDates = Array.from(uniqueDatesSet);
    
    // Sort dates in descending order (newest first)
    uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    // Calculate current streak
    let currentStreak = 0;
    let streakStartDate = null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Check if the most recent activity was today or yesterday
    // If not, the streak may have been broken
    if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
      // The most recent activity was before yesterday, streak is broken
      // unless it's a new day with no activities yet
      const lastActivityDate = new Date(uniqueDates[0]);
      const daysSinceLastActivity = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastActivity > 1) {
        // Streak is broken
        return { 
          success: true, 
          currentStreak: 0,
          longestStreak: await calculateLongestStreak(uniqueDates),
          streakStartDate: null,
          lastActivityDate: uniqueDates[0]
        };
      }
    }
    
    // Calculate the current streak
    let currentDate = new Date(uniqueDates[0]);
    streakStartDate = uniqueDates[0];
    currentStreak = 1;
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const previousDate = new Date(uniqueDates[i]);
      const dayDifference = Math.floor(
        (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (dayDifference === 1) {
        // Consecutive day, increment streak
        currentStreak++;
        currentDate = previousDate;
        streakStartDate = uniqueDates[i];
      } else if (dayDifference === 0) {
        // Same day (shouldn't happen with uniqueDates), continue
        currentDate = previousDate;
      } else {
        // Gap in streak, stop counting
        break;
      }
    }
    
    // Calculate longest streak
    const longestStreak = await calculateLongestStreak(uniqueDates);
    
    // Update the user profile with the new streak information
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        current_day_streak: currentStreak,
        longest_day_streak: Math.max(longestStreak, currentStreak),
        streak_start_date: streakStartDate,
        last_activity_date: uniqueDates[0]
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error('Error updating user streak:', updateError);
    }
    
    return {
      success: true,
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      streakStartDate,
      lastActivityDate: uniqueDates[0]
    };
  } catch (error) {
    console.error('Exception calculating user streak:', error);
    return { 
      success: false, 
      error: 'Failed to calculate streak',
      currentStreak: 0,
      longestStreak: 0,
      streakStartDate: null,
      lastActivityDate: null
    };
  }
}

/**
 * Calculates the longest streak a user has achieved
 * @param uniqueDates - Array of activity dates in descending order
 * @returns The longest streak count
 */
async function calculateLongestStreak(uniqueDates: string[]): Promise<number> {
  if (!uniqueDates || uniqueDates.length === 0) {
    return 0;
  }
  
  // Sort dates in ascending order for longest streak calculation
  const sortedDates = [...uniqueDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  let longestStreak = 1;
  let currentStreak = 1;
  let currentDate = new Date(sortedDates[0]);
  
  for (let i = 1; i < sortedDates.length; i++) {
    const nextDate = new Date(sortedDates[i]);
    const dayDifference = Math.floor(
      (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (dayDifference === 1) {
      // Consecutive day, increment streak
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else if (dayDifference === 0) {
      // Same day (shouldn't happen with uniqueDates), continue
      continue;
    } else {
      // Gap in streak, reset counter
      currentStreak = 1;
    }
    
    currentDate = nextDate;
  }
  
  return longestStreak;
}

/**
 * Updates a user's streak after recording a new activity
 * @param userId - The user's ID in the database
 * @returns Object containing updated streak information
 */
export async function updateStreakAfterActivity(userId: string): Promise<{
  success: boolean;
  currentStreak: number;
  longestStreak: number;
  streakStartDate: string | null;
  lastActivityDate: string | null;
  error?: string;
}> {
  return calculateUserStreak(userId);
}
