import React from 'react'
import MainLayout from '@/components/layout/MainLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'
import DailyProgress from '@/components/features/DailyProgress'
import WeeklyProgress from '@/components/features/WeeklyProgress'
import ActivityCalendar from '@/components/features/ActivityCalendar'
import InsightsGraph from '@/components/features/InsightsGraph'
import { HomeIcon, Wallet, Target, ArrowRight, CreditCard, Landmark, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-darkNavy">Financial Dashboard</h1>
        <p className="text-gray-600 mt-1">Your financial health at a glance</p>
      </div>
      
      <DashboardLayout>
        <div className="grid grid-cols-12 gap-6">
          {/* Financial Summary */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="card p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Balance</p>
                    <h3 className="text-2xl font-bold">$24,562.80</h3>
                    <p className="text-xs text-green-600 mt-1">+2.3% from last month</p>
                  </div>
                  <div className="h-12 w-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="card p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Monthly Budget</p>
                    <h3 className="text-2xl font-bold">$3,850.00</h3>
                    <p className="text-xs text-amber-600 mt-1">65% used this month</p>
                  </div>
                  <div className="h-12 w-12 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-secondary" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <button className="text-primary text-sm font-medium flex items-center">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">Online Purchase</p>
                        <p className="text-xs text-gray-500">July 12, 2023 at 4:30 PM</p>
                      </div>
                    </div>
                    <p className="font-semibold text-red-600">-$85.20</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Goal Progress */}
          <div className="col-span-12 lg:col-span-4">
            <InsightsGraph />
            
            <div className="card mt-6">
              <h3 className="text-lg font-semibold mb-4">Financial Goals</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Emergency Fund</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Vacation Savings</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Home Down Payment</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
              </div>
              
              <button className="w-full btn-secondary mt-4 text-sm">Add New Goal</button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="col-span-12">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Transfer Money', icon: Landmark, color: 'bg-blue-500' },
                { title: 'Pay Bills', icon: CreditCard, color: 'bg-purple-500' },
                { title: 'Investment', icon: BarChart3, color: 'bg-green-500' },
                { title: 'View Statement', icon: HomeIcon, color: 'bg-amber-500' },
              ].map((action, index) => (
                <button 
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors"
                >
                  <div className={`h-10 w-10 ${action.color} rounded-full flex items-center justify-center text-white mb-3`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Quick access</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </MainLayout>
  )
} 