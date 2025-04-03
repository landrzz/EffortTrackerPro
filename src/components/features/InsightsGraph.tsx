'use client'

import React, { useState, useEffect } from 'react'
import { ArrowUpRight, BarChart2, RefreshCw } from 'lucide-react'
import { useGhl } from '@/context/GhlContext'
import { getWeeklyActivityData, getMonthlyActivityData, getUserByGhlIds, getWeeklyPoints, getUserDailyGoal } from '@/lib/userUtils'

export default function InsightsGraph() {
  const [timeframe, setTimeframe] = useState<'days' | 'weeks'>('days')
  const { ghlUserId, ghlLocationId, isGhlParamsLoaded } = useGhl()
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // State for activity data
  const [daysData, setDaysData] = useState<{ day: string; value: number; date: string }[]>([])
  const [weeksData, setWeeksData] = useState<{ week: string; value: number }[]>([])
  const [performance, setPerformance] = useState({
    percentage: '+0%',
    average: 0
  })
  
  // Fetch data on component mount and when GHL params change
  useEffect(() => {
    if (!isGhlParamsLoaded || !ghlUserId || !ghlLocationId) {
      return
    }
    
    fetchActivityData()
    
    // Refresh data every 60 seconds
    const refreshInterval = setInterval(() => {
      fetchActivityData(false)
    }, 60000)
    
    return () => clearInterval(refreshInterval)
  }, [ghlUserId, ghlLocationId, isGhlParamsLoaded])
  
  // Listen for custom event that can be triggered when activities are added
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchActivityData(false)
    }
    
    window.addEventListener('profileDataUpdated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('profileDataUpdated', handleProfileUpdate)
    }
  }, [ghlUserId, ghlLocationId])
  
  // Function to fetch activity data
  const fetchActivityData = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    } else {
      setIsRefreshing(true)
    }
    
    try {
      // Get user profile first
      const userProfile = await getUserByGhlIds(ghlUserId!, ghlLocationId!)
      
      if (userProfile) {
        // Fetch daily activity data
        const dailyData = await getWeeklyActivityData(
          userProfile.id,
          ghlUserId!,
          ghlLocationId!
        )
        setDaysData(dailyData)
        
        // Fetch weekly activity data
        const weeklyData = await getMonthlyActivityData(
          userProfile.id,
          ghlUserId!,
          ghlLocationId!
        )
        setWeeksData(weeklyData)
        
        // Calculate performance metrics
        const weeklyPoints = await getWeeklyPoints(
          userProfile.id,
          ghlUserId!,
          ghlLocationId!
        )
        
        const dailyGoal = await getUserDailyGoal(
          userProfile.id,
          ghlUserId!,
          ghlLocationId!
        )
        
        // Calculate average activities per day
        const dailyAverage = dailyData.reduce((sum, day) => sum + day.value, 0) / 7
        
        // Calculate average activities per week
        const weeklyAverage = weeklyData.reduce((sum, week) => sum + week.value, 0) / 4
        
        // Calculate performance percentage (comparing to goal)
        const dailyPerformance = Math.round((dailyAverage / dailyGoal) * 100)
        const weeklyPerformance = Math.round((weeklyAverage / (dailyGoal * 7)) * 100)
        
        setPerformance({
          percentage: timeframe === 'days' 
            ? `${dailyPerformance > 100 ? '+' : ''}${dailyPerformance - 100}%` 
            : `${weeklyPerformance > 100 ? '+' : ''}${weeklyPerformance - 100}%`,
          average: timeframe === 'days' 
            ? Math.round(dailyAverage * 100) / 100
            : Math.round(weeklyAverage * 100) / 100
        })
      }
    } catch (error) {
      console.error('Error fetching activity data:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }
  
  // Update performance metrics when timeframe changes
  useEffect(() => {
    if (daysData.length > 0 && weeksData.length > 0) {
      // Recalculate performance metrics when timeframe changes
      const updatePerformance = async () => {
        try {
          const userProfile = await getUserByGhlIds(ghlUserId!, ghlLocationId!)
          
          if (userProfile) {
            const dailyGoal = await getUserDailyGoal(
              userProfile.id,
              ghlUserId!,
              ghlLocationId!
            )
            
            // Calculate average activities per day/week
            const dailyAverage = daysData.reduce((sum, day) => sum + day.value, 0) / 7
            const weeklyAverage = weeksData.reduce((sum, week) => sum + week.value, 0) / 4
            
            // Calculate performance percentage (comparing to goal)
            const dailyPerformance = Math.round((dailyAverage / dailyGoal) * 100)
            const weeklyPerformance = Math.round((weeklyAverage / (dailyGoal * 7)) * 100)
            
            setPerformance({
              percentage: timeframe === 'days' 
                ? `${dailyPerformance > 100 ? '+' : ''}${dailyPerformance - 100}%` 
                : `${weeklyPerformance > 100 ? '+' : ''}${weeklyPerformance - 100}%`,
              average: timeframe === 'days' 
                ? Math.round(dailyAverage * 100) / 100
                : Math.round(weeklyAverage * 100) / 100
            })
          }
        } catch (error) {
          console.error('Error updating performance metrics:', error)
        }
      }
      
      updatePerformance()
    }
  }, [timeframe, daysData, weeksData, ghlUserId, ghlLocationId])
  
  const maxValue = Math.max(
    ...(timeframe === 'days' 
      ? daysData.map(d => d.value) 
      : weeksData.map(w => w.value)),
    1 // Ensure we have at least a value of 1 to prevent division by zero
  )
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BarChart2 className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-semibold text-darkNavy">Activity Insights</h3>
        </div>
        
        <div className="flex items-center">
          {isRefreshing && (
            <RefreshCw className="h-4 w-4 text-gray-400 dark:text-gray-500 animate-spin mr-2" />
          )}
          <div className="dark:hidden">
            {/* Light mode version */}
            <div className="flex bg-gray-100 rounded-lg overflow-hidden">
              <button
                onClick={() => setTimeframe('days')}
                className={`text-xs px-4 py-1.5 transition-colors ${
                  timeframe === 'days'
                    ? 'bg-white text-primary font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Days
              </button>
              <button
                onClick={() => setTimeframe('weeks')}
                className={`text-xs px-4 py-1.5 transition-colors ${
                  timeframe === 'weeks'
                    ? 'bg-white text-primary font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Weeks
              </button>
            </div>
          </div>
          
          <div className="hidden dark:block">
            {/* Dark mode version - completely separate implementation */}
            <div className="flex bg-dark-bg-secondary rounded-lg overflow-hidden">
              <button
                onClick={() => setTimeframe('days')}
                className={`text-xs px-4 py-1.5 transition-colors ${
                  timeframe === 'days'
                    ? 'bg-dark-card text-dark-accent-purple font-medium'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Days
              </button>
              <button
                onClick={() => setTimeframe('weeks')}
                className={`text-xs px-4 py-1.5 transition-colors ${
                  timeframe === 'weeks'
                    ? 'bg-dark-card text-dark-accent-purple font-medium'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Weeks
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-[180px] mt-2 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
              <span>{maxValue}</span>
              <span>{Math.round(maxValue * 0.75)}</span>
              <span>{Math.round(maxValue * 0.5)}</span>
              <span>{Math.round(maxValue * 0.25)}</span>
              <span>0</span>
            </div>
            
            <div className="pl-8 h-full flex items-end">
              {timeframe === 'days' ? (
                <div className="flex-1 flex items-end justify-between h-full">
                  {daysData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center w-full">
                      <div className="w-full flex justify-center">
                        <div
                          className="w-10 bg-primary rounded-t-md"
                          style={{ 
                            height: `${(item.value / maxValue) * 150}px`,
                            opacity: 0.7 + (index * 0.05)
                          }}
                        ></div>
                      </div>
                      <span className="text-xs mt-2 text-gray-600">{item.day}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-end justify-between h-full">
                  {weeksData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center w-full">
                      <div className="w-full flex justify-center">
                        <div
                          className="w-16 bg-primary rounded-t-md"
                          style={{ 
                            height: `${(item.value / maxValue) * 150}px`,
                            opacity: 0.7 + (index * 0.07)
                          }}
                        ></div>
                      </div>
                      <span className="text-xs mt-2 text-gray-600">{item.week}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Performance</p>
          <p className="text-lg font-semibold flex items-center">
            {performance.percentage}
            <ArrowUpRight className={`ml-1 h-4 w-4 ${
              performance.percentage.startsWith('+') ? 'text-green-500' : 'text-red-500'
            }`} />
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">Average</p>
          <p className="text-lg font-semibold">
            {performance.average} {timeframe === 'days' ? 'per day' : 'per week'}
          </p>
        </div>
      </div>
    </div>
  )
}