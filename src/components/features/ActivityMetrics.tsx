'use client'

import React from 'react'
import { Activity, ArrowUpRight, Clock, Target, ThumbsUp, PlusCircle } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
  change?: string
  positive?: boolean
}

function MetricCard({ title, value, icon: Icon, color, change, positive }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div 
          className={`h-8 w-8 md:h-9 md:w-9 rounded-lg flex items-center justify-center`}
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className={`h-4 w-4 md:h-5 md:w-5`} style={{ color }} />
        </div>
        
        {change && (
          <div className={`flex items-center text-xs ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {positive ? '+' : ''}{change}
            <ArrowUpRight className="h-3 w-3 ml-0.5" />
          </div>
        )}
      </div>
      
      <div className="mt-2 md:mt-3">
        <h4 className="text-xs md:text-sm text-gray-600">{title}</h4>
        <p className="text-lg md:text-xl font-semibold mt-0.5 md:mt-1">{value}</p>
      </div>
    </div>
  )
}

export default function ActivityMetrics() {
  const metrics = [
    {
      title: 'Weekly Activities',
      value: '7',
      icon: Activity,
      color: '#6B4BFF',
      change: '15%',
      positive: true
    },
    {
      title: 'Hours Spent',
      value: '12.5',
      icon: Clock,
      color: '#2DD4BF',
      change: '8%',
      positive: true
    },
    {
      title: 'Goals Achieved',
      value: '3',
      icon: Target,
      color: '#F97066',
      change: '2%',
      positive: false
    },
    {
      title: 'Positive Feedback',
      value: '24',
      icon: ThumbsUp,
      color: '#8B5CF6',
      change: '12%',
      positive: true
    },
  ]
  
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base md:text-lg font-semibold text-darkNavy">Activity Metrics</h3>
        <button className="flex items-center text-xs md:text-sm text-primary">
          <PlusCircle className="h-3 w-3 md:h-4 md:w-4 mr-0.5 md:mr-1" />
          Add Metric
        </button>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            color={metric.color}
            change={metric.change}
            positive={metric.positive}
          />
        ))}
      </div>
    </div>
  )
} 