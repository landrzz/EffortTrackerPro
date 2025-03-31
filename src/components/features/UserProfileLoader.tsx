'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getUserByGhlIds, extractGhlParams, UserProfile } from '@/lib/userUtils'

interface UserProfileLoaderProps {
  onUserLoaded?: (user: UserProfile | null) => void
  children?: React.ReactNode
}

// Create a client component that safely uses useSearchParams
function UserProfileLoaderContent({ onUserLoaded, children }: UserProfileLoaderProps) {
  const searchParams = useSearchParams()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoading(true)
        setError(null)
        
        // Fix the type error by safely handling searchParams
        const params = searchParams ? 
          Object.fromEntries(searchParams.entries()) : 
          {}
        
        const { ghlUserId, ghlLocationId } = extractGhlParams(new URLSearchParams(params))
        
        // If both parameters are present, try to fetch the user
        if (ghlUserId && ghlLocationId) {
          const userData = await getUserByGhlIds(ghlUserId, ghlLocationId)
          setUser(userData)
          
          if (onUserLoaded) {
            onUserLoaded(userData)
          }
        } else {
          setError('Missing GHL parameters')
          if (onUserLoaded) {
            onUserLoaded(null)
          }
        }
      } catch (err) {
        console.error('Error loading user profile:', err)
        setError('Error loading user profile')
        if (onUserLoaded) {
          onUserLoaded(null)
        }
      } finally {
        setLoading(false)
      }
    }
    
    loadUserProfile()
  }, [searchParams, onUserLoaded])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading user profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Profile</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
              <p className="mt-1">Please make sure you have the correct GHL parameters in the URL.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">User Not Found</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>No user profile was found with the provided GHL parameters.</p>
              <p className="mt-1">Please make sure you have the correct GHL parameters in the URL.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If we have a user, render the children or a default profile view
  return children ? <>{children}</> : (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-col space-y-1.5">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">User Profile</h3>
        <p className="text-sm text-muted-foreground">User information from GHL integration</p>
      </div>
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium leading-none">Name</label>
            <p className="text-sm mt-1">{user.first_name} {user.last_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium leading-none">Email</label>
            <p className="text-sm mt-1">{user.email || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium leading-none">Phone</label>
            <p className="text-sm mt-1">{user.phone || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium leading-none">Status Level</label>
            <p className="text-sm mt-1">{user.status_level || 'Standard'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrap the component with Suspense to fix the Next.js warning
export function UserProfileLoader(props: UserProfileLoaderProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading user profile...</p>
        </div>
      </div>
    }>
      <UserProfileLoaderContent {...props} />
    </Suspense>
  )
}
