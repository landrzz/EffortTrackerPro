import React from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Percent, DollarSign, TrendingDown, Building, Home, MapPin, Star, ExternalLink, ChevronRight, Calculator, Search, Filter, SortAsc, Phone, Mail, ArrowUpDown, CreditCard } from 'lucide-react'
import Image from 'next/image'

export default function RefiOpportunitiesPage() {
  const refinanceOpportunities = [
    {
      id: 1,
      clientName: "James & Maria Rodriguez",
      address: "1542 Maple Avenue, Portland, OR 97205",
      currentRate: 4.75,
      newRate: 3.25,
      amountOwed: 375000,
      propertyValue: 550000,
      creditScore: 780,
      loanType: "30-Year Fixed",
      monthlySavings: 342,
      totalSavings: 41040,
      ltv: 68,
      lastContact: "2 weeks ago",
      profileImage: "https://picsum.photos/id/1012/300/300",
      status: "high"
    },
    {
      id: 2,
      clientName: "Robert Chen",
      address: "872 Willow Street, Seattle, WA 98101",
      currentRate: 5.15,
      newRate: 3.45,
      amountOwed: 423000,
      propertyValue: 520000,
      creditScore: 745,
      loanType: "30-Year Fixed",
      monthlySavings: 421,
      totalSavings: 50520,
      ltv: 81,
      lastContact: "1 month ago",
      profileImage: "https://picsum.photos/id/1025/300/300",
      status: "high"
    },
    {
      id: 3,
      clientName: "Sarah & Thomas Johnson",
      address: "439 Oak Drive, Austin, TX 78704",
      currentRate: 4.25,
      newRate: 3.15,
      amountOwed: 298000,
      propertyValue: 485000,
      creditScore: 805,
      loanType: "15-Year Fixed",
      monthlySavings: 218,
      totalSavings: 26160,
      ltv: 61,
      lastContact: "3 days ago",
      profileImage: "https://picsum.photos/id/1074/300/300",
      status: "medium"
    },
    {
      id: 4,
      clientName: "Michelle Williams",
      address: "1025 Pine Court, Denver, CO 80202",
      currentRate: 5.65,
      newRate: 3.50,
      amountOwed: 512000,
      propertyValue: 595000,
      creditScore: 720,
      loanType: "30-Year Fixed",
      monthlySavings: 645,
      totalSavings: 77400,
      ltv: 86,
      lastContact: "5 weeks ago",
      profileImage: "https://picsum.photos/id/1062/300/300",
      status: "high"
    },
    {
      id: 5,
      clientName: "Evergreen Properties LLC",
      address: "350 Commerce Way, Chicago, IL 60601",
      currentRate: 5.10,
      newRate: 3.85,
      amountOwed: 1250000,
      propertyValue: 1650000,
      creditScore: 790,
      loanType: "Commercial",
      monthlySavings: 1025,
      totalSavings: 123000,
      ltv: 76,
      lastContact: "2 months ago",
      profileImage: "https://picsum.photos/id/1011/300/300",
      status: "medium"
    }
  ];
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-darkNavy">Refinance Opportunities</h1>
        <p className="text-gray-600 mt-1">Clients in your database who could benefit from refinancing</p>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Filters & Stats */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Quick Filters</h3>
              <button className="text-xs text-primary font-medium">Reset</button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Savings Potential</label>
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium">High</button>
                  <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">Medium</button>
                  <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">Low</button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Credit Score</label>
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">700+</button>
                  <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">650-699</button>
                  <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">&lt;650</button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Loan Type</label>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-primary rounded" defaultChecked/>
                    <span className="text-sm ml-2">30-Year Fixed</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-primary rounded" defaultChecked/>
                    <span className="text-sm ml-2">15-Year Fixed</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-primary rounded" defaultChecked/>
                    <span className="text-sm ml-2">ARM</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-primary rounded" defaultChecked/>
                    <span className="text-sm ml-2">Commercial</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Current Rate</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Percent className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input 
                      type="text" 
                      placeholder="Min" 
                      className="pl-8 py-1.5 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                  <div className="relative">
                    <Percent className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input 
                      type="text" 
                      placeholder="Max" 
                      className="pl-8 py-1.5 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                </div>
              </div>
              
              <button className="btn-primary w-full mt-3">Apply Filters</button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold mb-4">Opportunity Statistics</h3>
            
            <div className="space-y-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">High Potential</span>
                  <span className="text-lg font-bold text-primary">32</span>
                </div>
                <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '40%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Clients who could save $250+ monthly</p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Medium Potential</span>
                  <span className="text-lg font-bold text-blue-600">47</span>
                </div>
                <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Clients who could save $100-$249 monthly</p>
              </div>
              
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Low Potential</span>
                  <span className="text-lg font-bold text-gray-600">63</span>
                </div>
                <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Clients who could save &lt;$100 monthly</p>
              </div>
              
              <div className="text-center pt-2">
                <p className="text-sm text-gray-500">Total Refinance Opportunities</p>
                <p className="text-2xl font-bold text-darkNavy">142</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Opportunities List */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input 
                  type="text" 
                  placeholder="Search by name, address, or loan type..." 
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              
              {/* <div className="flex items-center space-x-2">
                <button className="flex items-center text-gray-600 text-sm px-3 py-2 bg-gray-100 rounded-lg">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </button>
                <button className="flex items-center text-gray-600 text-sm px-3 py-2 bg-gray-100 rounded-lg">
                  <SortAsc className="h-4 w-4 mr-1" />
                  Sort
                </button>
              </div> */}
            </div>
          </div>
          
          <div className="space-y-4">
            {refinanceOpportunities.map((opportunity) => (
              <div 
                key={opportunity.id} 
                className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                  opportunity.status === 'high' ? 'border-l-4 border-primary' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:block relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image 
                        src={opportunity.profileImage} 
                        alt={opportunity.clientName} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="text-lg font-semibold">{opportunity.clientName}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                            <span className="truncate">{opportunity.address}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          {opportunity.status === 'high' && (
                            <span className="bg-primary bg-opacity-10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                              High Savings Potential
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Current Rate</p>
                          <p className="text-base font-semibold flex items-center">
                            {opportunity.currentRate}%
                            <TrendingDown className="ml-1 h-4 w-4 text-red-500" />
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">New Rate</p>
                          <p className="text-base font-semibold text-green-600">
                            {opportunity.newRate}%
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Amount Owed</p>
                          <p className="text-base font-semibold">
                            {formatCurrency(opportunity.amountOwed)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Property Value</p>
                          <p className="text-base font-semibold">
                            {formatCurrency(opportunity.propertyValue)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Credit Score</p>
                          <p className="text-base font-semibold flex items-center">
                            {opportunity.creditScore}
                            <Star className="ml-1 h-3.5 w-3.5 text-amber-400" />
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">LTV</p>
                          <p className="text-base font-semibold">
                            {opportunity.ltv}%
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Loan Type</p>
                          <p className="text-base font-semibold">
                            {opportunity.loanType}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Last Contact</p>
                          <p className="text-base font-semibold">
                            {opportunity.lastContact}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap justify-between items-center border-t border-gray-100 pt-3">
                        <div className="flex items-center space-x-6">
                          <div>
                            <p className="text-xs text-gray-500">Monthly Savings</p>
                            <p className="text-base font-bold text-green-600">${opportunity.monthlySavings}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total Savings</p>
                            <p className="text-sm font-medium">${opportunity.totalSavings}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                          <button className="flex items-center text-primary bg-primary bg-opacity-10 px-3 py-1.5 rounded-lg text-sm font-medium">
                            <Calculator className="h-4 w-4 mr-1.5" />
                            View Analysis
                          </button>
                          
                          <button className="flex items-center text-white bg-primary px-3 py-1.5 rounded-lg text-sm font-medium">
                            <Phone className="h-4 w-4 mr-1.5" />
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing 5 of 32 high-potential opportunities</p>
            
            <div className="flex items-center space-x-1">
              <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100">
                &lt;
              </button>
              {[1, 2, 3, 4].map(page => (
                <button 
                  key={page} 
                  className={`h-8 w-8 flex items-center justify-center rounded-lg ${
                    page === 1 ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 