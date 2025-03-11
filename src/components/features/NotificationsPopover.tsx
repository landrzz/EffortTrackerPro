'use client'

import React, { useRef, useEffect } from 'react'
import { X } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

interface NotificationsPopoverProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkAsRead: () => void
}

export default function NotificationsPopover({ 
  isOpen, 
  onClose, 
  notifications,
  onMarkAsRead
}: NotificationsPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose()
        onMarkAsRead()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, onMarkAsRead])

  // Close popover when ESC key is pressed
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        onMarkAsRead()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, onClose, onMarkAsRead])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="notifications-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          ref={popoverRef}
          className="absolute right-4 lg:right-6 top-14 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 id="notifications-title" className="text-lg font-medium text-gray-900">
              Notifications
            </h3>
            <button
              onClick={() => {
                onClose()
                onMarkAsRead()
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>No notifications</p>
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => {
                  onClose()
                  onMarkAsRead()
                }}
                className="w-full text-sm text-center text-primary hover:text-primary-dark"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
