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
          text-gray-400 dark:text-gray-500 cursor-not-allowed
          transition-all duration-150 ease-in-out
          h-[72px] mb-1
        `}
      >
        <div className="flex items-center">
          <Icon className="h-6 w-6 mr-3 text-gray-400 dark:text-gray-500" />
          <span className="text-base">{label}</span>
        </div>
        <div className="ml-9 mt-1">
          <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded inline-block">
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
          ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-white' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
        transition-all duration-150 ease-in-out
        h-[72px] mb-1
      `}
    >
      <Icon className={`h-6 w-6 mr-3 ${isActive ? 'text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} />
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
      label: 'Profile'
    }
  ]
  
  return (
    <div className={`h-full ${isMobile ? 'px-4 py-6' : 'fixed left-0 top-0 w-[250px] bg-white dark:bg-darkNavy border-r border-gray-200 dark:border-gray-700 h-full py-6 z-10 overflow-hidden'}`}>
      <div className="flex items-center px-3 mb-8">
        <span className="font-bold text-2xl tracking-wider bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">PACE</span>
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
      
      <div className="mt-8 pt-8 border-t dark:border-gray-700">
        <p className="px-3 mb-2 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">Account</p>
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