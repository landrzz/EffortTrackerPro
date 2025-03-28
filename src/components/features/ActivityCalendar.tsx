'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ActivityCalendar() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  
  // Data representing days with activities
  const daysWithActivities = [3, 4, 5, 10, 11, 17, 18, 19, 20, 21, 25, 26]
  
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
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth)
    const days = []
    
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
      
      const hasActivity = daysWithActivities.includes(day)
      
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
            <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></div>
          )}
        </div>
      )
    }
    
    return days
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
            <span className="font-medium">5-day streak!</span> Keep it up.
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