'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getUserByGhlIds, extractGhlParams, UserProfile } from '@/lib/userUtils'

interface UserProfileLoaderProps {
  onUserLoaded?: (user: UserProfile | null) => void
  children?: React.ReactNode
}

export default function UserProfileLoader({ onUserLoaded, children }: UserProfileLoaderProps) {
  const searchParams = useSearchParams()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoading(true)
        setError(null)
        
        const { ghlUserId, ghlLocationId } = extractGhlParams(searchParams)
        
        // If both parameters are present, try to fetch the user
        if (ghlUserId && ghlLocationId) {
          const userData = await getUserByGhlIds(ghlUserId, ghlLocationId)
          setUser(userData)
          
          if (onUserLoaded) {
            onUserLoaded(userData)
          }
          
          if (!userData) {
            setError('User not found with the provided GHL IDs')
          }
        } else {
          // If parameters are missing, set error
          setError('Missing required GHL parameters')
        }
      } catch (err) {
        console.error('Error loading user profile:', err)
        setError('Failed to load user profile')
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [searchParams, onUserLoaded])

  if (children) {
    return <>{children}</>
  }

  if (loading) {
    return <div className="p-4 text-center">Loading user profile...</div>
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>
  }

  if (!user) {
    return <div className="p-4 text-center">No user found with the provided parameters</div>
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
