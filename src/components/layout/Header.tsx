'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { PlusCircle, Bell, User, Search, Flame, Award, Calendar, Menu } from 'lucide-react'
import { useModal } from '@/context/ModalContext'
import { useNotification } from '@/context/NotificationContext'
import StreakPopover from '@/components/features/StreakPopover'
import NotificationsPopover from '@/components/features/NotificationsPopover'

interface HeaderProps {
  toggleSidebar?: () => void
  isMobile?: boolean
}

export default function Header({ toggleSidebar, isMobile = false }: HeaderProps) {
  const { openRecordActivityModal } = useModal()
  const { notifications, unreadCount, markAllAsRead } = useNotification()
  const [isStreakPopoverOpen, setIsStreakPopoverOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  
  // Mock data for streak count
  const currentStreak = 14
  const personalBest = 27

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-10 pl-0 lg:pl-[200px]">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center">
            {/* Mobile menu button */}
            {isMobile && (
              <button 
                id="sidebar-toggle"
                onClick={toggleSidebar}
                className="mr-3 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
            )}
            
            <Link href="/" className="text-xl font-bold text-white px-3 py-1.5 rounded-md bg-primary shadow-sm">
              {isMobile ? 'Tracker' : 'Activity Dashboard'}
            </Link>
            
            <div className="relative ml-4 lg:ml-6 hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-32 lg:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-5">
            {/* Streak Counter - only show on tablet and up */}
            <div 
              className="hidden sm:flex items-center bg-primary bg-opacity-10 px-2 py-1.5 lg:px-3 lg:py-2 rounded-lg cursor-pointer hover:bg-opacity-20 transition-all h-[42px] lg:h-[46px]"
              title="Your prospecting streak - days in a row you've completed prospecting activities"
              onClick={() => setIsStreakPopoverOpen(true)}
            >
              <div className="flex items-center">
                <Flame className="h-4 w-4 lg:h-5 lg:w-5 text-orange-500 mr-1 lg:mr-1.5" />
                <div>
                  <div className="flex items-center">
                    <span className="text-sm lg:text-base font-bold text-primary">{currentStreak}</span>
                    <span className="text-xs text-gray-500 ml-1 hidden md:inline">day streak</span>
                  </div>
                  <div className="hidden md:flex items-center text-xs text-gray-500">
                    <Award className="h-3 w-3 mr-1 text-amber-500" />
                    <span>Best: {personalBest}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Record Activity Button - condensed on mobile */}
            <button 
              onClick={openRecordActivityModal} 
              className="btn-primary flex items-center px-2 py-1.5 lg:px-4 lg:py-2 rounded-lg h-[42px] lg:h-[46px]"
              aria-label="Record Activity"
            >
              <PlusCircle className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="ml-1 lg:ml-2 text-sm hidden sm:inline-block">Record Activity</span>
            </button>
            
            {/* Points - hide on smallest screens */}
            <div className="hidden xs:flex items-center space-x-1 px-2 py-1.5 lg:px-3 lg:py-2 bg-secondary bg-opacity-20 rounded-lg h-[42px] lg:h-[46px]">
              <span className="text-secondary font-semibold text-sm">20</span>
              <span className="text-xs text-gray-500 hidden sm:inline">Points</span>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Notifications */}
              <button 
                className="relative p-1"
                onClick={() => setIsNotificationsOpen(true)}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* User Profile */}
              <Link href="/user-profile-cm-" className="flex items-center justify-center h-8 w-8 lg:h-9 lg:w-9 bg-primary text-white rounded-full font-medium">
                CM
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Streak Popover */}
      <StreakPopover 
        isOpen={isStreakPopoverOpen} 
        onClose={() => setIsStreakPopoverOpen(false)}
        currentStreak={currentStreak}
        personalBest={personalBest}
      />

      {/* Notifications Popover */}
      <NotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={markAllAsRead}
      />
    </>
  )
} 