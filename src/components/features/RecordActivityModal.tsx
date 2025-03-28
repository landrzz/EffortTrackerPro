'use client'

import React, { useState } from 'react'
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
  X
} from 'lucide-react'

interface RecordActivityModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RecordActivityModal({ isOpen, onClose }: RecordActivityModalProps) {
  if (!isOpen) return null
  
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
  
  const [selectedActivityType, setSelectedActivityType] = useState('')
  const [selectedClientType, setSelectedClientType] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Process form data here
    
    // Close the modal
    onClose()
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto relative">
        {/* Close button - positioned absolute for small screens */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-5 z-[5]">
          <h2 className="text-xl font-bold text-darkNavy pr-6">Record Prospecting Activity</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-4 md:p-6 space-y-6">
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
                        selectedClientType === clientType.id ? 'border-primary' : 'border-gray-200'
                      } rounded-lg cursor-pointer hover:border-primary transition-colors`}
                    >
                      <input 
                        type="radio" 
                        name="clientType" 
                        value={clientType.id}
                        className="sr-only" 
                        onChange={() => setSelectedClientType(clientType.id)}
                        required
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
                        selectedActivityType === activityType.id ? 'border-primary' : 'border-gray-200'
                      } rounded-lg cursor-pointer hover:border-primary transition-colors`}
                    >
                      <input 
                        type="radio" 
                        name="activityType" 
                        value={activityType.id}
                        className="sr-only" 
                        onChange={() => setSelectedActivityType(activityType.id)}
                        required
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
                      defaultValue={new Date().toISOString().substr(0, 10)}
                      required
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
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Example: potential, follow-up, new-lead</p>
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
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn-primary w-full sm:w-auto order-1 sm:order-2"
            >
              Save Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 