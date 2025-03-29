'use client'

import React, { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Loader2 } from 'lucide-react'
import { triggerLeaderboardSnapshot } from '@/lib/leaderboardUtils'

export default function LeaderboardAdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleTriggerSnapshot = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const success = await triggerLeaderboardSnapshot()
      setResult({
        success,
        message: success 
          ? 'Leaderboard snapshot completed successfully!' 
          : 'Failed to trigger leaderboard snapshot. Check console for details.'
      })
    } catch (error) {
      console.error('Error triggering snapshot:', error)
      setResult({
        success: false,
        message: 'An unexpected error occurred. Check console for details.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-darkNavy">Leaderboard Administration</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Manage leaderboard snapshots and settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="col-span-1 md:col-span-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-darkNavy mb-4">Manual Snapshot</h3>
            <p className="text-sm text-gray-600 mb-6">
              Manually trigger a leaderboard snapshot to capture current rankings. This is typically done automatically once per day.
            </p>
            
            <button
              onClick={handleTriggerSnapshot}
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-lg flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Trigger Snapshot Now'
              )}
            </button>
            
            {result && (
              <div className={`mt-4 p-3 rounded-lg ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {result.message}
              </div>
            )}
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-darkNavy mb-4">Scheduled Snapshots</h3>
            <p className="text-sm text-gray-600 mb-2">
              For automatic daily snapshots, set up a scheduled function in Supabase:
            </p>
            
            <ol className="list-decimal list-inside text-sm space-y-2 mb-6">
              <li>Deploy the Edge Function in <code>supabase/functions/daily-leaderboard-snapshot</code></li>
              <li>Set up environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FUNCTION_SECRET)</li>
              <li>Create a scheduled task to run daily at midnight</li>
            </ol>
            
            <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono overflow-x-auto">
              <pre>{`# Example cron schedule (midnight every day)
0 0 * * *`}</pre>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
