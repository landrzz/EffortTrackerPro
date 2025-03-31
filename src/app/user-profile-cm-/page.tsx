'use client'

import React, { useState, useEffect, useRef } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import FormLayout from '@/components/layout/FormLayout'
import { User, Mail, Phone, Lock, Bell, CreditCard, Shield, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Flame, Award, Trophy } from 'lucide-react'
import Image from 'next/image'
import { useGhl } from '@/context/GhlContext'
import { getUserByGhlIds, updateUserProfile, createUserProfile, UserProfileUpdate } from '@/lib/userUtils'
import { UserProfile } from '@/lib/userUtils'

export default function UserProfilePage() {
  const { ghlUserId, ghlLocationId, isGhlParamsLoaded } = useGhl()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isNewUser, setIsNewUser] = useState(false)
  
  // Refs for form inputs
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const dailyGoalRef = useRef<HTMLInputElement>(null)
  
  // Form ref for submitting the form
  const formRef = useRef<HTMLFormElement>(null)
  
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    })
  }
  
  // Fetch user profile data
  useEffect(() => {
    async function fetchUserProfile() {
      if (!ghlUserId || !ghlLocationId) {
        setIsLoading(false)
        setError('Missing GHL parameters. Please ensure you have the correct URL.')
        return
      }
      
      try {
        setIsLoading(true)
        const userData = await getUserByGhlIds(ghlUserId, ghlLocationId)
        
        if (!userData) {
          // User doesn't exist, create a new profile
          const newUser = await createUserProfile(ghlUserId, ghlLocationId)
          
          if (newUser) {
            setUserProfile(newUser)
            setIsNewUser(true)
          } else {
            setError('Failed to create user profile. Please try again later.')
          }
        } else {
          setUserProfile(userData)
        }
      } catch (err) {
        console.error('Error fetching/creating user profile:', err)
        setError('Failed to load or create user profile. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (isGhlParamsLoaded) {
      fetchUserProfile()
    }
  }, [ghlUserId, ghlLocationId, isGhlParamsLoaded])
  
  // Handle form submission
  const handleSaveChanges = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    // Reset status
    setSaveSuccess(false)
    setSaveError(null)
    
    // Validate that we have a user to update
    if (!userProfile) {
      setSaveError('No user profile loaded to update')
      return
    }
    
    // Get values from refs
    const updatedProfile: UserProfileUpdate = {
      first_name: firstNameRef.current?.value || '',
      last_name: lastNameRef.current?.value || '',
      email: emailRef.current?.value || '',
      phone: phoneRef.current?.value || null
    }
    
    // Add daily goal if it's been changed
    const dailyGoalValue = dailyGoalRef.current?.value;
    if (dailyGoalValue) {
      const dailyGoal = parseInt(dailyGoalValue, 10);
      if (!isNaN(dailyGoal) && dailyGoal > 0) {
        updatedProfile.daily_goal = dailyGoal;
      } else if (dailyGoalValue.trim() !== '') {
        setSaveError('Daily goal must be a positive number');
        return;
      }
    }
    
    // Validate required fields
    if (!updatedProfile.first_name || !updatedProfile.last_name || !updatedProfile.email) {
      setSaveError('First name, last name, and email are required')
      return
    }
    
    try {
      setIsSaving(true)
      
      // Update the profile using either user ID or GHL parameters
      const updatedUser = await updateUserProfile(
        userProfile.id,
        ghlUserId,
        ghlLocationId,
        updatedProfile
      )
      
      if (updatedUser) {
        setUserProfile(updatedUser)
        setSaveSuccess(true)
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      } else {
        setSaveError('Failed to update profile. Please try again.')
      }
    } catch (err) {
      console.error('Error saving profile:', err)
      setSaveError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }
  
  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading user profile...</p>
          </div>
        </div>
      </MainLayout>
    )
  }
  
  // Error state
  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
            <div className="text-red-500 mb-4">
              <Shield className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Profile Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }
  
  return (
    <MainLayout>
      <FormLayout 
        title="User Profile" 
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Settings', path: '/settings' },
          { label: 'User Profile', path: '/user-profile-cm-' },
        ]}
        onSubmit={handleSaveChanges}
        isSubmitting={isSaving}
      >
        {isNewUser && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Welcome to Effort Tracker Pro!</h3>
                <div className="mt-1 text-sm text-blue-600">
                  <p>Your profile has been automatically created. Please take a moment to fill in your personal details below and click "Save Changes".</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success!</h3>
                <div className="mt-1 text-sm text-green-600">
                  <p>Your profile has been successfully updated.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {saveError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-1 text-sm text-red-600">
                  <p>{saveError}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <form ref={formRef} onSubmit={handleSaveChanges} className="space-y-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image 
                src={userProfile?.profile_image_url || "https://picsum.photos/id/237/200/200"} 
                alt="Profile Picture"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{userProfile?.first_name} {userProfile?.last_name}</h2>
              <p className="text-gray-600">Member since {userProfile ? formatDate(userProfile.profile_creation_date) : 'N/A'}</p>
              <div className="flex items-center justify-center md:justify-start mt-2 space-x-2">
                <div className="px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded-md font-medium">
                  {userProfile?.status_level || 'Member'}
                </div>
                <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md font-medium">
                  {userProfile?.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
            
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hidden">
              {/* Change Photo button hidden for now */}
              Change Photo
            </button>
          </div>
          
          <div className="border-b border-gray-200 pb-2">
            <div className="flex space-x-8 overflow-x-auto">
              <button type="button" className="text-primary border-b-2 border-primary pb-2 font-medium">
                Personal Info
              </button>
              {/* Security button hidden as requested */}
              <button type="button" className="text-gray-500 hover:text-gray-700 pb-2 hidden">
                Security
              </button>
              {/* Notifications button disabled as requested */}
              <button type="button" className="text-gray-400 pb-2 cursor-not-allowed" disabled>
                Notifications
              </button>
              {/* Payment Methods button hidden as requested */}
              <button type="button" className="text-gray-500 hover:text-gray-700 pb-2 hidden">
                Payment Methods
              </button>
              {/* Privacy button hidden as requested */}
              <button type="button" className="text-gray-500 hover:text-gray-700 pb-2 hidden">
                Privacy
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input 
                    type="text" 
                    defaultValue={userProfile?.first_name || ''} 
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                    ref={firstNameRef}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input 
                    type="text" 
                    defaultValue={userProfile?.last_name || ''} 
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                    ref={lastNameRef}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input 
                    type="email" 
                    defaultValue={userProfile?.email || ''} 
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                    ref={emailRef}
                    required
                  />
                </div>
                {/* <p className="text-xs text-gray-500 mt-1">This email is used for notifications and account recovery</p> */}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input 
                    type="tel" 
                    defaultValue={userProfile?.phone || ''} 
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                    ref={phoneRef}
                  />
                </div>
              </div>
            </div>
            
            <div>
              {/* <h3 className="text-lg font-medium mb-4">Security Settings</h3> */}
              
              <div className="space-y-4 hidden">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hidden">
                  {/* Change Password section hidden for now */}
                  <div className="flex items-start">
                    <Lock className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-gray-600">Update your password to maintain account security</p>
                    </div>
                  </div>
                  <button type="button" className="btn-secondary text-sm">Update</button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button type="button" className="btn-primary text-sm">Enable</button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start">
                    <Bell className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Notification Preferences</h4>
                      <p className="text-sm text-gray-600">Manage how you receive updates and alerts</p>
                    </div>
                  </div>
                  <button type="button" className="btn-secondary text-sm">Manage</button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hidden">
                  {/* Payment Methods section hidden for now */}
                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Payment Methods</h4>
                      <p className="text-sm text-gray-600">Update your billing information and view payment history</p>
                    </div>
                  </div>
                  <button type="button" className="btn-secondary text-sm">Manage</button>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Activity Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-1">
                    <Flame className="h-5 w-5 text-orange-500 mr-2" />
                    <p className="text-sm text-gray-500">Current Streak</p>
                  </div>
                  <p className="text-2xl font-bold">{userProfile?.current_day_streak || 0} days</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-1">
                    <Award className="h-5 w-5 text-amber-500 mr-2" />
                    <p className="text-sm text-gray-500">Longest Streak</p>
                  </div>
                  <p className="text-2xl font-bold">{userProfile?.longest_day_streak || 0} days</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-1">
                    <Trophy className="h-5 w-5 text-primary mr-2" />
                    <p className="text-sm text-gray-500">Total Points</p>
                  </div>
                  <p className="text-2xl font-bold">{userProfile?.total_points || 0}</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-3">
                  <h4 className="font-medium">Daily Activity Goal</h4>
                </div>
                <div className="flex items-center">
                  <div className="relative w-full max-w-xs">
                    <input 
                      type="number" 
                      min="1"
                      max="50"
                      defaultValue={userProfile?.daily_goal || 10} 
                      className="px-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                      ref={dailyGoalRef}
                    />
                  </div>
                  <p className="ml-3 text-sm text-gray-600">activities per day</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">This is your target number of activities to complete each day. It will be used in the Daily Progress dashboard.</p>
              </div>
            </div>
          </div>
        </form>
      </FormLayout>
    </MainLayout>
  )
}