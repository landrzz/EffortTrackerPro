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
    <div className="min-h-screen bg-bgGray">
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
        <div className="relative h-full w-[240px] bg-white shadow-lg">
          <button 
            onClick={toggleSidebar}
            className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="pt-16">
            <Sidebar isMobile={true} />
          </div>
        </div>
        {/* Overlay for closing the sidebar */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 z-[-1]"
          onClick={toggleSidebar}
        ></div>
      </div>
      
      <main className={`${isMobile ? 'pt-16' : 'lg:pl-[250px] pt-16'} min-h-screen transition-all duration-300`}>
        <div className="max-w-[1200px] mx-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
      
      <footer className={`${isMobile ? '' : 'lg:pl-[250px]'} py-4 text-center text-gray-500 text-sm border-t border-gray-200 transition-all duration-300`}>
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <p>&#169; 2025 PACE Activity Tracking Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
} 