'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { Menu, X } from 'lucide-react'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on a mobile device on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar')
      const toggleButton = document.getElementById('sidebar-toggle')
      
      if (
        isMobile && 
        isSidebarOpen && 
        sidebar && 
        toggleButton && 
        !sidebar.contains(event.target as Node) && 
        !toggleButton.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobile, isSidebarOpen])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-bgGray dark:bg-dark-bg transition-colors duration-200">
      <Header 
        toggleSidebar={toggleSidebar} 
        isMobile={isMobile} 
      />
      
      {/* Desktop Sidebar (always visible on large screens) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar (collapsible) */}
      <div 
        id="mobile-sidebar"
        className={`
          lg:hidden fixed inset-0 z-30 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="relative h-full w-[240px] bg-white dark:bg-dark-card shadow-lg dark:shadow-none dark:border-r dark:border-dark-border">
          <button 
            onClick={toggleSidebar}
            className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="pt-16">
            <Sidebar isMobile={true} />
          </div>
        </div>
        {/* Overlay for closing the sidebar */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-[-1]"
          onClick={toggleSidebar}
        ></div>
      </div>
      
      <main className={`${isMobile ? 'pt-16' : 'lg:pl-[250px] pt-16'} min-h-screen transition-all duration-300`}>
        <div className="max-w-[1200px] mx-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}