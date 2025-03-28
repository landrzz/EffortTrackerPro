import React from 'react'
import MainLayout from '@/components/layout/MainLayout'
import FormLayout from '@/components/layout/FormLayout'
import { User, Mail, Phone, Lock, Bell, CreditCard, Shield, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

export default function UserProfilePage() {
  return (
    <MainLayout>
      <FormLayout 
        title="User Profile" 
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Settings', path: '/settings' },
          { label: 'User Profile', path: '/user-profile-cm-' },
        ]}
      >
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image 
                src="https://picsum.photos/id/237/200/200" 
                alt="Profile Picture"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">Chris Miller</h2>
              <p className="text-gray-600">Member since September 2021</p>
              <div className="flex items-center justify-center md:justify-start mt-2 space-x-2">
                <div className="px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded-md font-medium">
                  Silver Member
                </div>
                <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md font-medium">
                  Verified
                </div>
              </div>
            </div>
            
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hidden">
              {/* Change Photo button hidden for now */}
              Change Photo
            </button>
          </div>
          
          <div className="border-b border-gray-200 pb-2">
            <div className="flex space-x-8 overflow-x-auto">
              <button className="text-primary border-b-2 border-primary pb-2 font-medium">
                Personal Info
              </button>
              <button className="text-gray-500 hover:text-gray-700 pb-2">
                Security
              </button>
              <button className="text-gray-500 hover:text-gray-700 pb-2">
                Notifications
              </button>
              {/* Payment Methods button hidden as requested */}
              <button className="text-gray-500 hover:text-gray-700 pb-2 hidden">
                Payment Methods
              </button>
              <button className="text-gray-500 hover:text-gray-700 pb-2">
                Privacy
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input 
                    type="text" 
                    defaultValue="Chris" 
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input 
                    type="text" 
                    defaultValue="Miller" 
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input 
                    type="email" 
                    defaultValue="chris.miller@example.com" 
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">This email is used for notifications and account recovery</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input 
                    type="tel" 
                    defaultValue="(555) 123-4567" 
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary" 
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hidden">
                  {/* Change Password section hidden for now */}
                  <div className="flex items-start">
                    <Lock className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-gray-600">Update your password to maintain account security</p>
                    </div>
                  </div>
                  <button className="btn-secondary text-sm">Update</button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button className="btn-primary text-sm">Enable</button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start">
                    <Bell className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Notification Preferences</h4>
                      <p className="text-sm text-gray-600">Manage how you receive updates and alerts</p>
                    </div>
                  </div>
                  <button className="btn-secondary text-sm">Manage</button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hidden">
                  {/* Payment Methods section hidden for now */}
                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Payment Methods</h4>
                      <p className="text-sm text-gray-600">Update your billing information and view payment history</p>
                    </div>
                  </div>
                  <button className="btn-secondary text-sm">Manage</button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="marketing-emails" 
                      defaultChecked={true}
                      className="h-4 w-4 text-primary rounded" 
                    />
                    <label htmlFor="marketing-emails" className="ml-2 text-sm text-gray-700">
                      Receive marketing emails
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="product-updates" 
                      defaultChecked={true}
                      className="h-4 w-4 text-primary rounded" 
                    />
                    <label htmlFor="product-updates" className="ml-2 text-sm text-gray-700">
                      Receive product updates and announcements
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="data-sharing" 
                      defaultChecked={false}
                      className="h-4 w-4 text-primary rounded" 
                    />
                    <label htmlFor="data-sharing" className="ml-2 text-sm text-gray-700">
                      Allow data sharing with trusted partners
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="activity-tracking" 
                      defaultChecked={true}
                      className="h-4 w-4 text-primary rounded" 
                    />
                    <label htmlFor="activity-tracking" className="ml-2 text-sm text-gray-700">
                      Track activities for personalized experience
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormLayout>
    </MainLayout>
  )
} 