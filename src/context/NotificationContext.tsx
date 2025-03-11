'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAllAsRead: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'time'>) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Task Assigned',
      message: 'You have been assigned a new prospecting task',
      time: '1 hour ago',
      read: false
    },
    {
      id: '2',
      title: 'Streak Milestone',
      message: 'Congratulations! You reached a 14-day streak',
      time: '3 hours ago',
      read: false
    }
  ])

  const unreadCount = notifications.filter(notification => !notification.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })))
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'time'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: 'Just now',
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev])
  }

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAllAsRead,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
