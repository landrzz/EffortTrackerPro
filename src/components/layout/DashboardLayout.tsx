'use client'

import React from 'react'
import { PlusCircle, Bell, Filter, ArrowUpDown } from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button className="px-3 py-1.5 bg-gray-100 rounded-lg flex items-center text-sm">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              Filters
            </button>
            <button className="px-3 py-1.5 bg-gray-100 rounded-lg flex items-center text-sm">
              <ArrowUpDown className="h-4 w-4 mr-2 text-gray-500" />
              Sort
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center text-sm font-medium text-primary">
              <PlusCircle className="h-4 w-4 mr-1" />
              Quick Action
            </button>
            <div className="h-5 w-px bg-gray-200"></div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
      
      {children}
      
      <button className="fixed right-6 bottom-6 bg-primary text-white rounded-full p-3 shadow-lg hover:bg-opacity-90 transition-all lg:hidden">
        <PlusCircle className="h-6 w-6" />
      </button>
    </div>
  )
} 