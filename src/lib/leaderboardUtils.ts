'use client'

import { supabase } from './supabase'

export interface LeaderboardUser {
  id: string
  name: string
  title: string
  avatarUrl: string
  activityPoints: number
  activities: number
  streak: number
  rank: number
  lastActive: string
  change?: 'up' | 'down' | 'same' | 'new'
  changeAmount?: number
}

export interface LeaderboardStats {
  totalActivities: number
  monthlyActivities: number
  monthlyActivityChange: number
  achievementRate: number
  achievementRateChange: number
  totalPoints: number
  pointsChange: number
  pointsChangePercentage: number
}

/**
 * Fetches the current leaderboard data
 * @param timeframe - The timeframe to fetch data for (all, weekly, monthly)
 * @returns Array of leaderboard users
 */
export async function getLeaderboardData(timeframe: 'all' | 'weekly' | 'monthly' = 'all'): Promise<LeaderboardUser[]> {
  try {
    let viewName = 'current_leaderboard'
    
    if (timeframe === 'weekly') {
      viewName = 'weekly_leaderboard'
    } else if (timeframe === 'monthly') {
      viewName = 'monthly_leaderboard'
    }
    
    const { data, error } = await supabase
      .from(viewName)
      .select('*')
      .order('rank', { ascending: true })
      .limit(50)
    
    if (error) {
      console.error('Error fetching leaderboard data:', error)
      return []
    }
    
    // Transform the data to match the LeaderboardUser interface
    return data.map(user => ({
      id: user.id,
      name: user.name,
      title: user.title,
      avatarUrl: user.avatar_url,
      activityPoints: user.activity_points,
      activities: user.activities_count,
      streak: user.streak,
      rank: user.rank,
      lastActive: user.last_active,
      change: user.change,
      changeAmount: user.change_amount
    }))
  } catch (error) {
    console.error('Error in getLeaderboardData:', error)
    return []
  }
}

/**
 * Fetches the leaderboard statistics
 * @returns Leaderboard statistics object
 */
export async function getLeaderboardStats(): Promise<LeaderboardStats | null> {
  try {
    const { data, error } = await supabase
      .from('leaderboard_stats')
      .select('*')
      .single()
    
    if (error) {
      console.error('Error fetching leaderboard stats:', error)
      return null
    }
    
    return {
      totalActivities: data.total_activities || 0,
      monthlyActivities: data.monthly_activities || 0,
      monthlyActivityChange: data.monthly_activity_change || 0,
      achievementRate: data.achievement_rate || 0,
      achievementRateChange: data.achievement_rate_change || 0,
      totalPoints: data.total_points || 0,
      pointsChange: data.points_change || 0,
      pointsChangePercentage: data.points_change_percentage || 0
    }
  } catch (error) {
    console.error('Error in getLeaderboardStats:', error)
    return null
  }
}

/**
 * Manually triggers the leaderboard snapshot function
 * This should typically be run by a scheduled job, but can be triggered manually if needed
 * @returns Success status
 */
export async function triggerLeaderboardSnapshot(): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('snapshot_leaderboard')
    
    if (error) {
      console.error('Error triggering leaderboard snapshot:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error in triggerLeaderboardSnapshot:', error)
    return false
  }
}

/**
 * Fetches a user's rank history for a given time period
 * @param userId - The user's ID
 * @param days - Number of days to fetch history for
 * @returns Array of rank history objects
 */
export async function getUserRankHistory(userId: string, days: number = 30): Promise<{ date: string; rank: number }[]> {
  try {
    const { data, error } = await supabase
      .from('leaderboard_history')
      .select('snapshot_date, rank')
      .eq('user_id', userId)
      .gte('snapshot_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('snapshot_date', { ascending: true })
    
    if (error) {
      console.error('Error fetching user rank history:', error)
      return []
    }
    
    return data.map(item => ({
      date: item.snapshot_date,
      rank: item.rank
    }))
  } catch (error) {
    console.error('Error in getUserRankHistory:', error)
    return []
  }
}
