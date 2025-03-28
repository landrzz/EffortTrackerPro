'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import GhlLink from '@/components/common/GhlLink'
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
  disabled?: boolean
}

function SidebarLink({ href, icon: Icon, label, isActive, disabled = false }: SidebarLinkProps) {
  if (disabled) {
    return (
      <div 
        className={`
          flex flex-col px-4 py-3 rounded-lg text-sm font-medium
          text-gray-400 cursor-not-allowed
          transition-all duration-150 ease-in-out
          h-[72px] mb-1
        `}
      >
        <div className="flex items-center">
          <Icon className="h-6 w-6 mr-3 text-gray-400" />
          <span className="text-base">{label}</span>
        </div>
        <div className="ml-9 mt-1">
          <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded inline-block">
            Coming Soon
          </span>
        </div>
      </div>
    )
  }
  
  return (
    <GhlLink 
      href={href}
      className={`
        flex items-center px-4 py-3 rounded-lg text-base font-medium
        ${isActive 
          ? 'bg-primary/10 text-primary' 
          : 'text-gray-600 hover:bg-gray-100'
        }
        transition-all duration-150 ease-in-out
        h-[72px] mb-1
      `}
    >
      <Icon className={`h-6 w-6 mr-3 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
      {label}
    </GhlLink>
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
      label: 'Dashboard',
      disabled: false
    },
    {
      href: '/activity-log',
      icon: ListChecks,
      label: 'Activity Log',
      disabled: false
    },
    {
      href: '/refi-opportunities',
      icon: RefreshCw,
      label: 'Refi Opportunities',
      disabled: true
    },
    {
      href: '/journeys',
      icon: Users,
      label: 'Customer Journeys',
      disabled: true
    },
    {
      href: '/leaderboard',
      icon: Trophy,
      label: 'Leaderboard',
      disabled: false
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
    <div className={`h-full ${isMobile ? 'px-4 py-6' : 'fixed w-[250px] bg-white border-r h-full py-6'}`}>
      <div className="flex items-center px-3 mb-8">
        <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <span className="ml-2 font-semibold text-gray-900">MortgageTracker</span>
      </div>
      
      <div className="space-y-0">
        {mainLinks.map((link) => (
          <SidebarLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            label={link.label}
            isActive={pathname === link.href}
            disabled={link.disabled}
          />
        ))}
      </div>
      
      <div className="mt-8 pt-8 border-t">
        <p className="px-3 mb-2 text-xs font-medium text-gray-400 uppercase">Account</p>
        <div className="space-y-0">
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