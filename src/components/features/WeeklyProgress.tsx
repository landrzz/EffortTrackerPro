'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

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
            className="text-gray-200"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-primary"
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
          <span className="text-base sm:text-lg md:text-xl font-bold">{value}</span>
        </div>
      </div>
      <span className="mt-2 text-xs md:text-sm text-gray-600">{label}</span>
    </div>
  )
}

export default function WeeklyProgress() {
  const [circleSize, setCircleSize] = useState(80);
  const [currentDay, setCurrentDay] = useState(1);
  
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
    };

    // Calculate initial day
    calculateCurrentDay();

    // Set up a timer to check for day changes
    const timer = setInterval(() => {
      calculateCurrentDay();
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(timer);
  }, []);
  
  const weeklyStats = [
    { label: 'Activities', percentage: 65, value: '13' },
    { label: 'Points', percentage: 75, value: '48' },
    { label: 'Streak', percentage: 90, value: '5' },
    { label: 'Goal', percentage: 40, value: '40%' }
  ]
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-darkNavy">Weekly Progress</h3>
        {/* <button className="text-primary text-xs md:text-sm font-medium flex items-center">
          View Details
          <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
        </button> */}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-2">
        {weeklyStats.map((stat, index) => (
          <ProgressCircle
            key={index}
            percentage={stat.percentage}
            size={circleSize}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>
      
      <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs md:text-sm">
          <span className="text-gray-500">Week Progress</span>
          <span className="font-medium">{currentDay} of 7 days</span>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div
              key={day}
              className={`h-1.5 md:h-2 rounded-full ${
                day <= currentDay ? 'bg-primary' : 'bg-gray-200'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}