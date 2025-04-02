import React from 'react'
import MainLayout from '@/components/layout/MainLayout'
import DailyProgress from '@/components/features/DailyProgress'
import WeeklyProgress from '@/components/features/WeeklyProgress'
import ActivityCalendar from '@/components/features/ActivityCalendar'
import InsightsGraph from '@/components/features/InsightsGraph'
import LoanAnniversaries from '@/components/features/LoanAnniversaries'
import ActivityMetrics from '@/components/features/ActivityMetrics'

export default function Home() {
  return (
    <MainLayout>
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-title">Activity Dashboard</h1>
        <p className="text-sm md:text-base text-subtitle mt-1">Track your activities and view progress analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* Progress Cards */}
        <div className="col-span-1 md:col-span-12 lg:col-span-4">
          <DailyProgress />
        </div>
        <div className="col-span-1 md:col-span-12 lg:col-span-8">
          <WeeklyProgress />
        </div>
        
        {/* Calendar and Insights */}
        <div className="col-span-1 md:col-span-6">
          <ActivityCalendar />
        </div>
        <div className="col-span-1 md:col-span-6">
          <InsightsGraph />
        </div>
        
        {/* Metrics and Anniversaries */}
        <div className="col-span-1 md:col-span-12 hidden">
          <ActivityMetrics />
        </div>
        <div className="col-span-1 md:col-span-12 hidden">
          <LoanAnniversaries />
        </div>
      </div>
    </MainLayout>
  )
}