import React from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { CheckCircle, Circle, Video, FileText, Award, Map, ChevronDown, ChevronUp, Lock, Unlock } from 'lucide-react'
import Image from 'next/image'

export default function JourneysPage() {
  const journeys = [
    {
      id: 1,
      title: 'First-Time Homebuyer',
      description: 'Learn everything you need to know about buying your first home',
      progress: 60,
      image: 'https://picsum.photos/id/164/300/200',
      totalSteps: 10,
      completedSteps: 6,
      currentStep: 7,
      expanded: true,
      steps: [
        { id: 1, title: 'Understanding Your Credit Score', completed: true, type: 'video' },
        { id: 2, title: 'Saving for a Down Payment', completed: true, type: 'article' },
        { id: 3, title: 'Getting Pre-Approved', completed: true, type: 'checklist' },
        { id: 4, title: 'Finding the Right Home', completed: true, type: 'article' },
        { id: 5, title: 'Making an Offer', completed: true, type: 'video' },
        { id: 6, title: 'Getting a Home Inspection', completed: true, type: 'checklist' },
        { id: 7, title: 'Closing Process', completed: false, type: 'article', current: true },
        { id: 8, title: 'Moving In', completed: false, type: 'video', locked: false },
        { id: 9, title: 'Home Maintenance Basics', completed: false, type: 'checklist', locked: true },
        { id: 10, title: 'Building Home Equity', completed: false, type: 'article', locked: true },
      ]
    },
    {
      id: 2,
      title: 'Debt Payoff Strategy',
      description: 'Create a personalized plan to pay off your debt and build financial freedom',
      progress: 30,
      image: 'https://picsum.photos/id/1/300/200',
      totalSteps: 8,
      completedSteps: 2,
      currentStep: 3,
      expanded: false,
      steps: [
        { id: 1, title: 'Assessing Your Debt', completed: true, type: 'checklist' },
        { id: 2, title: 'Creating a Budget', completed: true, type: 'video' },
        { id: 3, title: 'Choosing a Payoff Method', completed: false, type: 'article', current: true },
        { id: 4, title: 'Negotiating with Creditors', completed: false, type: 'video', locked: false },
        { id: 5, title: 'Consolidation Options', completed: false, type: 'article', locked: true },
        { id: 6, title: 'Building Emergency Savings', completed: false, type: 'checklist', locked: true },
        { id: 7, title: 'Staying Motivated', completed: false, type: 'video', locked: true },
        { id: 8, title: 'Life After Debt', completed: false, type: 'article', locked: true },
      ]
    },
    {
      id: 3,
      title: 'Retirement Planning',
      description: 'Set yourself up for a comfortable retirement with these essential steps',
      progress: 10,
      image: 'https://picsum.photos/id/20/300/200',
      totalSteps: 9,
      completedSteps: 1,
      currentStep: 2,
      expanded: false,
      steps: [
        { id: 1, title: 'Retirement Goals Assessment', completed: true, type: 'checklist' },
        { id: 2, title: 'Understanding Retirement Accounts', completed: false, type: 'video', current: true },
        { id: 3, title: 'Calculating Retirement Needs', completed: false, type: 'article', locked: false },
        { id: 4, title: 'Social Security Benefits', completed: false, type: 'video', locked: true },
        { id: 5, title: 'Investment Strategies', completed: false, type: 'article', locked: true },
        { id: 6, title: 'Tax Planning for Retirement', completed: false, type: 'video', locked: true },
        { id: 7, title: 'Healthcare in Retirement', completed: false, type: 'article', locked: true },
        { id: 8, title: 'Estate Planning Basics', completed: false, type: 'checklist', locked: true },
        { id: 9, title: 'Transitioning to Retirement', completed: false, type: 'video', locked: true },
      ]
    }
  ]
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-darkNavy">Financial Journeys</h1>
        <p className="text-gray-600 mt-1">Step-by-step guides to improve your financial life</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {journeys.map((journey) => (
          <div key={journey.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative h-40 w-full">
              <Image 
                src={journey.image}
                alt={journey.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h2 className="text-xl font-bold">{journey.title}</h2>
                <p className="text-sm opacity-90">{journey.description}</p>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">
                    {journey.completedSteps} of {journey.totalSteps} steps completed
                  </span>
                </div>
                <div className="text-sm font-medium">{journey.progress}% Complete</div>
              </div>
              
              <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${journey.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <button className="btn-primary">
                  Continue Journey
                </button>
                <button className="text-gray-500 flex items-center text-sm">
                  {journey.expanded ? (
                    <>
                      Hide Steps
                      <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show Steps
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
              
              {journey.expanded && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <div className="space-y-2">
                    {journey.steps.map((step) => (
                      <div 
                        key={step.id} 
                        className={`flex items-center p-2 rounded-lg ${
                          step.current ? 'bg-primary bg-opacity-10 border border-primary' : 
                          step.locked ? 'bg-gray-50 opacity-70' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="mr-3">
                          {step.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : step.locked ? (
                            <Lock className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className={`font-medium ${step.current ? 'text-primary' : ''}`}>
                              {step.title}
                            </span>
                            
                            {step.current && (
                              <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            {step.type === 'video' && <Video className="h-3 w-3 mr-1" />}
                            {step.type === 'article' && <FileText className="h-3 w-3 mr-1" />}
                            {step.type === 'checklist' && <CheckCircle className="h-3 w-3 mr-1" />}
                            <span>
                              {step.type === 'video' ? 'Video Lesson' : 
                               step.type === 'article' ? 'Article' : 'Interactive Checklist'} 
                              • {step.completed ? 'Completed' : step.current ? 'In Progress' : step.locked ? 'Locked' : 'Not Started'}
                            </span>
                          </div>
                        </div>
                        
                        <button 
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            step.completed ? 'bg-gray-100 text-gray-600' : 
                            step.current ? 'bg-primary text-white' : 
                            step.locked ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-700'
                          }`}
                          disabled={step.locked}
                        >
                          {step.completed ? 'Review' : step.current ? 'Continue' : 'Start'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  )
} 