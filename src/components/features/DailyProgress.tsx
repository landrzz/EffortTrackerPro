'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle2, Trophy, TrendingUp } from 'lucide-react'
import { useGhl } from '@/context/GhlContext'
import { getTodayActivitiesCount, getUserByGhlIds, getUserDailyGoal } from '@/lib/userUtils'

export default function DailyProgress() {
  const { ghlUserId, ghlLocationId, isGhlParamsLoaded } = useGhl()
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState({
    completedActivities: 0,
    totalActivities: 5, // Default value
    streak: 0,
    longestStreak: 0
  })
  
  useEffect(() => {
    async function fetchData() {
      if (!isGhlParamsLoaded || !ghlUserId || !ghlLocationId) return
      
      setIsLoading(true)
      try {
        // Get user profile to get streak data
        const userProfile = await getUserByGhlIds(ghlUserId, ghlLocationId)
        
        if (userProfile) {
          // Get today's activities count
          const todayActivities = await getTodayActivitiesCount(
            userProfile.id, 
            ghlUserId, 
            ghlLocationId
          )
          
          // Get user's daily goal
          const dailyGoal = await getUserDailyGoal(
            userProfile.id,
            ghlUserId,
            ghlLocationId
          )
          
          setProgress({
            completedActivities: todayActivities,
            totalActivities: dailyGoal,
            streak: userProfile.current_day_streak || 0,
            longestStreak: userProfile.longest_day_streak || 0
          })
        }
      } catch (error) {
        console.error('Error fetching daily progress data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [ghlUserId, ghlLocationId, isGhlParamsLoaded])
  
  const progressPercentage = (progress.completedActivities / progress.totalActivities) * 100
  
  return (
    <div className="card h-full flex flex-col">
      <div className="flex justify-between items-start mb-4 md:mb-5">
        <h3 className="text-base md:text-lg font-semibold text-darkNavy">Daily Progress</h3>
        <span className="text-xs text-gray-500">Today</span>
      </div>
      
      <div className="space-y-4 md:space-y-5 flex-grow">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs md:text-sm text-gray-600">Activities Completed</span>
                <span className="text-xs md:text-sm font-medium">{progress.completedActivities}/{progress.totalActivities}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4 md:mt-5">
              <div className="flex flex-col md:flex-row md:items-center p-3 md:p-4 bg-gray-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500 mb-1 md:mb-0 md:mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Current Streak</p>
                  <p className="text-base md:text-lg font-semibold">{progress.streak} days</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center p-3 md:p-4 bg-gray-50 rounded-lg">
                <Trophy className="h-5 w-5 text-yellow-500 mb-1 md:mb-0 md:mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Best Streak</p>
                  <p className="text-base md:text-lg font-semibold">{progress.longestStreak} days</p>
                </div>
              </div>
            </div>
            
            {progress.completedActivities >= progress.totalActivities && (
              <div className="mt-4 md:mt-6 pt-2 md:pt-3 flex items-center text-xs md:text-sm text-green-600">
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span>Daily goal achieved! Great job!</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}