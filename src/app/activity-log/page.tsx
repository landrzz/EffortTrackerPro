"use client"

import React, { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Search, Calendar, Tag, AlertCircle, Download, Phone, Mail, Users, MessageSquare, Home, Briefcase, Filter, MoreHorizontal, Star, ThumbsUp, X } from 'lucide-react'

// Define the status types to fix TypeScript errors
type ActivityStatus = 'follow-up-required' | 'proposal-sent' | 'pending-response' | 'waiting-for-documents' | 'preparing-terms' | 'approved'

interface Activity {
  id: number
  clientName: string
  clientType: string
  activityType: string
  notes: string
  date: string
  potentialValue: string
  tags: string[]
  icon: any // Using any for Lucide icons, could be refined further
  color: string
  status: ActivityStatus
}

export default function ActivityLogPage() {
  // Add state for filters
  const [dateRange, setDateRange] = useState<string>("Last 30 days");
  const [activityTypes, setActivityTypes] = useState<string[]>(["All Types"]);
  const [clientTypes, setClientTypes] = useState<string[]>(["All"]);
  const [statusFilters, setStatusFilters] = useState<string[]>(["All Statuses"]);
  const [minValue, setMinValue] = useState<string>("");
  const [maxValue, setMaxValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [appliedFilters, setAppliedFilters] = useState<string[]>(["Last 30 days", "Phone Call", "Follow Up Required"]);

  // Function to clear all filters
  const clearAllFilters = () => {
    setDateRange("Last 30 days");
    setActivityTypes(["All Types"]);
    setClientTypes(["All"]);
    setStatusFilters(["All Statuses"]);
    setMinValue("");
    setMaxValue("");
    setSearchQuery("");
    setAppliedFilters([]);
  };

  // Function to handle checkbox changes for filter groups
  const handleCheckboxChange = (value: string, currentValues: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, allValue: string) => {
    if (value === allValue) {
      setter([allValue]);
    } else {
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues.filter(v => v !== allValue), value];
      
      setter(newValues.length === 0 ? [allValue] : newValues);
    }
  };

  // Function to apply filters
  const applyFilters = () => {
    const newFilters: string[] = [];
    
    if (dateRange !== "Last 30 days") newFilters.push(dateRange);
    
    activityTypes.forEach(type => {
      if (type !== "All Types") newFilters.push(type);
    });
    
    clientTypes.forEach(type => {
      if (type !== "All") newFilters.push(type);
    });
    
    statusFilters.forEach(status => {
      if (status !== "All Statuses") newFilters.push(status);
    });
    
    if (minValue || maxValue) {
      const valueRange = `$${minValue}${maxValue ? ' - $' + maxValue : '+'}`;
      newFilters.push(valueRange);
    }
    
    setAppliedFilters(newFilters);
  };

  // Function to remove a specific filter
  const removeFilter = (filter: string) => {
    setAppliedFilters(appliedFilters.filter(f => f !== filter));
  };

  const activities: Activity[] = [
    {
      id: 1,
      clientName: "Michael Johnson",
      clientType: "Individual",
      activityType: "Phone Call",
      notes: "Discussed refinancing options for his primary residence. He's interested in a 15-year fixed option.",
      date: "Aug 15, 2023",
      potentialValue: "$350,000",
      tags: ["follow-up", "hot-lead", "refinance"],
      icon: Phone,
      color: 'bg-blue-500',
      status: "follow-up-required"
    },
    {
      id: 2,
      clientName: "Westview Properties LLC",
      clientType: "Business",
      activityType: "Meeting",
      notes: "Met with the CFO about commercial property refinancing for their 3 locations. Needs proposal by end of month.",
      date: "Aug 12, 2023",
      potentialValue: "$1,250,000",
      tags: ["proposal", "commercial", "multi-property"],
      icon: Users,
      color: 'bg-green-500',
      status: "proposal-sent"
    },
    {
      id: 3,
      clientName: "Sarah Williams",
      clientType: "Individual",
      activityType: "Email",
      notes: "Sent pre-approval information and rates. She's looking to purchase in the next 3 months.",
      date: "Aug 10, 2023",
      potentialValue: "$425,000",
      tags: ["pre-approval", "purchase", "first-time-buyer"],
      icon: Mail,
      color: 'bg-purple-500',
      status: "pending-response"
    },
    {
      id: 4,
      clientName: "David Chen",
      clientType: "Individual",
      activityType: "Text/Message",
      notes: "Quick follow-up on documentation needed. He'll send credit report and bank statements by Friday.",
      date: "Aug 7, 2023",
      potentialValue: "$280,000",
      tags: ["documentation", "follow-up"],
      icon: MessageSquare,
      color: 'bg-amber-500',
      status: "waiting-for-documents"
    },
    {
      id: 5,
      clientName: "Riverfront Development",
      clientType: "Business",
      activityType: "Site Visit",
      notes: "Toured the property they're looking to finance. Modern 12-unit apartment building with excellent location.",
      date: "Aug 3, 2023",
      potentialValue: "$2,100,000",
      tags: ["multi-family", "new-construction"],
      icon: Home,
      color: 'bg-red-500',
      status: "preparing-terms"
    },
    {
      id: 6,
      clientName: "Jennifer Martinez",
      clientType: "Individual",
      activityType: "Proposal",
      notes: "Sent formal refinancing proposal with 3 options based on her equity position and goals.",
      date: "Aug 1, 2023",
      potentialValue: "$320,000",
      tags: ["refinance", "proposal-sent"],
      icon: Briefcase,
      color: 'bg-indigo-500',
      status: "approved"
    },
  ]
  
  const statusColors: Record<ActivityStatus, string> = {
    "follow-up-required": "bg-amber-100 text-amber-800",
    "proposal-sent": "bg-blue-100 text-blue-800",
    "pending-response": "bg-purple-100 text-purple-800",
    "waiting-for-documents": "bg-gray-100 text-gray-800",
    "preparing-terms": "bg-teal-100 text-teal-800",
    "approved": "bg-green-100 text-green-800"
  }
  
  const statusText: Record<ActivityStatus, string> = {
    "follow-up-required": "Follow Up Required",
    "proposal-sent": "Proposal Sent",
    "pending-response": "Pending Response",
    "waiting-for-documents": "Waiting for Documents",
    "preparing-terms": "Preparing Terms",
    "approved": "Approved"
  }
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-darkNavy">Prospecting Activity Log</h1>
        <p className="text-gray-600 mt-1">Track and manage your client interactions</p>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Date Range
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select 
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                    <option>Custom range</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Activity Type
                </label>
                <div className="space-y-2">
                  {['All Types', 'Phone Call', 'Email', 'Meeting', 'Text/Message', 'Site Visit', 'Proposal'].map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-primary" 
                        checked={activityTypes.includes(type)}
                        onChange={() => handleCheckboxChange(type, activityTypes, setActivityTypes, 'All Types')}
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Client Type
                </label>
                <div className="space-y-2">
                  {['All', 'Individual', 'Business'].map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-primary" 
                        checked={clientTypes.includes(type)}
                        onChange={() => handleCheckboxChange(type, clientTypes, setClientTypes, 'All')}
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Status
                </label>
                <div className="space-y-2">
                  {['All Statuses', 'Follow Up Required', 'Pending Response', 'Proposal Sent', 'Waiting for Documents', 'Preparing Terms', 'Approved'].map(status => (
                    <label key={status} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-primary" 
                        checked={statusFilters.includes(status)}
                        onChange={() => handleCheckboxChange(status, statusFilters, setStatusFilters, 'All Statuses')}
                      />
                      <span className="text-sm">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Potential Value
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Min" 
                    className="px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Max" 
                    className="px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                  />
                </div>
              </div>
              
              <button className="btn-primary w-full" onClick={applyFilters}>Apply Filters</button>
              <button className="text-primary text-sm font-medium w-full" onClick={clearAllFilters}>Reset All</button>
            </div>
          </div>
        </div>
        
        <div className="col-span-12 md:col-span-9">
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input 
                  type="text" 
                  placeholder="Search by client name, notes, or tags..." 
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                {/* Other buttons */}
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {appliedFilters.map((filter, index) => (
                <div key={index} className="flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                  {filter}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => removeFilter(filter)}
                  />
                </div>
              ))}
              {appliedFilters.length > 0 && (
                <button 
                  className="text-primary text-xs"
                  onClick={clearAllFilters}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="space-y-4 divide-y divide-gray-100">
              {activities.map(activity => (
                <div key={activity.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full ${activity.color} flex items-center justify-center text-white`}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div>
                          <h3 className="text-lg font-semibold">{activity.clientName}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{activity.activityType}</span>
                            <span className="mx-2">•</span>
                            <span>{activity.date}</span>
                            
                            <span className={`ml-3 px-2 py-0.5 rounded-full text-xs ${statusColors[activity.status]}`}>
                              {statusText[activity.status]}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Removed Follow Up button as requested */}
                          <button className="p-1 rounded-full hover:bg-gray-100">
                            <MoreHorizontal className="h-5 w-5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm my-2">
                        {activity.notes}
                      </div>
                      
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {activity.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        
                        <div className="ml-auto text-sm text-primary font-medium">
                          Potential: {activity.potentialValue}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing 6 of 24 activities
              </div>
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
      </div>
    </MainLayout>
  )
} 