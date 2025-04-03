'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { useGhl } from '@/context/GhlContext'
import { 
  getUserByGhlIds, 
  getWeeklyActivitiesCount, 
  getWeeklyPoints, 
  getWeeklyGoalCompletion,
  getUserDailyGoal
} from '@/lib/userUtils'

interface ProgressCircleProps {
  percentage: number
  size: number
  label: string
  value: string
}

function ProgressCircle({ percentage, size, label, value }: ProgressCircleProps) {
  const strokeWidth = size > 70 ? 8 : 6
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-primary dark:text-dark-accent-purple"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base sm:text-lg md:text-xl font-bold dark:text-dark-text-primary">{value}</span>
        </div>
      </div>
      <span className="mt-2 text-xs md:text-sm text-body">{label}</span>
    </div>
  )
}

export default function WeeklyProgress() {
  const { ghlUserId, ghlLocationId, isGhlParamsLoaded } = useGhl()
  const [circleSize, setCircleSize] = useState(80)
  const [currentDay, setCurrentDay] = useState(1)
  const [currentDayName, setCurrentDayName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [weeklyStats, setWeeklyStats] = useState([
    { label: 'Activities', percentage: 0, value: '0' },
    { label: 'Points', percentage: 0, value: '0' },
    { label: 'Streak', percentage: 0, value: '0' },
    { label: 'Goal', percentage: 0, value: '0%' }
  ])
  
  // Handle window resize client-side only
  useEffect(() => {
    const handleResize = () => {
      setCircleSize(window.innerWidth < 768 ? 60 : 80);
    };
    
    // Set initial size
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Calculate current day of the week (1-7, Monday-Sunday)
  useEffect(() => {
    const calculateCurrentDay = () => {
      const now = new Date();
      // getDay() returns 0-6 (Sunday-Saturday), we need 1-7 (Monday-Sunday)
      let day = now.getDay();
      // Convert Sunday (0) to 7, and shift others by -1
      day = day === 0 ? 7 : day;
      setCurrentDay(day);
      
      // Get day name
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      setCurrentDayName(dayNames[now.getDay()]);
    };

    // Calculate initial day
    calculateCurrentDay();

    // Set up a timer to check for day changes
    const timer = setInterval(() => {
      calculateCurrentDay();
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(timer);
  }, []);
  
  // Fetch weekly progress data
  useEffect(() => {
    async function fetchWeeklyData() {
      if (!isGhlParamsLoaded || !ghlUserId || !ghlLocationId) {
        console.log('GHL params not loaded or missing, skipping weekly data fetch')
        return
      }
      
      setIsLoading(true)
      
      try {
        console.log('Fetching weekly progress data...')
        
        // Get user profile
        const userProfile = await getUserByGhlIds(ghlUserId, ghlLocationId)
        
        if (!userProfile) {
          console.error('No user profile found for GHL IDs:', { ghlUserId, ghlLocationId })
          setIsLoading(false)
          return
        }
        
        // Get weekly activities count
        const activitiesCount = await getWeeklyActivitiesCount(
          userProfile.id,
          ghlUserId,
          ghlLocationId
        )
        
        // Get weekly points
        const weeklyPoints = await getWeeklyPoints(
          userProfile.id,
          ghlUserId,
          ghlLocationId
        )
        
        // Get weekly goal completion percentage
        const goalCompletion = await getWeeklyGoalCompletion(
          userProfile.id,
          ghlUserId,
          ghlLocationId
        )
        
        // Get daily goal to calculate weekly goal
        const dailyGoal = await getUserDailyGoal(
          userProfile.id,
          ghlUserId,
          ghlLocationId
        )
        
        // Calculate weekly goal
        const weeklyGoal = dailyGoal * 7
        
        // Calculate streak percentage (current streak / longest streak) * 100
        // If longest streak is 0, use 100% if current streak > 0, otherwise 0%
        const streakPercentage = userProfile.longest_day_streak > 0 
          ? (userProfile.current_day_streak / userProfile.longest_day_streak) * 100 
          : userProfile.current_day_streak > 0 ? 100 : 0
        
        // Calculate activities percentage (activities / weekly goal) * 100, capped at 100%
        const activitiesPercentage = Math.min((activitiesCount / weeklyGoal) * 100, 100)
        
        // Calculate points percentage based on weekly goal (assuming 10 points per activity as a rough estimate)
        // This is a placeholder calculation - adjust based on your business logic
        const pointsTarget = weeklyGoal * 10
        const pointsPercentage = Math.min((weeklyPoints / pointsTarget) * 100, 100)
        
        // Update weekly stats
        setWeeklyStats([
          { 
            label: 'Activities', 
            percentage: activitiesPercentage, 
            value: activitiesCount.toString() 
          },
          { 
            label: 'Points', 
            percentage: pointsPercentage, 
            value: weeklyPoints.toString() 
          },
          { 
            label: 'Streak', 
            percentage: streakPercentage, 
            value: userProfile.current_day_streak.toString() 
          },
          { 
            label: 'Goal', 
            percentage: goalCompletion, 
            value: `${Math.round(goalCompletion)}%` 
          }
        ])
        
      } catch (error) {
        console.error('Error fetching weekly progress data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchWeeklyData()
    
    // Set up refresh interval
    const refreshInterval = setInterval(() => {
      fetchWeeklyData()
    }, 60000) // Refresh every minute
    
    return () => clearInterval(refreshInterval)
  }, [ghlUserId, ghlLocationId, isGhlParamsLoaded])
  
  // Listen for profile data updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('profileDataUpdated event received, refreshing weekly progress data')
      
      async function refreshData() {
        if (!ghlUserId || !ghlLocationId) {
          return
        }
        
        setIsLoading(true)
        
        try {
          // Get user profile
          const userProfile = await getUserByGhlIds(ghlUserId, ghlLocationId)
          
          if (!userProfile) {
            console.error('No user profile found for GHL IDs:', { ghlUserId, ghlLocationId })
            setIsLoading(false)
            return
          }
          
          // Get weekly activities count
          const activitiesCount = await getWeeklyActivitiesCount(
            userProfile.id,
            ghlUserId,
            ghlLocationId
          )
          
          // Get weekly points
          const weeklyPoints = await getWeeklyPoints(
            userProfile.id,
            ghlUserId,
            ghlLocationId
          )
          
          // Get weekly goal completion percentage
          const goalCompletion = await getWeeklyGoalCompletion(
            userProfile.id,
            ghlUserId,
            ghlLocationId
          )
          
          // Get daily goal to calculate weekly goal
          const dailyGoal = await getUserDailyGoal(
            userProfile.id,
            ghlUserId,
            ghlLocationId
          )
          
          // Calculate weekly goal
          const weeklyGoal = dailyGoal * 7
          
          // Calculate streak percentage (current streak / longest streak) * 100
          // If longest streak is 0, use 100% if current streak > 0, otherwise 0%
          const streakPercentage = userProfile.longest_day_streak > 0 
            ? (userProfile.current_day_streak / userProfile.longest_day_streak) * 100 
            : userProfile.current_day_streak > 0 ? 100 : 0
          
          // Calculate activities percentage (activities / weekly goal) * 100, capped at 100%
          const activitiesPercentage = Math.min((activitiesCount / weeklyGoal) * 100, 100)
          
          // Calculate points percentage based on weekly goal (assuming 10 points per activity as a rough estimate)
          // This is a placeholder calculation - adjust based on your business logic
          const pointsTarget = weeklyGoal * 10
          const pointsPercentage = Math.min((weeklyPoints / pointsTarget) * 100, 100)
          
          // Update weekly stats
          setWeeklyStats([
            { 
              label: 'Activities', 
              percentage: activitiesPercentage, 
              value: activitiesCount.toString() 
            },
            { 
              label: 'Points', 
              percentage: pointsPercentage, 
              value: weeklyPoints.toString() 
            },
            { 
              label: 'Streak', 
              percentage: streakPercentage, 
              value: userProfile.current_day_streak.toString() 
            },
            { 
              label: 'Goal', 
              percentage: goalCompletion, 
              value: `${Math.round(goalCompletion)}%` 
            }
          ])
          
        } catch (error) {
          console.error('Error refreshing weekly progress data:', error)
        } finally {
          setIsLoading(false)
        }
      }
      
      refreshData()
    }
    
    window.addEventListener('profileDataUpdated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('profileDataUpdated', handleProfileUpdate)
    }
  }, [ghlUserId, ghlLocationId])
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h3 className="text-title text-base md:text-lg">Weekly Progress</h3>
        {/* <button className="text-primary text-xs md:text-sm font-medium flex items-center">
          View Details
          <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
        </button> */}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-2">
        {isLoading ? (
          // Loading state
          <>
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative" style={{ width: circleSize, height: circleSize }}>
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full" style={{ width: circleSize, height: circleSize }}></div>
                </div>
                <div className="mt-2 h-4 w-16 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </>
        ) : (
          // Actual data
          weeklyStats.map((stat, index) => (
            <ProgressCircle
              key={index}
              percentage={stat.percentage}
              size={circleSize}
              label={stat.label}
              value={stat.value}
            />
          ))
        )}
      </div>
      
      <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-100 dark:border-dark-border">
        <div className="flex justify-between items-center text-xs md:text-sm">
          <span className="text-subtitle">Week Progress: {currentDayName}</span>
          <span className="font-medium dark:text-dark-text-primary">{currentDay} of 7 days</span>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div
              key={day}
              className={`h-1.5 md:h-2 rounded-full ${
                day <= currentDay ? 'bg-primary dark:bg-dark-accent-purple' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}