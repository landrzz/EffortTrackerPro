'use client'

import React, { useState, useRef } from 'react'
import { 
  Calendar, 
  DollarSign, 
  FileText, 
  Tag, 
  HelpCircle, 
  Users, 
  Phone, 
  Mail, 
  MessageSquare, 
  Home, 
  Building, 
  Briefcase, 
  X,
  Save,
  CheckCircle,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { createActivity } from '@/lib/activityUtils'
import { useGhl } from '@/context/GhlContext'

interface RecordActivityModalProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
}

export default function RecordActivityModal({ isOpen, onClose, userId }: RecordActivityModalProps) {
  if (!isOpen) return null
  
  const { ghlUserId, ghlLocationId } = useGhl()
  
  const activityTypes = [
    { id: 'call', name: 'Phone Call', icon: Phone, color: 'bg-blue-500' },
    { id: 'email', name: 'Email', icon: Mail, color: 'bg-purple-500' },
    { id: 'meeting', name: 'Meeting', icon: Users, color: 'bg-green-500' },
    { id: 'message', name: 'Text/Message', icon: MessageSquare, color: 'bg-amber-500' },
    { id: 'visit', name: 'Site Visit', icon: Home, color: 'bg-red-500' },
    { id: 'proposal', name: 'Proposal', icon: Briefcase, color: 'bg-indigo-500' },
  ]
  
  const clientTypes = [
    { id: 'individual', name: 'Individual', icon: Users },
    { id: 'business', name: 'Business', icon: Building },
  ]
  
  const statusOptions = [
    { id: 'approved', name: 'Approved' },
    { id: 'follow-up-required', name: 'Follow-up Required' },
    { id: 'pending-response', name: 'Pending Response' },
    { id: 'preparing-terms', name: 'Preparing Terms' },
    { id: 'proposal-sent', name: 'Proposal Sent' },
    { id: 'waiting-for-documents', name: 'Waiting for Documents' },
  ]
  
  // Form state
  const [selectedActivityType, setSelectedActivityType] = useState('')
  const [selectedClientType, setSelectedClientType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('approved')
  const [clientName, setClientName] = useState('')
  const [activityDate, setActivityDate] = useState(new Date().toISOString().substr(0, 10))
  const [potentialValue, setPotentialValue] = useState('')
  const [notes, setNotes] = useState('')
  const [tags, setTags] = useState('')
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId && (!ghlUserId || !ghlLocationId)) {
      setSubmitError('User identification is missing. Please try again later.')
      console.error('Missing user identification:', { userId, ghlUserId, ghlLocationId })
      return
    }
    
    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess(false)
    
    try {
      // First, if we don't have a userId but have GHL params, try to get the user profile
      let userProfileId = userId || '';
      
      if (!userProfileId && ghlUserId && ghlLocationId) {
        try {
          // Import getUserByGhlIds dynamically to avoid circular dependencies
          const { getUserByGhlIds } = await import('@/lib/userUtils');
          const userProfile = await getUserByGhlIds(ghlUserId, ghlLocationId);
          
          if (userProfile) {
            userProfileId = userProfile.id;
            console.log('Found user profile ID from GHL params:', userProfileId);
          } else {
            setSubmitError('Could not find your user profile. Please try again later.');
            console.error('No user profile found for GHL params:', { ghlUserId, ghlLocationId });
            setIsSubmitting(false);
            return;
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setSubmitError('Error finding your user profile. Please try again later.');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Prepare activity data
      const activityData = {
        user_profile_id: userProfileId,
        ghl_user_id: ghlUserId || '',
        ghl_location_id: ghlLocationId || '',
        activity_type: selectedActivityType,
        client_name: clientName,
        client_type: selectedClientType,
        activity_date: new Date(activityDate).toISOString(), // Convert to ISO string for timestamp
        potential_value: potentialValue ? parseFloat(potentialValue) : null,
        notes: notes || null,
        status: selectedStatus,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : null
      }
      
      console.log('Submitting activity data:', activityData)
      
      // Save activity to database
      const result = await createActivity(activityData)
      
      if (result) {
        console.log('Activity saved successfully:', result)
        setSubmitSuccess(true)
        
        // Reset form after successful submission
        setSelectedActivityType('')
        setSelectedClientType('')
        setSelectedStatus('approved')
        setClientName('')
        setActivityDate(new Date().toISOString().substr(0, 10))
        setPotentialValue('')
        setNotes('')
        setTags('')
        
        // Close modal after a short delay
        setTimeout(() => {
          onClose()
          setSubmitSuccess(false)
        }, 1500)
      } else {
        console.error('Failed to save activity, no result returned')
        setSubmitError('Failed to save activity. Please try again.')
      }
    } catch (error) {
      console.error('Error saving activity:', error)
      setSubmitError(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto relative">
        {/* Close button - positioned absolute for small screens */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
          aria-label="Close"
          disabled={isSubmitting}
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-5 z-[5]">
          <h2 className="text-xl font-bold text-darkNavy pr-6">Record Prospecting Activity</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-4 md:p-6 space-y-6">
            {submitSuccess && (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">Activity Saved</h4>
                  <p className="text-xs text-green-700 mt-1">
                    Your activity has been successfully recorded.
                  </p>
                </div>
              </div>
            )}
            
            {submitError && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Error</h4>
                  <p className="text-xs text-red-700 mt-1">{submitError}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-darkNavy">Activity Details</h3>
              <p className="text-sm text-gray-500">Record your prospecting activity to track client interactions</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client/Prospect Name
                </label>
                <input 
                  type="text" 
                  placeholder="Enter client or prospect name" 
                  className="px-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {clientTypes.map(clientType => (
                    <label 
                      key={clientType.id}
                      className={`relative flex items-center p-3 bg-white border ${
                        selectedClientType === clientType.id 
                          ? 'border-primary border-2 bg-primary/5 shadow-sm' 
                          : 'border-gray-200'
                      } rounded-lg cursor-pointer hover:border-primary transition-colors`}
                    >
                      <input 
                        type="radio" 
                        name="clientType" 
                        value={clientType.id}
                        className="sr-only" 
                        onChange={() => setSelectedClientType(clientType.id)}
                        required
                        disabled={isSubmitting}
                      />
                      <clientType.icon className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="text-sm">{clientType.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {activityTypes.map(activityType => (
                    <label 
                      key={activityType.id}
                      className={`relative flex flex-col items-center p-3 bg-white border ${
                        selectedActivityType === activityType.id 
                          ? 'border-primary border-2 bg-primary/5 shadow-sm' 
                          : 'border-gray-200'
                      } rounded-lg cursor-pointer hover:border-primary transition-colors`}
                    >
                      <input 
                        type="radio" 
                        name="activityType" 
                        value={activityType.id}
                        className="sr-only" 
                        onChange={() => setSelectedActivityType(activityType.id)}
                        required
                        disabled={isSubmitting}
                      />
                      <div className={`h-10 w-10 rounded-full ${activityType.color} flex items-center justify-center text-white mb-2`}>
                        <activityType.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm">{activityType.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input 
                      type="date" 
                      className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                      value={activityDate}
                      onChange={(e) => setActivityDate(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Potential Value
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input 
                      type="text" 
                      placeholder="0.00" 
                      className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                      value={potentialValue}
                      onChange={(e) => setPotentialValue(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <textarea 
                    placeholder="Describe the interaction and any key takeaways or follow-up actions" 
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary" 
                    required
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isSubmitting}
                  ></textarea>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Add tags separated by commas" 
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Example: potential, follow-up, new-lead</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                    required
                    disabled={isSubmitting}
                  >
                    {statusOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">Current status of this activity</p>
              </div>
              
              {/* <div className="flex items-center space-x-2">
                <input type="checkbox" id="followup" className="h-4 w-4 text-primary rounded" />
                <label htmlFor="followup" className="text-sm text-gray-700">Schedule follow-up reminder</label>
              </div> */}
              
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start">
                <HelpCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">Prospecting Tips</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Detailed activity records help track your client journey and improve follow-up effectiveness.
                    Activities logged here will appear in your activity timeline and reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 md:p-5 flex flex-col sm:flex-row justify-end gap-3 z-[5]">
            <button 
              type="button"
              onClick={onClose}
              className="btn-secondary w-full sm:w-auto order-2 sm:order-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className={`btn-primary w-full sm:w-auto order-1 sm:order-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-pulse">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Activity
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}