'use client'

import React, { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Award, Gift, TrendingUp, Clock, ArrowRight, Calendar, Info, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useGhl } from '@/context/GhlContext'
import { 
  getUserByGhlIds, 
  UserProfile, 
  STATUS_LEVELS, 
  StatusLevel, 
  getStatusLevelForPoints,
  getUserActivities,
  Activity,
  calculateMonthlyPoints
} from '@/lib/userUtils'
import { format } from 'date-fns'

export default function PointsPage() {
  const { ghlUserId, ghlLocationId, isGhlParamsLoaded } = useGhl()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showStatusInfo, setShowStatusInfo] = useState(false)

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
          setError('User profile not found. Please check your credentials.')
        } else {
          setUserProfile(userData)
          
          // Fetch user activities after profile is loaded
          setIsActivitiesLoading(true)
          const activitiesData = await getUserActivities(userData.id, ghlUserId, ghlLocationId, 20)
          setActivities(activitiesData)
          setIsActivitiesLoading(false)
        }
      } catch (err) {
        console.error('Error fetching user profile:', err)
        setError('Failed to load user profile. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (isGhlParamsLoaded) {
      fetchUserProfile()
    }
  }, [ghlUserId, ghlLocationId, isGhlParamsLoaded])

  const rewardOptions = [
    {
      id: 1,
      title: '$25 Amazon Gift Card',
      points: 500,
      image: 'https://picsum.photos/id/0/100/100',
      popular: true
    },
    {
      id: 2,
      title: '$10 Starbucks Gift Card',
      points: 200,
      image: 'https://picsum.photos/id/1/100/100',
      popular: false
    },
    {
      id: 3,
      title: '$50 Home Depot Gift Card',
      points: 750,
      image: 'https://picsum.photos/id/2/100/100',
      popular: false
    },
    {
      id: 4,
      title: 'Statement Credit $15',
      points: 300,
      image: 'https://picsum.photos/id/3/100/100',
      popular: true
    }
  ]
  
  // Get total points from user profile
  const totalPoints = userProfile?.total_points || 0
  
  // Calculate monthly points
  const monthlyPoints = calculateMonthlyPoints(activities)
  
  // Format activity date
  const formatActivityDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy')
    } catch (error) {
      return dateString
    }
  }
  
  // Format activity type for display
  const formatActivityType = (type: string) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  // Get activity description
  const getActivityDescription = (activity: Activity) => {
    const activityType = formatActivityType(activity.activity_type)
    return `${activityType} with ${activity.client_name}`
  }
  
  // Determine current status level and next status level
  const getCurrentAndNextStatus = (points: number): { currentStatus: StatusLevel, nextStatus: StatusLevel | null } => {
    let currentStatus = getStatusLevelForPoints(points)
    let nextStatus: StatusLevel | null = null
    
    // Find the next status level
    for (let i = 0; i < STATUS_LEVELS.length - 1; i++) {
      if (currentStatus.name === STATUS_LEVELS[i].name) {
        nextStatus = STATUS_LEVELS[i + 1]
        break
      }
    }
    
    return { currentStatus, nextStatus }
  }
  
  const { currentStatus, nextStatus } = getCurrentAndNextStatus(totalPoints)
  
  // Calculate milestone progress percentage
  const progressPercentage = nextStatus 
    ? Math.min(Math.round(((totalPoints - currentStatus.minPoints) / (nextStatus.minPoints - currentStatus.minPoints)) * 100), 100) 
    : 100
  
  const pointsToNextLevel = nextStatus 
    ? nextStatus.minPoints - totalPoints
    : 0
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Award className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading reward points...</p>
          </div>
        </div>
      </MainLayout>
    )
  }
  
  // If error, show error state
  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
            <div className="text-red-500 mb-4">
              <Award className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Points Error</h2>
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-darkNavy">Reward Points</h1>
        <p className="text-gray-600 mt-1">Earn points for completing activities!</p>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Points Summary */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-primary p-6 text-white text-center">
              <Award className="h-12 w-12 mx-auto mb-2" />
              <h2 className="text-2xl font-bold">{totalPoints} Points</h2>
              <p className="text-sm opacity-80">Your lifetime points</p>
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-primary">
                {userProfile?.status_level || currentStatus.name} Status
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">Status Progress</span>
                      <button 
                        onClick={() => setShowStatusInfo(!showStatusInfo)}
                        className="text-gray-400 hover:text-primary"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {nextStatus ? (
                      <span className="font-medium">{totalPoints}/{nextStatus.minPoints} points</span>
                    ) : (
                      <span className="font-medium">Max Level Reached!</span>
                    )}
                  </div>
                  
                  {showStatusInfo && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-2 text-xs">
                      <h4 className="font-medium mb-1">Status Levels:</h4>
                      <ul className="space-y-1">
                        {STATUS_LEVELS.map((level, index) => (
                          <li key={index} className="flex justify-between">
                            <span>{level.name}</span>
                            <span>{level.minPoints}+ points</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  
                  {nextStatus ? (
                    <p className="text-xs text-gray-500 mt-1">
                      Earn {pointsToNextLevel} more points to reach {nextStatus.name} status
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Congratulations! You've reached the highest status level.
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 pb-4 border-b border-gray-100">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm font-medium">{monthlyPoints}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Points this month</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Ways to Earn Points</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Make a client call</span>
                      <span className="font-medium text-primary">+10 pts</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Send email or message</span>
                      <span className="font-medium text-primary">+5 pts</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Attend a meeting</span>
                      <span className="font-medium text-primary">+15 pts</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Client visit</span>
                      <span className="font-medium text-primary">+20 pts</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Submit a proposal</span>
                      <span className="font-medium text-primary">+50 pts</span>
                    </li>
                  </ul>
                </div>
                
                <button className="btn-primary w-full">View All Earning Options</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rewards and History */}
        <div className="col-span-12 lg:col-span-8">
          {/* Available Rewards section hidden as requested */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <Gift className="h-5 w-5 text-primary mr-2" />
                Available Rewards
              </h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {rewardOptions.map(reward => (
                  <div 
                    key={reward.id} 
                    className={`border ${reward.popular ? 'border-primary' : 'border-gray-200'} rounded-lg p-4 relative`}
                  >
                    {reward.popular && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                        Popular
                      </div>
                    )}
                    
                    <div className="flex items-center mb-3">
                      <div className="relative h-12 w-12 mr-3">
                        <Image 
                          src={reward.image}
                          alt={reward.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{reward.title}</h3>
                        <p className="text-sm text-primary font-bold">{reward.points} points</p>
                      </div>
                    </div>
                    
                    <button 
                      className={`w-full py-1.5 rounded-lg text-sm font-medium ${
                        reward.points <= totalPoints 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={reward.points > totalPoints}
                    >
                      {reward.points <= totalPoints ? 'Redeem Now' : 'Not Enough Points'}
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-primary font-medium text-sm flex items-center mx-auto">
                  View All Rewards
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                Activity & Points History
              </h2>
            </div>
            
            {isActivitiesLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <p className="text-gray-500">Loading activities...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No activities found.</p>
                <p className="text-sm text-gray-400 mt-1">Complete activities to earn points!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {activities.map(activity => (
                  <div key={activity.id} className="flex justify-between items-center p-4">
                    <div>
                      <p className="font-medium">{getActivityDescription(activity)}</p>
                      <p className="text-xs text-gray-500">{formatActivityDate(activity.activity_date)}</p>
                    </div>
                    <span className="text-green-600 font-bold">+{activity.points} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}