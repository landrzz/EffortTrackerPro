import React from 'react'
import MainLayout from '@/components/layout/MainLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Award, Gift, TrendingUp, Clock, ArrowRight, Calendar } from 'lucide-react'
import Image from 'next/image'

export default function PointsPage() {
  const rewardHistory = [
    { id: 1, action: 'Completed Mortgage Payment', points: 10, date: 'Sep 15, 2023' },
    { id: 2, action: 'Updated Profile Information', points: 5, date: 'Sep 10, 2023' },
    { id: 3, action: 'Referred a Friend', points: 25, date: 'Sep 5, 2023' },
    { id: 4, action: 'Completed Financial Quiz', points: 15, date: 'Aug 28, 2023' },
    { id: 5, action: 'Set Up Automatic Payments', points: 20, date: 'Aug 20, 2023' },
  ]
  
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
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-darkNavy">Reward Points</h1>
        <p className="text-gray-600 mt-1">Earn and redeem points for financial activities</p>
      </div>
      
      <DashboardLayout>
        <div className="grid grid-cols-12 gap-6">
          {/* Points Summary */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-primary p-6 text-white text-center">
                <Award className="h-12 w-12 mx-auto mb-2" />
                <h2 className="text-2xl font-bold">20 Points</h2>
                <p className="text-sm opacity-80">Your current balance</p>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Milestone Progress</span>
                      <span className="font-medium">20/100 points</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '20%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Earn 80 more points to reach Silver status</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pb-4 border-b border-gray-100">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm font-medium">75</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Points this month</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-amber-500 mr-2" />
                        <span className="text-sm font-medium">10/31/23</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Next expiration</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Ways to Earn Points</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Pay bills on time</span>
                        <span className="font-medium text-primary">+10 pts</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Complete profile</span>
                        <span className="font-medium text-primary">+5 pts</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Set up auto-payments</span>
                        <span className="font-medium text-primary">+20 pts</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Refer a friend</span>
                        <span className="font-medium text-primary">+25 pts</span>
                      </li>
                    </ul>
                  </div>
                  
                  <button className="btn-primary w-full">View All Earning Options</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rewards and History */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center">
                  <Gift className="h-5 w-5 text-primary mr-2" />
                  Available Rewards
                </h2>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {rewardOptions.map(reward => (
                    <div 
                      key={reward.id} 
                      className={`border ${reward.popular ? 'border-primary' : 'border-gray-200'} rounded-lg p-4 relative`}
                    >
                      {reward.popular && (
                        <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
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
                          <p className="text-sm text-primary font-bold">{reward.points} points</p>
                        </div>
                      </div>
                      
                      <button 
                        className={`w-full py-1.5 rounded-lg text-sm font-medium ${
                          reward.points <= 20 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={reward.points > 20}
                      >
                        {reward.points <= 20 ? 'Redeem Now' : 'Not Enough Points'}
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <button className="text-primary font-medium text-sm flex items-center mx-auto">
                    View All Rewards
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  Points History
                </h2>
                <button className="text-primary text-sm">Download</button>
              </div>
              
              <div className="divide-y divide-gray-100">
                {rewardHistory.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-4">
                    <div>
                      <p className="font-medium">{item.action}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                    <span className="text-green-600 font-bold">+{item.points} pts</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 p-4 text-center">
                <button className="text-primary font-medium text-sm">View Full History</button>
              </div>
            </div>
          </div>
          
          {/* Points Calculator */}
          <div className="col-span-12">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4">Points Calculator</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Points
                  </label>
                  <input 
                    type="number" 
                    defaultValue="20" 
                    className="px-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Reward
                  </label>
                  <select className="px-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="200">$10 Starbucks Gift Card (200 pts)</option>
                    <option value="300">Statement Credit $15 (300 pts)</option>
                    <option value="500">$25 Amazon Gift Card (500 pts)</option>
                    <option value="750">$50 Home Depot Gift Card (750 pts)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points Needed
                  </label>
                  <div className="px-4 py-2 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 font-bold text-center">
                    180 more points
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  At your current earning rate, you'll reach this reward in approximately <strong>3 months</strong>.
                  Increase your earning by setting up auto-payments or referring friends!
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </MainLayout>
  )
} 