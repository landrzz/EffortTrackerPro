'use client'

import React, { useState } from 'react'
import { ArrowUpRight, BarChart2 } from 'lucide-react'

export default function InsightsGraph() {
  const [timeframe, setTimeframe] = useState<'days' | 'weeks'>('days')
  
  // Sample data for the graph
  const daysData = [
    { day: 'Mon', value: 40 },
    { day: 'Tue', value: 30 },
    { day: 'Wed', value: 70 },
    { day: 'Thu', value: 50 },
    { day: 'Fri', value: 60 },
    { day: 'Sat', value: 90 },
    { day: 'Sun', value: 65 },
  ]
  
  const weeksData = [
    { week: 'Week 1', value: 45 },
    { week: 'Week 2', value: 52 },
    { week: 'Week 3', value: 68 },
    { week: 'Week 4', value: 75 },
  ]
  
  const maxValue = Math.max(
    ...(timeframe === 'days' 
      ? daysData.map(d => d.value) 
      : weeksData.map(w => w.value))
  )
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BarChart2 className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-semibold text-darkNavy">Activity Insights</h3>
        </div>
        
        <div className="flex items-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTimeframe('days')}
              className={`text-xs px-3 py-1 rounded-md ${
                timeframe === 'days'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Days
            </button>
            <button
              onClick={() => setTimeframe('weeks')}
              className={`text-xs px-3 py-1 rounded-md ${
                timeframe === 'weeks'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Weeks
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-[180px] mt-2 relative">
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>
        
        <div className="pl-8 h-full flex items-end">
          {timeframe === 'days' ? (
            <div className="flex-1 flex items-end justify-between h-full">
              {daysData.map((item, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  <div className="w-full flex justify-center">
                    <div
                      className="w-10 bg-primary rounded-t-md"
                      style={{ 
                        height: `${(item.value / 100) * 150}px`,
                        opacity: 0.7 + (index * 0.05)
                      }}
                    ></div>
                  </div>
                  <span className="text-xs mt-2 text-gray-600">{item.day}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-between h-full">
              {weeksData.map((item, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  <div className="w-full flex justify-center">
                    <div
                      className="w-16 bg-primary rounded-t-md"
                      style={{ 
                        height: `${(item.value / 100) * 150}px`,
                        opacity: 0.7 + (index * 0.07)
                      }}
                    ></div>
                  </div>
                  <span className="text-xs mt-2 text-gray-600">{item.week}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Performance</p>
          <p className="text-lg font-semibold flex items-center">
            {timeframe === 'days' ? '+24%' : '+38%'}
            <ArrowUpRight className="ml-1 h-4 w-4 text-green-500" />
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">Average</p>
          <p className="text-lg font-semibold">
            {timeframe === 'days' 
              ? `${Math.round(daysData.reduce((sum, item) => sum + item.value, 0) / daysData.length)}%`
              : `${Math.round(weeksData.reduce((sum, item) => sum + item.value, 0) / weeksData.length)}%`
            }
          </p>
        </div>
      </div>
    </div>
  )
} 