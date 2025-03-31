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
            <h3 className="text-sm font-medium text-yellow-800">No User Found</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>No user profile was found with the provided GHL parameters.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-4">
        {user.profile_image_url ? (
          <img 
            src={user.profile_image_url} 
            alt={`${user.first_name} ${user.last_name}`} 
            className="h-16 w-16 rounded-full mr-4 object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mr-4">
            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
          </div>
        )}
        
        <div>
          <h2 className="text-xl font-bold text-darkNavy">{user.first_name} {user.last_name}</h2>
          <div className="text-gray-600">{user.email}</div>
          {user.phone && <div className="text-gray-600">{user.phone}</div>}
          <div className="mt-1">
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary bg-opacity-10 text-primary">
              {user.status_level}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Current Streak</div>
          <div className="text-xl font-bold text-primary">{user.current_day_streak} days</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Longest Streak</div>
          <div className="text-xl font-bold text-amber-600">{user.longest_day_streak} days</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Total Points</div>
          <div className="text-xl font-bold text-secondary">{user.total_points}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Daily Goal</div>
          <div className="text-xl font-bold text-green-600">{user.daily_goal} activities</div>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <div>Member since: {new Date(user.profile_creation_date).toLocaleDateString()}</div>
        {user.last_activity_date && (
          <div>Last activity: {new Date(user.last_activity_date).toLocaleDateString()}</div>
        )}
      </div>
    </div>
  )
}

// Wrap the component with Suspense to fix the Next.js warning
export default function UserProfileLoader(props: UserProfileLoaderProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <UserProfileLoaderContent {...props} />
    </Suspense>
  )
}
