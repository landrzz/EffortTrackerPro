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
  
  // Add debugging state to track component lifecycle
  const [debugInfo, setDebugInfo] = useState({
    lastRefresh: '',
    userProfileId: '',
    refreshCount: 0
  })
  
  useEffect(() => {
    console.log('DailyProgress component mounted with GHL params:', {
      ghlUserId,
      ghlLocationId,
      isGhlParamsLoaded
    })
    
    async function fetchData() {
      if (!isGhlParamsLoaded || !ghlUserId || !ghlLocationId) {
        console.log('GHL params not loaded or missing, skipping data fetch')
        return
      }
      
      setIsLoading(true)
      setDebugInfo(prev => ({
        ...prev,
        lastRefresh: new Date().toISOString(),
        refreshCount: prev.refreshCount + 1
      }))
      
      console.log('Fetching daily progress data...')
      
      try {
        // Get user profile to get streak data
        console.log('Fetching user profile for GHL IDs:', { ghlUserId, ghlLocationId })
        const userProfile = await getUserByGhlIds(ghlUserId, ghlLocationId)
        console.log('User profile fetched:', userProfile)
        
        if (userProfile) {
          setDebugInfo(prev => ({
            ...prev,
            userProfileId: userProfile.id
          }))
          
          // Get today's activities count - force a refresh by adding a timestamp
          console.log('Fetching today\'s activities count for user:', userProfile.id)
          const todayActivities = await getTodayActivitiesCount(
            userProfile.id, 
            ghlUserId, 
            ghlLocationId
          )
          console.log('Today\'s activities count result:', todayActivities)
          
          // Get user's daily goal
          console.log('Fetching user\'s daily goal')
          const dailyGoal = await getUserDailyGoal(
            userProfile.id,
            ghlUserId,
            ghlLocationId
          )
          console.log('User\'s daily goal:', dailyGoal)
          
          const newProgress = {
            completedActivities: todayActivities,
            totalActivities: dailyGoal,
            streak: userProfile.current_day_streak || 0,
            longestStreak: userProfile.longest_day_streak || 0
          }
          
          console.log('Setting progress with data:', newProgress)
          setProgress(newProgress)
        } else {
          console.error('No user profile found for GHL IDs:', { ghlUserId, ghlLocationId })
        }
      } catch (error) {
        console.error('Error fetching daily progress data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
    
    // Force a refresh every 30 seconds to ensure data is current
    const refreshInterval = setInterval(() => {
      console.log('Refreshing daily progress data from interval');
      fetchData();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [ghlUserId, ghlLocationId, isGhlParamsLoaded])
  
  // Listen for custom event that can be triggered when activities are added
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('profileDataUpdated event received, refreshing daily progress data');
      setIsLoading(true);
      // Refetch data when profile is updated (e.g., when an activity is saved)
      async function refreshData() {
        if (!ghlUserId || !ghlLocationId) {
          setIsLoading(false);
          return;
        }

        try {
          // Get user profile to get streak data
          console.log('Fetching user profile for GHL IDs:', { ghlUserId, ghlLocationId })
          const userProfile = await getUserByGhlIds(ghlUserId, ghlLocationId)
          console.log('User profile fetched:', userProfile)
          
          if (userProfile) {
            setDebugInfo(prev => ({
              ...prev,
              userProfileId: userProfile.id
            }))
            
            // Get today's activities count
            console.log('Fetching today\'s activities count for user:', userProfile.id)
            const todayActivities = await getTodayActivitiesCount(
              userProfile.id, 
              ghlUserId, 
              ghlLocationId
            )
            console.log('Today\'s activities count result:', todayActivities)
            
            // Get user's daily goal
            console.log('Fetching user\'s daily goal')
            const dailyGoal = await getUserDailyGoal(
              userProfile.id,
              ghlUserId,
              ghlLocationId
            )
            console.log('User\'s daily goal:', dailyGoal)
            
            const newProgress = {
              completedActivities: todayActivities,
              totalActivities: dailyGoal,
              streak: userProfile.current_day_streak || 0,
              longestStreak: userProfile.longest_day_streak || 0
            }
            
            console.log('Setting progress with data:', newProgress)
            setProgress(newProgress)
          } else {
            console.error('No user profile found for GHL IDs:', { ghlUserId, ghlLocationId })
          }
        } catch (error) {
          console.error('Error refreshing daily progress data:', error)
        } finally {
          setIsLoading(false)
        }
      }
      
      refreshData();
    };
    
    window.addEventListener('profileDataUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileDataUpdated', handleProfileUpdate);
    };
  }, [ghlUserId, ghlLocationId]);
  
  const progressPercentage = (progress.completedActivities / progress.totalActivities) * 100
  
  return (
    <div className="card h-full flex flex-col">
      <div className="flex justify-between items-start mb-4 md:mb-5">
        <h3 className="text-title text-base md:text-lg">Daily Progress</h3>
        <span className="text-subtitle text-xs">Today</span>
      </div>
      
      <div className="space-y-4 md:space-y-5 flex-grow">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary dark:border-dark-accent-purple"></div>
          </div>
        ) : (
          <>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-body text-xs md:text-sm">Activities Completed</span>
                <span className="text-xs md:text-sm font-medium dark:text-dark-text-primary">{progress.completedActivities}/{progress.totalActivities}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4 md:mt-5">
              <div className="stats-card">
                <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-dark-accent-green mb-1 md:mb-0 md:mr-3" />
                <div>
                  <p className="text-subtitle text-xs">Current Streak</p>
                  <p className="text-title text-base md:text-lg">{progress.streak} days</p>
                </div>
              </div>
              
              <div className="stats-card">
                <Trophy className="h-5 w-5 text-yellow-500 dark:text-amber-400 mb-1 md:mb-0 md:mr-3" />
                <div>
                  <p className="text-subtitle text-xs">Best Streak</p>
                  <p className="text-title text-base md:text-lg">{progress.longestStreak} days</p>
                </div>
              </div>
            </div>
            
            {progress.completedActivities >= progress.totalActivities && (
              <div className="mt-4 md:mt-6 pt-2 md:pt-3 flex items-center text-xs md:text-sm text-green-600 dark:text-dark-accent-green">
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