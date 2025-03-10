'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ListChecks, 
  RefreshCw, 
  Users, 
  BarChart3, 
  Settings,
  Trophy
} from 'lucide-react'

interface SidebarLinkProps {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
}

function SidebarLink({ href, icon: Icon, label, isActive }: SidebarLinkProps) {
  return (
    <Link 
      href={href}
      className={`
        flex items-center px-3 py-2 rounded-lg text-sm font-medium
        ${isActive 
          ? 'bg-primary/10 text-primary' 
          : 'text-gray-600 hover:bg-gray-100'
        }
        transition-all duration-150 ease-in-out
      `}
    >
      <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
      {label}
    </Link>
  )
}

interface SidebarProps {
  isMobile?: boolean
}

export default function Sidebar({ isMobile = false }: SidebarProps) {
  const pathname = usePathname()
  
  const mainLinks = [
    {
      href: '/',
      icon: LayoutDashboard,
      label: 'Dashboard'
    },
    {
      href: '/activity-log',
      icon: ListChecks,
      label: 'Activity Log'
    },
    {
      href: '/refi-opportunities',
      icon: RefreshCw,
      label: 'Refi Opportunities'
    },
    {
      href: '/journeys',
      icon: Users,
      label: 'Customer Journeys'
    },
    {
      href: '/leaderboard',
      icon: Trophy,
      label: 'Leaderboard'
    }
  ]
  
  const secondaryLinks = [
    {
      href: '/points-20-',
      icon: BarChart3,
      label: 'Analytics'
    },
    {
      href: '/user-profile-cm-',
      icon: Settings,
      label: 'Settings'
    }
  ]
  
  return (
    <div className={`h-full ${isMobile ? 'px-4 py-6' : 'fixed w-[200px] bg-white border-r h-full py-6'}`}>
      <div className="flex items-center px-3 mb-8">
        <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <span className="ml-2 font-semibold text-gray-900">MortgageTracker</span>
      </div>
      
      <div className="space-y-1">
        {mainLinks.map((link) => (
          <SidebarLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            label={link.label}
            isActive={pathname === link.href}
          />
        ))}
      </div>
      
      <div className="mt-8 pt-8 border-t">
        <p className="px-3 mb-2 text-xs font-medium text-gray-400 uppercase">Account</p>
        <div className="space-y-1">
          {secondaryLinks.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              isActive={pathname === link.href}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 