'use client'

import React from 'react'
import { CheckCircle2, Trophy, TrendingUp } from 'lucide-react'

export default function DailyProgress() {
  const progress = {
    completedActivities: 2,
    totalActivities: 10,
    streak: 5
  }
  
  const progressPercentage = (progress.completedActivities / progress.totalActivities) * 100
  
  return (
    <div className="card h-full flex flex-col">
      <div className="flex justify-between items-start mb-4 md:mb-5">
        <h3 className="text-base md:text-lg font-semibold text-darkNavy">Daily Progress</h3>
        <span className="text-xs text-gray-500">Today</span>
      </div>
      
      <div className="space-y-4 md:space-y-5 flex-grow">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs md:text-sm text-gray-600">Activities Completed</span>
            <span className="text-xs md:text-sm font-medium">{progress.completedActivities}/{progress.totalActivities}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full"
              style={{ width: `${progressPercentage}%` }}
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
              <p className="text-base md:text-lg font-semibold">14 days</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-6 pt-2 md:pt-3 flex items-center text-xs md:text-sm text-green-600">
          <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
          <span>15% improvement from last week</span>
        </div>
      </div>
    </div>
  )
}