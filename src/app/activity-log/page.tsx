"use client"

import React, { useState, useEffect, Suspense } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Search, Calendar, Tag, AlertCircle, Download, Phone, Mail, Users, MessageSquare, Home, Briefcase, Filter, MoreHorizontal, Star, ThumbsUp, X, Building, RefreshCw, UserPlus, Share2 } from 'lucide-react'
import { useGhl } from '@/context/GhlContext'
import { getUserActivities, Activity as DbActivity, getUserByGhlIds } from '@/lib/userUtils'

// Define the status types to fix TypeScript errors
type ActivityStatus = 'follow-up-required' | 'proposal-sent' | 'pending-response' | 'waiting-for-documents' | 'preparing-terms' | 'approved'

// Extend the DbActivity type to include tags
interface ExtendedDbActivity extends DbActivity {
  tags?: string[];
}

interface Activity {
  id: string;
  clientName: string;
  clientType: string;
  activityType: string;
  notes: string | null;
  date: string;
  potentialValue: string;
  tags: string[];
  icon: any; // Using any for Lucide icons, could be refined further
  color: string;
  status: ActivityStatus;
}

// Map activity types to icons and colors - matching RecordActivityModal
const activityTypeConfig: Record<string, { icon: any; color: string; displayName: string }> = {
  'call': { icon: Phone, color: 'bg-blue-500', displayName: 'Phone Call' },
  'email': { icon: Mail, color: 'bg-purple-500', displayName: 'Email' },
  'meeting_referral': { icon: Users, color: 'bg-green-500', displayName: 'Referral Partner Meeting' },
  'meeting_new_referral': { icon: UserPlus, color: 'bg-emerald-500', displayName: 'NEW Referral Partner Meeting' },
  'message': { icon: MessageSquare, color: 'bg-amber-500', displayName: 'Text/Message' },
  'social_post': { icon: Share2, color: 'bg-pink-500', displayName: 'Social Post' }
};

// Map client types to icons
const clientTypeConfig: Record<string, any> = {
  'Individual': Users,
  'Business': Building
};

// Convert database activity to UI activity
const mapDbActivityToUiActivity = (dbActivity: ExtendedDbActivity): Activity => {
  const activityType = dbActivity.activity_type;
  const config = activityTypeConfig[activityType] || { icon: Briefcase, color: 'bg-gray-500', displayName: activityType };
  
  // Format date - Fix timezone issue by using the date directly
  const dateObj = new Date(dbActivity.activity_date);
  // Adjust for timezone to ensure correct display
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    timeZone: 'UTC'  // Use UTC to prevent timezone shift
  });
  
  // Format potential value
  const potentialValue = dbActivity.potential_value 
    ? `$${dbActivity.potential_value.toLocaleString()}` 
    : 'N/A';
  
  return {
    id: dbActivity.id,
    clientName: dbActivity.client_name,
    clientType: dbActivity.client_type,
    activityType: config.displayName,
    notes: dbActivity.notes,
    date: formattedDate,
    potentialValue: potentialValue,
    tags: Array.isArray(dbActivity.tags) ? dbActivity.tags : [],
    icon: config.icon,
    color: config.color,
    status: dbActivity.status as ActivityStatus
  };
};

