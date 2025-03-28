'use client'

import React from 'react'
import { PlusCircle, Filter, ArrowUpDown } from 'lucide-react'
import { useModal } from '@/context/ModalContext'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Get the openRecordActivityModal function from the ModalContext
  const { openRecordActivityModal } = useModal()
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* <button className="px-2 md:px-3 py-1.5 bg-gray-100 rounded-lg flex items-center text-xs md:text-sm">
              <Filter className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-gray-500" />
              Filters
            </button>
            <button className="px-2 md:px-3 py-1.5 bg-gray-100 rounded-lg flex items-center text-xs md:text-sm">
              <ArrowUpDown className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-gray-500" />
              Sort
            </button> */}
          </div>
          
          <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-3">
            <button 
              className="flex items-center text-xs md:text-sm font-medium text-primary"
              onClick={openRecordActivityModal}
            >
              <PlusCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Quick Action
            </button>
            <div className="hidden sm:block h-5 w-px bg-gray-200"></div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
      
      {children}
      
      <button 
        className="fixed right-4 bottom-4 md:right-6 md:bottom-6 bg-primary text-white rounded-full p-3 shadow-lg hover:bg-opacity-90 transition-all lg:hidden"
        onClick={openRecordActivityModal}
      >
        <PlusCircle className="h-6 w-6" />
      </button>
    </div>
  )
} 