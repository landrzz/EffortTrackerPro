import React from 'react'
import MainLayout from '@/components/layout/MainLayout'
import Leaderboard from '@/components/features/Leaderboard'
import { Award, Star, TrendingUp } from 'lucide-react'

export default function LeaderboardPage() {
  return (
    <MainLayout>
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-darkNavy">Loan Officer Leaderboard</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Track performance and recognize top performers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* Leaderboard Stats Cards */}
        <div className="col-span-1 md:col-span-4">
          <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <div className="text-sm text-gray-600">Total Activities</div>
                <div className="text-xl font-bold text-gray-900">1,248</div>
                <div className="text-xs text-green-600 mt-1">↑ 12% from last month</div>
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
                <div className="text-xl font-bold text-gray-900">86%</div>
                <div className="text-xs text-green-600 mt-1">↑ 5% from last month</div>
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
                <div className="text-xl font-bold text-gray-900">8,750</div>
                <div className="text-xs text-green-600 mt-1">↑ 18% from last month</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Leaderboard */}
        <div className="col-span-1 md:col-span-12">
          <Leaderboard />
        </div>
      </div>
    </MainLayout>
  )
}