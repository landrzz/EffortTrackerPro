'use client'

import React, { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Award, Gift, TrendingUp, Clock, ArrowRight, Calendar, Info, Loader2, X, Phone, Mail, MessageSquare, Users, UserCheck, FileText, Search, UserPlus, Share2 } from 'lucide-react'
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

// Define earning options with detailed information
const EARNING_OPTIONS = [
  {
    id: 1,
    type: 'call',
    title: 'Phone Call',
    points: 2,
    description: 'Make a phone call to a client to discuss their needs, follow up on previous conversations, or provide updates. Points awarded once per contact per day.',
    icon: Phone,
    examples: ['Follow-up call with client', 'Initial consultation call', 'Status update call']
  },
  {
    id: 2,
    type: 'email',
    title: 'Email',
    points: 1,
    description: 'Send an email to a client with information, updates, or responses to their inquiries. Points awarded once per contact per day.',
    icon: Mail,
    examples: ['Follow-up email after meeting', 'Information email with resources', 'Response to client inquiry']
  },
  {
    id: 3,
    type: 'message',
    title: 'Text/Message',
    points: 1,
    description: 'Send a direct message to a client through a messaging platform or SMS. Points awarded once per contact per day.',
    icon: MessageSquare,
    examples: ['Quick status update', 'Appointment reminder', 'Document request']
  },
  {
    id: 4,
    type: 'meeting_referral',
    title: 'Meeting w/ Referral Partner',
    points: 12,
    description: 'Participate in a meeting with an existing referral partner, either in person or virtually.',
    icon: Users,
    examples: ['Regular check-in meeting', 'Relationship building', 'Discussing referral opportunities']
  },
  {
    id: 5,
    type: 'meeting_new_referral',
    title: 'Meeting w/ New Referral Partner',
    points: 20,
    description: 'Participate in a meeting with a new referral partner, either in person or virtually.',
    icon: UserPlus,
    examples: ['First introduction meeting', 'New partnership discussion', 'Initial relationship building']
  },
  {
    id: 6,
    type: 'social_post',
    title: 'Social Post',
    points: 5,
    description: 'Create and publish content on social media platforms to promote your services or share valuable information.',
    icon: Share2,
    examples: ['LinkedIn article', 'Facebook business post', 'Industry insights on Twitter']
  }
]

