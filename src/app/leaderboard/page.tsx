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
        <h1 className="text-2xl md:text-3xl font-bold text-darkNavy dark:text-white">Loan Officer Leaderboard</h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">Track performance and recognize top performers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* Leaderboard Stats Cards */}
        {isLoading ? (
          <div className="col-span-1 md:col-span-12 flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-dark-accent-purple" />
          </div>
        ) : (
          <>
            <div className="col-span-1 md:col-span-4">
              <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
                    <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Activities</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalActivities.toLocaleString()}</div>
                    <div className={`text-xs mt-1 ${stats.achievementRateChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stats.achievementRateChange > 0 ? '↑' : '↓'} {Math.abs(Math.round(stats.achievementRateChange))}% from last month
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-4">
              <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-800/50 flex items-center justify-center">
                    <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Achievement Rate</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{Math.round(stats.achievementRate)}%</div>
                    <div className={`text-xs mt-1 ${stats.achievementRateChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stats.achievementRateChange > 0 ? '↑' : '↓'} {Math.abs(Math.round(stats.achievementRateChange))}% from last month
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-4">
              <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Points Earned</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalPoints.toLocaleString()}</div>
                    <div className={`text-xs mt-1 ${stats.pointsChangePercentage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
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