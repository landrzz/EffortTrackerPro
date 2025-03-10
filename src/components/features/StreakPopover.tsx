'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Flame, Award, Calendar, CheckCircle, X, TrendingUp, Target } from 'lucide-react'
import { useModal } from '@/context/ModalContext'

interface StreakPopoverProps {
  isOpen: boolean
  onClose: () => void
  currentStreak: number
  personalBest: number
}

export default function StreakPopover({ isOpen, onClose, currentStreak, personalBest }: StreakPopoverProps) {
  const { openRecordActivityModal } = useModal()
  const popoverRef = useRef<HTMLDivElement>(null)
  
  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  // Mock data
  const recentActivities = [
    { date: 'Today', completed: true, count: 3 },
    { date: 'Yesterday', completed: true, count: 2 },
    { date: '2 days ago', completed: true, count: 4 },
    { date: '3 days ago', completed: true, count: 1 },
    { date: '4 days ago', completed: true, count: 2 },
  ]
  
  const dailyGoal = 1 // At least one prospecting activity per day
  
  const handleRecordClick = () => {
    onClose() // Close the popover
    openRecordActivityModal() // Open the record activity modal
  }
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          ref={popoverRef}
          className="relative bg-white rounded-xl shadow-lg w-full max-w-md"
        >
          <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10">
            <h3 className="text-lg font-bold text-darkNavy flex items-center">
              <Flame className="h-5 w-5 text-orange-500 mr-2" />
              Prospecting Streak
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4 sm:p-5 overflow-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="text-center w-full sm:w-auto px-4 py-3 bg-primary bg-opacity-10 rounded-lg">
                <div className="text-3xl font-bold text-primary">{currentStreak}</div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </div>
              
              <div className="text-center w-full sm:w-auto px-4 py-3 bg-amber-50 rounded-lg">
                <div className="text-3xl font-bold text-amber-600">{personalBest}</div>
                <div className="text-sm text-gray-600">Personal Best</div>
              </div>
              
              <div className="text-center w-full sm:w-auto px-4 py-3 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{dailyGoal}</div>
                <div className="text-sm text-gray-600">Daily Goal</div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                Recent Activity
              </h4>
              
              <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{activity.date}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium">{activity.count}</span>
                      <span className="text-gray-500 ml-1">activities</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-700">
                  <Target className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                  <span>Daily Goal</span>
                </div>
                <span className="font-medium">At least {dailyGoal} prospecting activities</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-700">
                  <TrendingUp className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                  <span>Weekly Average</span>
                </div>
                <span className="font-medium">2.4 activities / day</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-700">
                  <Award className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                  <span>Streak Start Date</span>
                </div>
                <span className="font-medium">October 5, 2023</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500 mb-2">
                Keep your streak going by recording at least one prospecting activity per day.
              </div>
              <button 
                onClick={handleRecordClick}
                className="btn-primary w-full"
              >
                Record Today's Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 