export default function PointsPage() {
  const { ghlUserId, ghlLocationId, isGhlParamsLoaded } = useGhl()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showStatusInfo, setShowStatusInfo] = useState(false)
  const [showEarningOptionsModal, setShowEarningOptionsModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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
  
  // Filter activities based on search query
  const filteredActivities = activities.filter(activity => {
    if (!searchQuery.trim()) return true
    
    const description = getActivityDescription(activity).toLowerCase()
    const date = formatActivityDate(activity.activity_date).toLowerCase()
    const query = searchQuery.toLowerCase()
    
    return description.includes(query) || date.includes(query)
  })
  
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
            <Award className="h-12 w-12 animate-spin text-primary dark:text-dark-accent-purple mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading reward points...</p>
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
          <div className="text-center max-w-md p-6 bg-white dark:bg-dark-card rounded-lg shadow-sm dark:border dark:border-dark-border">
            <div className="text-red-500 dark:text-red-400 mb-4">
              <Award className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Points Error</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-darkNavy dark:text-white">Reward Points</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Earn points for completing activities!</p>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Points Summary */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm dark:shadow-none dark:border dark:border-dark-border overflow-hidden">
            <div className="bg-primary dark:bg-primary/90 p-6 text-white text-center">
              <Award className="h-12 w-12 mx-auto mb-2" />
              <h2 className="text-2xl font-bold">{totalPoints} Points</h2>
              <p className="text-sm opacity-80">Your lifetime points</p>
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white dark:bg-white/90 dark:text-primary">
                {userProfile?.status_level || currentStatus.name} Status
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-gray-300 mr-1">Status Progress</span>
                      <button 
                        onClick={() => setShowStatusInfo(!showStatusInfo)}
                        className="text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-dark-accent-purple"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {nextStatus ? (
                      <span className="font-medium text-title dark:text-dark-text-primary">{totalPoints}/{nextStatus.minPoints} points</span>
                    ) : (
                      <span className="font-medium text-title dark:text-dark-text-primary">Max Level Reached!</span>
                    )}
                  </div>
                  
                  {showStatusInfo && (
                    <div className="bg-gray-50 dark:bg-dark-bg/50 p-3 rounded-lg mb-2 text-xs">
                      <h4 className="font-medium mb-1 text-title dark:text-dark-text-primary">Status Levels:</h4>
                      <ul className="space-y-1">
                        {STATUS_LEVELS.map((level, index) => (
                          <li key={index} className="flex justify-between text-body dark:text-dark-text-secondary">
                            <span>{level.name}</span>
                            <span>{level.minPoints}+ points</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="h-2 bg-gray-100 dark:bg-dark-bg/70 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary dark:bg-dark-accent-purple" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  
                  {nextStatus ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Earn {pointsToNextLevel} more points to reach {nextStatus.name} status
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Congratulations! You've reached the highest status level.
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 pb-4 border-b border-gray-100 dark:border-dark-border">
                  <div className="bg-gray-50 dark:bg-dark-bg/50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                      <span className="text-sm font-medium text-title dark:text-dark-text-primary">{monthlyPoints}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Points this month</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-title dark:text-dark-text-primary mb-2">Ways to Earn Points</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-body dark:text-dark-text-secondary">Phone Call</span>
                      <span className="font-medium text-primary dark:text-dark-accent-purple">+2 pts</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-body dark:text-dark-text-secondary">Email or Text</span>
                      <span className="font-medium text-primary dark:text-dark-accent-purple">+1 pt</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-body dark:text-dark-text-secondary">Referral Partner Meeting</span>
                      <span className="font-medium text-primary dark:text-dark-accent-purple">+12 pts</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-body dark:text-dark-text-secondary">New Referral Partner</span>
                      <span className="font-medium text-primary dark:text-dark-accent-purple">+20 pts</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-body dark:text-dark-text-secondary">Social Post</span>
                      <span className="font-medium text-primary dark:text-dark-accent-purple">+5 pts</span>
                    </li>
                  </ul>
                </div>
                
                <button 
                  className="btn-primary w-full dark:bg-dark-accent-purple dark:text-dark-text-primary"
                  onClick={() => setShowEarningOptionsModal(true)}
                >
                  View All Earning Options
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rewards and History */}
        <div className="col-span-12 lg:col-span-8">
          {/* Available Rewards section hidden as requested */}
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm dark:shadow-none dark:border dark:border-dark-border overflow-hidden mb-6 hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-dark-bg/50 border-b border-gray-200 dark:border-dark-border">
              <h2 className="text-lg font-semibold text-title dark:text-dark-text-primary flex items-center">
                <Gift className="h-5 w-5 text-primary dark:text-dark-accent-purple mr-2" />
                Available Rewards
              </h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {rewardOptions.map(reward => (
                  <div 
                    key={reward.id} 
                    className={`border ${reward.popular ? 'border-primary' : 'border-gray-200'} dark:border-dark-border rounded-lg p-4 relative`}
                  >
                    {reward.popular && (
                      <div className="absolute top-2 right-2 bg-primary dark:bg-dark-accent-purple text-white text-xs px-2 py-0.5 rounded-full">
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
                        <p className="text-sm text-primary dark:text-dark-accent-purple font-bold">{reward.points} points</p>
                      </div>
                    </div>
                    
                    <button 
                      className={`w-full py-1.5 rounded-lg text-sm font-medium ${
                        reward.points <= totalPoints 
                          ? 'bg-primary dark:bg-dark-accent-purple text-white dark:text-dark-text-primary' 
                          : 'bg-gray-100 dark:bg-dark-bg/70 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={reward.points > totalPoints}
                    >
                      {reward.points <= totalPoints ? 'Redeem Now' : 'Not Enough Points'}
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-primary dark:text-dark-accent-purple font-medium text-sm flex items-center mx-auto">
                  View All Rewards
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm dark:shadow-none dark:border dark:border-dark-border overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-dark-bg/50 border-b border-gray-200 dark:border-dark-border flex justify-between items-center">
              <h2 className="text-lg font-semibold text-title dark:text-dark-text-primary flex items-center">
                <Calendar className="h-5 w-5 text-primary dark:text-dark-accent-purple mr-2" />
                Activity & Points History
              </h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search activities..."
                  className="py-1.5 pl-9 pr-3 text-sm border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-dark-accent-purple focus:border-primary dark:focus:border-dark-accent-purple dark:text-dark-text-secondary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {isActivitiesLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary dark:text-dark-accent-purple mr-2" />
                <p className="text-gray-500 dark:text-gray-400">Loading activities...</p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="p-8 text-center">
                {activities.length === 0 ? (
                  <>
                    <p className="text-gray-500 dark:text-gray-400">No activities found.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Complete activities to earn points!</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 dark:text-gray-400">No matching activities found.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different search term.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-dark-border">
                {filteredActivities.map(activity => (
                  <div key={activity.id} className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-dark-bg/30 transition-colors">
                    <div>
                      <p className="font-medium text-title dark:text-dark-text-primary">{getActivityDescription(activity)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatActivityDate(activity.activity_date)}</p>
                    </div>
                    <span className="text-green-600 dark:text-green-400 font-bold">+{activity.points} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Earning Options Modal */}
      {showEarningOptionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg dark:border dark:border-dark-border max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <Award className="h-5 w-5 text-primary dark:text-dark-accent-purple mr-2" />
                Ways to Earn Points
              </h2>
              <button 
                onClick={() => setShowEarningOptionsModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Complete the following activities to earn points and increase your status level. 
                Higher status levels unlock additional rewards and benefits.
              </p>
              
              <div className="space-y-6">
                {EARNING_OPTIONS.map(option => (
                  <div key={option.id} className="bg-gray-50 dark:bg-dark-bg/50 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="bg-primary bg-opacity-10 dark:bg-primary/20 p-2 rounded-lg mr-4">
                        <option.icon className="h-6 w-6 text-primary dark:text-dark-accent-purple" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-lg text-title dark:text-dark-text-primary">{option.title}</h3>
                          <span className="bg-primary dark:bg-primary/90 text-white text-sm font-bold px-3 py-1 rounded-full">
                            +{option.points} pts
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">{option.description}</p>
                        
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-200 mb-1">Examples:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            {option.examples.map((example, index) => (
                              <li key={index}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-gray-100 dark:bg-dark-bg/70 p-4 rounded-lg">
                <h3 className="font-medium text-title dark:text-dark-text-primary mb-2">Important Notes:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Points are awarded after the activity is recorded in the system</li>
                  <li>Activities must be properly documented to receive points</li>
                  <li>Points accumulate over time and contribute to your status level</li>
                  <li>Higher status levels unlock additional rewards and benefits</li>
                </ul>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-dark-bg/50 border-t border-gray-200 dark:border-dark-border">
              <button 
                onClick={() => setShowEarningOptionsModal(false)}
                className="btn-primary dark:bg-dark-accent-purple dark:text-dark-text-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}