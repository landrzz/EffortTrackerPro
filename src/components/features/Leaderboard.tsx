'use client'

import React, { useState, useEffect } from 'react'
import { Search, Trophy, Filter, ArrowUpDown, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { getLeaderboardData, LeaderboardUser } from '@/lib/leaderboardUtils'

export default function Leaderboard() {
  const [filterBy, setFilterBy] = useState<'all' | 'weekly' | 'monthly'>('all')
  const [sortBy, setSortBy] = useState('points')
  const [searchQuery, setSearchQuery] = useState('')
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch leaderboard data
  useEffect(() => {
    async function fetchLeaderboardData() {
      setIsLoading(true)
      setError(null)
      
      try {
        const data = await getLeaderboardData(filterBy)
        setLeaderboardUsers(data)
      } catch (err) {
        console.error('Error fetching leaderboard data:', err)
        setError('Failed to load leaderboard data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchLeaderboardData()
  }, [filterBy])
  
  const filteredUsers = leaderboardUsers
    .filter(user => {
      if (searchQuery) {
        return user.name.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'points') return b.activityPoints - a.activityPoints
      if (sortBy === 'activities') return b.activities - a.activities
      if (sortBy === 'streak') return b.streak - a.streak
      return a.rank - b.rank // Default to rank
    })
  
  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    if (rank === 2) return 'bg-gray-100 text-gray-800 border-gray-300'
    if (rank === 3) return 'bg-amber-100 text-amber-800 border-amber-300'
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }
  
  const getChangeIndicator = (change?: 'up' | 'down' | 'same' | 'new', amount?: number) => {
    if (!change || change === 'same' || change === 'new') return null
    
    return (
      <span className={`ml-1 text-xs flex items-center ${change === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {change === 'up' ? '↑' : '↓'}{amount}
      </span>
    )
  }
  
  return (
    <div className="card">
      <h3 className="text-base md:text-lg font-semibold text-darkNavy mb-4 md:mb-6">Loan Officer Leaderboard</h3>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4 md:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search loan officers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="flex items-center px-3 py-2 border border-gray-200 rounded-lg">
            <Filter className="h-4 w-4 text-gray-500 mr-2" />
            <select 
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as 'all' | 'weekly' | 'monthly')}
              className="text-sm bg-transparent outline-none"
            >
              <option value="all">All Time</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
            </select>
          </div>
          
          <div className="flex items-center px-3 py-2 border border-gray-200 rounded-lg">
            <ArrowUpDown className="h-4 w-4 text-gray-500 mr-2" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm bg-transparent outline-none"
            >
              <option value="rank">Rank</option>
              <option value="points">Points</option>
              <option value="activities">Activities</option>
              <option value="streak">Streak</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Leaderboard */}
      <div className="overflow-hidden rounded-xl">
        {/* Table headers - Only visible on desktop */}
        <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 p-3 text-xs text-gray-600 font-medium">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">Loan Officer</div>
          <div className="col-span-2 text-center">Points</div>
          <div className="col-span-2 text-center">Activities</div>
          <div className="col-span-2 text-center">Streak</div>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Loading leaderboard data...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && !isLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-red-500">
            <p>{error}</p>
            <button 
              onClick={() => getLeaderboardData(filterBy).then(data => setLeaderboardUsers(data))}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && !error && filteredUsers.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-gray-500">
            <p>No leaderboard data available.</p>
          </div>
        )}
        
        {/* Leaderboard items */}
        {!isLoading && !error && filteredUsers.length > 0 && (
          <div className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <div key={user.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-3 items-center">
                {/* Rank - Mobile shows as badge, desktop as number */}
                <div className="hidden md:flex col-span-1 items-center">
                  <div className={`font-bold flex items-center text-sm ${user.rank <= 3 ? 'text-yellow-600' : 'text-gray-700'}`}>
                    {user.rank <= 3 && <Trophy className="h-3 w-3 mr-1" />}
                    {user.rank}
                    {getChangeIndicator(user.change, user.changeAmount)}
                  </div>
                </div>
                
                {/* User info - Combined for mobile, separate for desktop */}
                <div className="flex md:col-span-5 items-center">
                  <div className="flex md:hidden mr-2">
                    <span className={`h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold ${getRankBadgeColor(user.rank)}`}>
                      {user.rank}
                    </span>
                  </div>
                  <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 relative">
                    {user.avatarUrl ? (
                      <Image 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        width={40} 
                        height={40}
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = parent.querySelector('div:last-child') as HTMLElement;
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }
                        }}
                      />
                    ) : null}
                    <div 
                      className="flex items-center justify-center h-full w-full bg-primary/10 text-primary font-bold absolute top-0 left-0"
                      style={{ display: user.avatarUrl ? 'none' : 'flex' }}
                    >
                      {user.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-sm md:text-base">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.title}</div>
                  </div>
                </div>
                
                {/* Mobile stats - All in one row */}
                <div className="md:hidden grid grid-cols-3 gap-2 mt-2">
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <div className="text-xs text-gray-500">Points</div>
                    <div className="font-medium text-sm">{user.activityPoints}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <div className="text-xs text-gray-500">Activities</div>
                    <div className="font-medium text-sm">{user.activities}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <div className="text-xs text-gray-500">Streak</div>
                    <div className="font-medium text-sm">{user.streak}</div>
                  </div>
                </div>
                
                {/* Desktop stats - In columns */}
                <div className="hidden md:block col-span-2 text-center font-medium">{user.activityPoints}</div>
                <div className="hidden md:block col-span-2 text-center">{user.activities}</div>
                <div className="hidden md:block col-span-2 text-center">
                  <div className="flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-primary mr-1.5"></span>
                    {user.streak} days
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}