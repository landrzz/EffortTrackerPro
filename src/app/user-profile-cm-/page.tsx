'use client'

import React, { useState, useEffect, useRef } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import FormLayout from '@/components/layout/FormLayout'
import { User, Mail, Phone, Lock, Bell, CreditCard, Shield, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Flame, Award, Trophy, X } from 'lucide-react'
import Image from 'next/image'
import { useGhl } from '@/context/GhlContext'
import { getUserByGhlIds, updateUserProfile, createUserProfile, UserProfileUpdate } from '@/lib/userUtils'
import { UserProfile } from '@/lib/userUtils'

export default function UserProfilePage() {
  const { ghlUserId, ghlLocationId, ghlUserName, ghlUserEmail, ghlUserPhone, isGhlParamsLoaded } = useGhl()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isNewUser, setIsNewUser] = useState(false)
  const [showProfileUrlModal, setShowProfileUrlModal] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState<string>('')
  
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
          // User doesn't exist, create a new profile with data from URL parameters
          let firstName = '';
          let lastName = '';
          
          // Parse name if available (assuming format is "First Last")
          if (ghlUserName) {
            const nameParts = ghlUserName.split(' ');
            if (nameParts.length >= 2) {
              firstName = nameParts[0];
              // Join the rest as last name in case there are multiple last names
              lastName = nameParts.slice(1).join(' ');
            } else {
              firstName = ghlUserName;
            }
          }
          
          const initialData = {
            first_name: firstName,
            last_name: lastName,
            email: ghlUserEmail || '',
            phone: ghlUserPhone || ''
          };
          
          const newUser = await createUserProfile(ghlUserId, ghlLocationId, initialData)
          
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
  }, [ghlUserId, ghlLocationId, ghlUserName, ghlUserEmail, ghlUserPhone, isGhlParamsLoaded])
  
  // Effect to initialize profile image URL from user profile
  useEffect(() => {
    if (userProfile?.profile_image_url) {
      setProfileImageUrl(userProfile.profile_image_url);
    }
  }, [userProfile]);

  // Handle profile image URL update
  const handleProfileImageUpdate = async () => {
    if (!userProfile) return;
    
    // Reset status
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      setIsSaving(true);
      
      const updatedProfile: UserProfileUpdate = {
        profile_image_url: profileImageUrl
      };
      
      const updatedUser = await updateUserProfile(
        userProfile.id,
        ghlUserId,
        ghlLocationId,
        updatedProfile
      );
      
      if (updatedUser) {
        setUserProfile(updatedUser);
        setSaveSuccess(true);
        setShowProfileUrlModal(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setSaveError('Failed to update profile image. Please try again.');
      }
    } catch (err) {
      console.error('Error saving profile image:', err);
      setSaveError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
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
            <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-dark-accent-purple mx-auto mb-4" />
            <p className="text-body dark:text-dark-text-secondary">Loading user profile...</p>
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
          <div className="text-center max-w-md p-6 card">
            <div className="text-red-500 dark:text-red-400 mb-4">
              <Shield className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-title dark:text-dark-text-primary mb-2">Profile Error</h2>
            <p className="text-body dark:text-dark-text-secondary mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary dark:bg-primary/90 text-white rounded-lg text-sm font-medium hover:bg-opacity-90 dark:hover:bg-opacity-100 transition-all"
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
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Welcome to Effort Tracker Pro!</h3>
                <div className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                  <p>Your profile has been automatically created. Please take a moment to fill in your personal details below and click "Save Changes".</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Success!</h3>
                <div className="mt-1 text-sm text-green-600 dark:text-green-400">
                  <p>Your profile has been successfully updated.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {saveError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
                <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                  <p>{saveError}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <form ref={formRef} onSubmit={handleSaveChanges} className="space-y-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div 
              onClick={() => setShowProfileUrlModal(true)}
              className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white dark:border-dark-card-hover shadow-lg cursor-pointer group"
              title="Click to update profile picture"
            >
              {userProfile?.profile_image_url ? (
                <Image 
                  src={userProfile.profile_image_url} 
                  alt="Profile Picture"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-dark-bg-secondary">
                  <User className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100">
                  Change
                </span>
              </div>
            </div>
            
            {/* Profile URL Modal */}
            {showProfileUrlModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-dark-card rounded-lg p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-title dark:text-dark-text-primary">Update Profile Picture</h3>
                    <button 
                      onClick={() => setShowProfileUrlModal(false)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="profileImageUrl" className="block text-sm font-medium text-body dark:text-dark-text-secondary mb-1">
                      Image URL
                    </label>
                    <input 
                      type="text" 
                      id="profileImageUrl"
                      value={profileImageUrl}
                      onChange={(e) => setProfileImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg rounded-md shadow-sm focus:outline-none focus:ring-primary dark:focus:ring-dark-accent-purple focus:border-primary dark:focus:border-dark-accent-purple dark:text-dark-text-primary"
                    />
                    <p className="mt-1 text-xs text-subtitle dark:text-gray-400">
                      Enter a valid image URL (JPG, PNG, or GIF)
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowProfileUrlModal(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-dark-border rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg/50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleProfileImageUpdate}
                      className="px-4 py-2 bg-primary dark:bg-primary/90 text-white rounded-md text-sm font-medium hover:bg-opacity-90 dark:hover:bg-opacity-100 disabled:opacity-70 transition-all"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </div>
                      ) : 'Update Picture'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-title dark:text-dark-text-primary mb-1">
                {userProfile?.first_name} {userProfile?.last_name}
              </h2>
              <p className="text-subtitle text-sm mb-2">
                Member since {userProfile?.created_at ? formatDate(userProfile.created_at) : 'Today'}
              </p>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center px-3 py-1.5 bg-primary/10 dark:bg-primary/20 rounded-full">
                  <Flame className="h-4 w-4 text-orange-500 mr-1.5" />
                  <span className="text-sm font-medium text-primary dark:text-dark-accent-purple">{userProfile?.current_day_streak || 0} day streak</span>
                </div>
                
                <div className="flex items-center px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <Trophy className="h-4 w-4 text-amber-500 mr-1.5" />
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Best: {userProfile?.longest_day_streak || 0} days</span>
                </div>
                
                <div className="flex items-center px-3 py-1.5 bg-secondary/10 dark:bg-secondary/20 rounded-full">
                  <Award className="h-4 w-4 text-secondary mr-1.5" />
                  <span className="text-sm font-medium text-secondary dark:text-secondary/90">{userProfile?.total_points || 0} points</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-body dark:text-dark-text-secondary mb-1">
                First Name <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                <input
                  type="text"
                  id="firstName"
                  ref={firstNameRef}
                  defaultValue={userProfile?.first_name || ''}
                  required
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-accent-purple focus:border-primary dark:focus:border-dark-accent-purple dark:text-dark-text-primary"
                  placeholder="Your first name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-body dark:text-dark-text-secondary mb-1">
                Last Name <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                <input
                  type="text"
                  id="lastName"
                  ref={lastNameRef}
                  defaultValue={userProfile?.last_name || ''}
                  required
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-accent-purple focus:border-primary dark:focus:border-dark-accent-purple dark:text-dark-text-primary"
                  placeholder="Your last name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-body dark:text-dark-text-secondary mb-1">
                Email Address <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                <input
                  type="email"
                  id="email"
                  ref={emailRef}
                  defaultValue={userProfile?.email || ''}
                  required
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-accent-purple focus:border-primary dark:focus:border-dark-accent-purple dark:text-dark-text-primary"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-body dark:text-dark-text-secondary mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                <input
                  type="tel"
                  id="phone"
                  ref={phoneRef}
                  defaultValue={userProfile?.phone || ''}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-accent-purple focus:border-primary dark:focus:border-dark-accent-purple dark:text-dark-text-primary"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-title dark:text-dark-text-primary mb-4">Activity Goals</h3>
            
            <div className="bg-gray-50 dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="dailyGoal" className="block text-sm font-medium text-body dark:text-dark-text-primary mb-1">
                    Daily Activity Goal
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="dailyGoal"
                      ref={dailyGoalRef}
                      defaultValue={userProfile?.daily_goal || 5}
                      min="1"
                      className="px-4 py-2 w-full border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-accent-purple focus:border-primary dark:focus:border-dark-accent-purple dark:text-dark-text-primary"
                      placeholder="5"
                    />
                  </div>
                  <p className="mt-1 text-xs text-subtitle dark:text-dark-text-secondary">
                    Number of activities you aim to complete each day
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-title dark:text-dark-text-primary mb-4">Account Information</h3>
            
            <div className="bg-gray-50 dark:bg-dark-card rounded-lg p-4 space-y-4 border border-gray-200 dark:border-dark-border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-body dark:text-dark-text-primary">GHL User ID</h4>
                  <p className="text-sm text-subtitle dark:text-dark-text-secondary mt-1">{ghlUserId || 'Not available'}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-body dark:text-dark-text-primary">GHL Location ID</h4>
                  <p className="text-sm text-subtitle dark:text-dark-text-secondary mt-1">{ghlLocationId || 'Not available'}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-body dark:text-dark-text-primary">Status Level</h4>
                  <p className="text-sm text-subtitle dark:text-dark-text-secondary mt-1">{userProfile?.status_level || 'Beginner'}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-body dark:text-dark-text-primary">Total Points</h4>
                  <p className="text-sm text-subtitle dark:text-dark-text-secondary mt-1">{userProfile?.total_points || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormLayout>
    </MainLayout>
  )
}