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
      <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm dark:shadow-none dark:border dark:border-dark-border">
        <div className="flex items-center text-sm text-gray-500 dark:text-dark-text-secondary mb-4">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <span className="mx-2">/</span>}
              <button 
                onClick={() => router.push(crumb.path)}
                className="hover:text-primary dark:hover:text-dark-accent-purple transition-colors"
              >
                {crumb.label}
              </button>
            </React.Fragment>
          ))}
        </div>
        
        <h1 className="text-2xl font-bold text-darkNavy dark:text-dark-text-primary">{title}</h1>
      </div>
      
      <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm dark:shadow-none dark:border dark:border-dark-border">
        {children}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border p-4 pl-[250px] flex justify-end space-x-4 z-10">
        <button 
          onClick={() => router.back()}
          className="btn-secondary dark:bg-dark-bg dark:text-dark-text-primary dark:border-dark-border dark:hover:bg-dark-bg/80"
          type="button"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </button>
        <button 
          onClick={onSubmit}
          className="btn-primary dark:bg-primary/90 dark:hover:bg-primary"
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