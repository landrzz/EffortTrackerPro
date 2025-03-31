'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useGhl } from '@/context/GhlContext'
import { getUserByGhlIds, getUserActivities } from '@/lib/userUtils'

export default function ActivityCalendar() {
  const router = useRouter()
  const { ghlUserId, ghlLocationId, isGhlParamsLoaded } = useGhl()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [userProfile, setUserProfile] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  
  // Fetch user profile and activities
  useEffect(() => {
    async function fetchUserData() {
      if (!isGhlParamsLoaded || !ghlUserId || !ghlLocationId) {
        setIsLoading(false)
        return
      }
      
      try {
        setIsLoading(true)
        // First get the user profile
        const userData = await getUserByGhlIds(ghlUserId, ghlLocationId)
        
        if (!userData) {
          setError('User profile not found')
          setIsLoading(false)
          return
        }
        
        setUserProfile(userData)
        
        // Get all activities for the user - we'll filter by month in the UI
        // Using a higher limit to ensure we get enough activities for the month
        const activitiesData = await getUserActivities(
          userData.id, 
          ghlUserId, 
          ghlLocationId, 
          100 // Limit to 100 activities
        )
        
        setActivities(activitiesData)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('Failed to load user data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserData()
  }, [ghlUserId, ghlLocationId, isGhlParamsLoaded])
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }
  
  // Group activities by day
  const getActivitiesByDay = () => {
    const activityMap: Record<number, any[]> = {}
    
    activities.forEach(activity => {
      const activityDate = new Date(activity.activity_date)
      // Only include activities from the current month
      if (activityDate.getMonth() === currentMonth.getMonth() && 
          activityDate.getFullYear() === currentMonth.getFullYear()) {
        const day = activityDate.getDate()
        if (!activityMap[day]) {
          activityMap[day] = []
        }
        activityMap[day].push(activity)
      }
    })
    
    // For debugging - log the days with activities
    console.log('Days with activities:', Object.keys(activityMap))
    
    return activityMap
  }
  
  // Check if a day met the daily goal
  const isDailyGoalMet = (day: number, activitiesByDay: Record<number, any[]>) => {
    const dailyGoal = userProfile?.daily_goal || 1
    return activitiesByDay[day] && activitiesByDay[day].length >= dailyGoal
  }
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth)
    const days = []
    const activitiesByDay = getActivitiesByDay()
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10"></div>
      )
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().getDate() === day && 
                      new Date().getMonth() === currentMonth.getMonth() &&
                      new Date().getFullYear() === currentMonth.getFullYear()
      
      const hasActivity = activitiesByDay[day] && activitiesByDay[day].length > 0
      const goalMet = isDailyGoalMet(day, activitiesByDay)
      
      days.push(
        <div 
          key={`day-${day}`}
          className={`h-10 flex items-center justify-center relative ${
            isToday ? 'bg-primary bg-opacity-10 rounded-full' : ''
          }`}
        >
          <span className={`text-sm ${isToday ? 'font-bold text-primary' : 'text-gray-700'}`}>
            {day}
          </span>
          {hasActivity && (
            <div 
              className={`absolute bottom-1 w-1 h-1 ${goalMet ? 'bg-purple-600' : 'bg-green-500'} rounded-full`}
            ></div>
          )}
        </div>
      )
    }
    
    return days
  }
  
  if (isLoading) {
    return (
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-darkNavy">Activity Calendar</h3>
          <div className="animate-pulse h-5 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="h-6 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-500">{day}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array(35).fill(0).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-darkNavy">Activity Calendar</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-darkNavy">Activity Calendar</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={goToPreviousMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <span className="text-sm font-medium">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button 
            onClick={goToNextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="h-6 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-500">{day}</span>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircle className="text-green-500 h-5 w-5 mr-2" />
          <span className="text-sm">
            <span className="font-medium">{userProfile?.current_day_streak || 0}-day streak!</span> Keep it up.
          </span>
        </div>
        <button 
          className="flex items-center text-sm text-primary font-medium"
          onClick={() => router.push('/activity-log')}
        >
          <Calendar className="h-4 w-4 mr-1" />
          All Activities
        </button>
      </div>
    </div>
  )
}