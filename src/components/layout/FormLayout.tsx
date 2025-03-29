'use client'

import React from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FormLayoutProps {
  children: React.ReactNode
  title: string
  breadcrumbs: { label: string; path: string }[]
  onSubmit?: () => void
  isSubmitting?: boolean
}

export default function FormLayout({ 
  children, 
  title, 
  breadcrumbs, 
  onSubmit, 
  isSubmitting = false 
}: FormLayoutProps) {
  const router = useRouter()
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <span className="mx-2">/</span>}
              <button 
                onClick={() => router.push(crumb.path)}
                className="hover:text-primary transition-colors"
              >
                {crumb.label}
              </button>
            </React.Fragment>
          ))}
        </div>
        
        <h1 className="text-2xl font-bold text-darkNavy">{title}</h1>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm">
        {children}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pl-[200px] flex justify-end space-x-4 z-10">
        <button 
          onClick={() => router.back()}
          className="btn-secondary"
          type="button"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </button>
        <button 
          onClick={onSubmit}
          className="btn-primary"
          type="button"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}