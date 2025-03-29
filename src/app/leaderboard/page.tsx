'use client'

import React, { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import Leaderboard from '@/components/features/Leaderboard'
import { Award, Star, TrendingUp, Loader2 } from 'lucide-react'
import { getLeaderboardStats } from '@/lib/leaderboardUtils'

export default function LeaderboardPage() {
  const [stats, setStats] = useState({
    totalActivities: 0,
    achievementRate: 0,
    achievementRateChange: 0,
    totalPoints: 0,
    pointsChangePercentage: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const statsData = await getLeaderboardStats()
        if (statsData) {
          setStats({
            totalActivities: statsData.totalActivities,
            achievementRate: statsData.achievementRate,
            achievementRateChange: statsData.achievementRateChange,
            totalPoints: statsData.totalPoints,
            pointsChangePercentage: statsData.pointsChangePercentage
          })
        }
      } catch (error) {
        console.error('Error fetching leaderboard stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <MainLayout>
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-darkNavy">Loan Officer Leaderboard</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Track performance and recognize top performers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* Leaderboard Stats Cards */}
        {isLoading ? (
          <div className="col-span-1 md:col-span-12 flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="col-span-1 md:col-span-4">
              <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-600">Total Activities</div>
                    <div className="text-xl font-bold text-gray-900">{stats.totalActivities.toLocaleString()}</div>
                    <div className={`text-xs mt-1 ${stats.achievementRateChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.achievementRateChange > 0 ? '↑' : '↓'} {Math.abs(Math.round(stats.achievementRateChange))}% from last month
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-4">
              <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-600">Achievement Rate</div>
                    <div className="text-xl font-bold text-gray-900">{Math.round(stats.achievementRate)}%</div>
                    <div className={`text-xs mt-1 ${stats.achievementRateChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.achievementRateChange > 0 ? '↑' : '↓'} {Math.abs(Math.round(stats.achievementRateChange))}% from last month
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-4">
              <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-600">Points Earned</div>
                    <div className="text-xl font-bold text-gray-900">{stats.totalPoints.toLocaleString()}</div>
                    <div className={`text-xs mt-1 ${stats.pointsChangePercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.pointsChangePercentage > 0 ? '↑' : '↓'} {Math.abs(Math.round(stats.pointsChangePercentage))}% from last month
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Main Leaderboard */}
        <div className="col-span-1 md:col-span-12">
          <Leaderboard />
        </div>
      </div>
    </MainLayout>
  )
}