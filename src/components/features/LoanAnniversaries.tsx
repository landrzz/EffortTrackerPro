'use client'

import React from 'react'
import Image from 'next/image'
import { Calendar, ChevronRight, Gift } from 'lucide-react'

interface AnniversaryItem {
  id: number
  name: string
  date: string
  years: number
  image: string
}

export default function LoanAnniversaries() {
  const anniversaries: AnniversaryItem[] = [
    {
      id: 1,
      name: "Home Purchase",
      date: "Oct 15, 2023",
      years: 1,
      image: "https://picsum.photos/id/164/300/300"
    },
    {
      id: 2,
      name: "Auto Loan",
      date: "Nov 3, 2020",
      years: 4,
      image: "https://picsum.photos/id/111/300/300"
    },
    {
      id: 3,
      name: "Business Loan",
      date: "Dec 10, 2021",
      years: 3,
      image: "https://picsum.photos/id/28/300/300"
    }
  ]
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Gift className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-semibold text-darkNavy">Loan Anniversaries</h3>
        </div>
        <button className="text-xs text-primary font-medium">View All</button>
      </div>
      
      <div className="space-y-4">
        {anniversaries.map((item) => (
          <div key={item.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h4 className="text-sm font-medium text-darkNavy">{item.name}</h4>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{item.date} ({item.years} {item.years === 1 ? 'year' : 'years'})</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-xs font-medium text-primary mr-1">
                {item.years === 1 ? 'Send Card' : 'Details'}
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full py-2 text-sm text-primary font-medium flex items-center justify-center hover:bg-primary hover:bg-opacity-5 rounded-lg transition-colors">
          Add Anniversary
        </button>
      </div>
    </div>
  )
} 