export default function ActivityLogPage() {
  // Add state for filters
  const [dateRange, setDateRange] = useState<string>("Last 30 days");
  const [activityTypes, setActivityTypes] = useState<string[]>(["All Types"]);
  const [clientTypes, setClientTypes] = useState<string[]>(["All"]);
  const [statusFilters, setStatusFilters] = useState<string[]>(["All Statuses"]);
  const [minValue, setMinValue] = useState<string>("");
  const [maxValue, setMaxValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [appliedFilters, setAppliedFilters] = useState<string[]>(["Last 30 days"]);
  
  // Add state for activities
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  // Get GHL context
  const { ghlUserId, ghlLocationId, isGhlParamsLoaded } = useGhl();

  // Function to clear all filters
  const clearAllFilters = () => {
    setDateRange("Last 30 days");
    setActivityTypes(["All Types"]);
    setClientTypes(["All"]);
    setStatusFilters(["All Statuses"]);
    setMinValue("");
    setMaxValue("");
    setSearchQuery("");
    setAppliedFilters(["Last 30 days"]);
    
    // Reset filtered activities to all activities
    setFilteredActivities(activities);
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
    
    // Sanitize min and max values by removing commas and non-numeric characters
    const sanitizedMinValue = minValue ? minValue.replace(/[^0-9.]/g, '') : '';
    const sanitizedMaxValue = maxValue ? maxValue.replace(/[^0-9.]/g, '') : '';
    
    // Update the state with sanitized values
    setMinValue(sanitizedMinValue);
    setMaxValue(sanitizedMaxValue);
    
    if (sanitizedMinValue || sanitizedMaxValue) {
      const valueRange = `$${sanitizedMinValue}${sanitizedMaxValue ? ' - $' + sanitizedMaxValue : '+'}`;
      newFilters.push(valueRange);
    }
    
    setAppliedFilters(newFilters.length > 0 ? newFilters : ["Last 30 days"]);
    
    // Apply filters to activities
    filterActivities(activities, searchQuery, newFilters);
  };

  // Function to remove a specific filter
  const removeFilter = (filter: string) => {
    const newFilters = appliedFilters.filter(f => f !== filter);
    setAppliedFilters(newFilters.length > 0 ? newFilters : ["Last 30 days"]);
    
    // Re-apply remaining filters
    filterActivities(activities, searchQuery, newFilters);
  };
  
  // Function to handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Apply search to activities
    filterActivities(activities, query, appliedFilters);
  };
  
  // Function to filter activities based on search query and filters
  const filterActivities = (allActivities: Activity[], query: string, filters: string[]) => {
    // First apply search query
    let filtered = allActivities;
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.clientName.toLowerCase().includes(lowerQuery) ||
        (activity.notes && activity.notes.toLowerCase().includes(lowerQuery)) ||
        (activity.tags && activity.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
        activity.activityType.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Then apply other filters if they're not default
    if (!filters.includes("Last 30 days") && filters.some(f => f.includes("Last"))) {
      const dateFilter = filters.find(f => f.includes("Last"));
      if (dateFilter) {
        const now = new Date();
        let cutoffDate = new Date();
        
        if (dateFilter === "Last 3 months") {
          cutoffDate.setMonth(now.getMonth() - 3);
        } else if (dateFilter === "Last 6 months") {
          cutoffDate.setMonth(now.getMonth() - 6);
        } else if (dateFilter === "Last year") {
          cutoffDate.setFullYear(now.getFullYear() - 1);
        } else {
          // Default to 30 days
          cutoffDate.setDate(now.getDate() - 30);
        }
        
        filtered = filtered.filter(activity => new Date(activity.date) >= cutoffDate);
      }
    }
    
    // Filter by activity type
    const activityTypeFilters = filters.filter(f => 
      ['Phone Call', 'Email', 'Referral Partner Meeting', 'NEW Referral Partner Meeting', 'Text/Message', 'Social Post'].includes(f)
    );
    
    if (activityTypeFilters.length > 0) {
      filtered = filtered.filter(activity => activityTypeFilters.includes(activity.activityType));
    }
    
    // Filter by client type
    const clientTypeFilters = filters.filter(f => ['Individual', 'Business'].includes(f));
    if (clientTypeFilters.length > 0) {
      filtered = filtered.filter(activity => clientTypeFilters.includes(activity.clientType));
    }
    
    // Filter by status
    const statusFilters = filters.filter(f => 
      ['Follow Up Required', 'Pending Response', 'Proposal Sent', 'Waiting for Documents', 'Preparing Terms', 'Approved'].includes(f)
    );
    
    if (statusFilters.length > 0) {
      filtered = filtered.filter(activity => {
        const activityStatusText = statusText[activity.status];
        return statusFilters.includes(activityStatusText);
      });
    }
    
    // Filter by value range
    const valueFilter = filters.find(f => f.startsWith('$'));
    if (valueFilter) {
      const valueMatch = valueFilter.match(/\$(\d+)(?:\s*-\s*\$(\d+))?/);
      if (valueMatch) {
        const minVal = parseInt(valueMatch[1], 10);
        const maxVal = valueMatch[2] ? parseInt(valueMatch[2], 10) : null;
        
        filtered = filtered.filter(activity => {
          // Skip activities with N/A potential value
          if (activity.potentialValue === 'N/A') return false;
          
          // Extract numeric value from the formatted string (e.g., "$5,000" -> 5000)
          const value = parseInt(activity.potentialValue.replace(/[$,]/g, ''), 10);
          
          if (isNaN(value)) return false;
          
          if (maxVal) {
            return value >= minVal && value <= maxVal;
          } else {
            return value >= minVal;
          }
        });
      }
    }
    
    setFilteredActivities(filtered);
  };
  
  // Extract the fetchActivities function so it can be reused
  const fetchActivities = async () => {
    if (!isGhlParamsLoaded) return;
    
    setError(null);
    
    try {
      // First get the user profile to get the user ID
      const userProfile = await getUserByGhlIds(ghlUserId, ghlLocationId);
      
      if (!userProfile) {
        setError("User profile not found");
        return;
      }
      
      // Then get the activities using the user ID
      const activitiesData = await getUserActivities(userProfile.id, ghlUserId, ghlLocationId, 50);
      
      // Map DB activities to UI activities
      const mappedActivities = activitiesData.map(mapDbActivityToUiActivity);
      
      setActivities(mappedActivities);
      setFilteredActivities(mappedActivities);
      setTotalCount(mappedActivities.length);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to load activities");
    }
  };
  
  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchActivities();
    setIsRefreshing(false);
  };
  
  // Fetch activities when GHL params are loaded
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await fetchActivities();
      setIsLoading(false);
    };
    
    loadInitialData();
  }, [ghlUserId, ghlLocationId, isGhlParamsLoaded]);
  
  const statusColors: Record<ActivityStatus, string> = {
    "follow-up-required": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    "proposal-sent": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "pending-response": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    "waiting-for-documents": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    "preparing-terms": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    "approved": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
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
    <Suspense fallback={<div>Loading...</div>}>
      <MainLayout>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-title dark:text-dark-text-primary">Activity Log</h1>
          <p className="text-subtitle mt-1 dark:text-dark-text-secondary">Track and manage your client interactions</p>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="card dark:bg-dark-bg/50 dark:border-dark-border">
              <h3 className="text-lg font-semibold text-title dark:text-dark-text-primary mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-body block mb-1 dark:text-dark-text-secondary">
                    Date Range
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                    <select 
                      className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-dark-bg/50 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-accent-purple dark:text-dark-text-secondary"
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
                  <label className="text-sm font-medium text-body block mb-1 dark:text-dark-text-secondary">
                    Activity Type
                  </label>
                  <div className="space-y-2">
                    {['All Types', 'Phone Call', 'Email', 'Referral Partner Meeting', 'NEW Referral Partner Meeting', 'Text/Message', 'Social Post'].map(type => (
                      <label key={type} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-primary dark:text-dark-accent-purple rounded dark:bg-dark-bg/50" 
                          checked={activityTypes.includes(type)}
                          onChange={() => handleCheckboxChange(type, activityTypes, setActivityTypes, 'All Types')}
                        />
                        <span className="text-sm text-body dark:text-dark-text-secondary">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-body block mb-1 dark:text-dark-text-secondary">
                    Client Type
                  </label>
                  <div className="space-y-2">
                    {['All', 'Individual', 'Business'].map(type => (
                      <label key={type} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-primary dark:text-dark-accent-purple rounded dark:bg-dark-bg/50" 
                          checked={clientTypes.includes(type)}
                          onChange={() => handleCheckboxChange(type, clientTypes, setClientTypes, 'All')}
                        />
                        <span className="text-sm text-body dark:text-dark-text-secondary">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-body block mb-1 dark:text-dark-text-secondary">
                    Status
                  </label>
                  <div className="space-y-2">
                    {['All Statuses', 'Follow Up Required', 'Pending Response', 'Proposal Sent', 'Waiting for Documents', 'Preparing Terms', 'Approved'].map(status => (
                      <label key={status} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-primary dark:text-dark-accent-purple rounded dark:bg-dark-bg/50" 
                          checked={statusFilters.includes(status)}
                          onChange={() => handleCheckboxChange(status, statusFilters, setStatusFilters, 'All Statuses')}
                        />
                        <span className="text-sm text-body dark:text-dark-text-secondary">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-body block mb-1 dark:text-dark-text-secondary">
                    Potential Value
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Min" 
                      className="px-3 py-2 bg-gray-100 dark:bg-dark-bg/50 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-accent-purple dark:text-dark-text-secondary"
                      value={minValue}
                      onChange={(e) => setMinValue(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Max" 
                      className="px-3 py-2 bg-gray-100 dark:bg-dark-bg/50 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-accent-purple dark:text-dark-text-secondary"
                      value={maxValue}
                      onChange={(e) => setMaxValue(e.target.value)}
                    />
                  </div>
                </div>
                
                <button className="btn-primary w-full dark:bg-dark-accent-purple dark:text-dark-text-primary" onClick={applyFilters}>Apply Filters</button>
                <button className="text-primary dark:text-dark-accent-purple text-sm font-medium w-full" onClick={clearAllFilters}>Reset All</button>
              </div>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-9">
            <div className="card mb-4 dark:bg-dark-bg/50 dark:border-dark-border">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Search by client name, notes, or tags..." 
                    className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-dark-bg/50 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-accent-purple dark:text-dark-text-secondary"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    className="p-2 rounded-lg bg-gray-100 dark:bg-dark-bg/50 hover:bg-gray-200 dark:hover:bg-dark-bg text-gray-700 dark:text-gray-300 transition-colors"
                    onClick={handleRefresh}
                    disabled={isLoading || isRefreshing}
                    title="Refresh activities"
                  >
                    <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin text-primary dark:text-dark-accent-purple' : ''}`} />
                  </button>
                  {/* Other buttons */}
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {appliedFilters.map((filter, index) => (
                  <div key={index} className="flex items-center bg-gray-100 dark:bg-dark-bg/50 text-gray-800 dark:text-gray-300 px-2 py-1 rounded text-xs">
                    {filter}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => removeFilter(filter)}
                    />
                  </div>
                ))}
                {appliedFilters.length > 0 && appliedFilters[0] !== "Last 30 days" && (
                  <button 
                    className="text-primary dark:text-dark-accent-purple text-xs"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
            
            <div className="card overflow-hidden dark:bg-dark-bg/50 dark:border-dark-border">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary dark:border-dark-accent-purple border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-body dark:text-dark-text-secondary">Loading activities...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400 mx-auto mb-4" />
                  <p className="text-body dark:text-dark-text-secondary">{error}</p>
                  <p className="text-sm text-subtitle mt-2 dark:text-dark-text-secondary">Please try refreshing the page</p>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="p-8 text-center">
                  <Tag className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  {activities.length === 0 ? (
                    <>
                      <p className="text-body dark:text-dark-text-secondary">No activities found</p>
                      <p className="text-sm text-subtitle mt-2 dark:text-dark-text-secondary">Start logging your client interactions</p>
                    </>
                  ) : (
                    <>
                      <p className="text-body dark:text-dark-text-secondary">No matching activities</p>
                      <p className="text-sm text-subtitle mt-2 dark:text-dark-text-secondary">Try adjusting your search or filters</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-dark-border">
                  {filteredActivities.map(activity => (
                    <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-dark-bg/30 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${activity.color} flex items-center justify-center text-white`}>
                          <activity.icon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <div>
                              <h3 className="text-lg font-semibold text-title dark:text-dark-text-primary">{activity.clientName}</h3>
                              <div className="flex items-center text-sm text-subtitle dark:text-dark-text-secondary">
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
                            </div>
                          </div>
                          
                          <div className="text-sm my-2 text-body dark:text-dark-text-secondary">
                            {activity.notes || 'No notes available'}
                          </div>
                          
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {activity.tags && activity.tags.length > 0 ? (
                              activity.tags.map((tag, index) => (
                                <span 
                                  key={index} 
                                  className="bg-gray-100 dark:bg-dark-bg/50 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-subtitle dark:text-dark-text-secondary">No tags</span>
                            )}
                            
                            <div className="ml-auto text-sm text-primary dark:text-dark-accent-purple font-medium">
                              Potential: {activity.potentialValue}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!isLoading && !error && filteredActivities.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 dark:bg-dark-bg/30 border-t border-gray-200 dark:border-dark-border flex justify-between items-center">
                  <div className="text-sm text-subtitle dark:text-dark-text-secondary">
                    Showing <span className="font-medium text-gray-900 dark:text-dark-text-primary">{filteredActivities.length}</span> of <span className="font-medium text-gray-900 dark:text-dark-text-primary">{totalCount}</span> activities
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Pagination controls would go here */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </Suspense>
  )
}