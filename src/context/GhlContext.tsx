'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { extractGhlParams } from '@/lib/userUtils'

// Define the context type
interface GhlContextType {
  ghlUserId: string
  ghlLocationId: string
  isGhlParamsLoaded: boolean
  appendGhlParamsToUrl: (url: string) => string
}

// Create the context with default values
const GhlContext = createContext<GhlContextType>({
  ghlUserId: '',
  ghlLocationId: '',
  isGhlParamsLoaded: false,
  appendGhlParamsToUrl: (url) => url
})

// Provider props type
interface GhlProviderProps {
  children: ReactNode
}

// Create a client component that safely uses useSearchParams
function GhlContextContent({ setContextValue }: { 
  setContextValue: (value: { 
    ghlUserId: string; 
    ghlLocationId: string; 
    isGhlParamsLoaded: boolean; 
    appendGhlParamsToUrl: (url: string) => string 
  }) => void 
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  
  const [ghlUserId, setGhlUserId] = useState<string>('')
  const [ghlLocationId, setGhlLocationId] = useState<string>('')
  const [isGhlParamsLoaded, setIsGhlParamsLoaded] = useState<boolean>(false)
  
  // Function to append GHL params to any URL
  const appendGhlParamsToUrl = (url: string): string => {
    if (!ghlUserId || !ghlLocationId) return url
    
    const hasQueryParams = url.includes('?')
    const separator = hasQueryParams ? '&' : '?'
    
    return `${url}${separator}ghlUserId=${ghlUserId}&ghlLocationId=${ghlLocationId}`
  }
  
  // Extract GHL params from URL on initial load
  useEffect(() => {
    if (searchParams) {
      const { ghlUserId: userId, ghlLocationId: locationId } = extractGhlParams(searchParams as any)
      
      if (userId && locationId) {
        setGhlUserId(userId)
        setGhlLocationId(locationId)
        setIsGhlParamsLoaded(true)
        
        // Store in sessionStorage for persistence
        sessionStorage.setItem('ghlUserId', userId)
        sessionStorage.setItem('ghlLocationId', locationId)
      } else {
        // Try to get from sessionStorage if not in URL
        const storedUserId = sessionStorage.getItem('ghlUserId')
        const storedLocationId = sessionStorage.getItem('ghlLocationId')
        
        if (storedUserId && storedLocationId) {
          setGhlUserId(storedUserId)
          setGhlLocationId(storedLocationId)
          setIsGhlParamsLoaded(true)
          
          // If we have stored params but they're not in the URL, add them
          if (pathname && !searchParams.has('ghlUserId')) {
            const newUrl = appendGhlParamsToUrl(pathname)
            router.replace(newUrl)
          }
        }
      }
    }
  }, [searchParams, pathname, router])

  // Update the context value whenever our state changes
  useEffect(() => {
    setContextValue({
      ghlUserId,
      ghlLocationId,
      isGhlParamsLoaded,
      appendGhlParamsToUrl
    })
  }, [ghlUserId, ghlLocationId, isGhlParamsLoaded, setContextValue])
  
  return null
}

// Create the provider component
export function GhlProvider({ children }: GhlProviderProps) {
  const [contextValue, setContextValue] = useState<GhlContextType>({
    ghlUserId: '',
    ghlLocationId: '',
    isGhlParamsLoaded: false,
    appendGhlParamsToUrl: (url) => url
  })
  
  return (
    <GhlContext.Provider value={contextValue}>
      <Suspense fallback={null}>
        <GhlContextContent setContextValue={setContextValue} />
      </Suspense>
      {children}
    </GhlContext.Provider>
  )
}

// Custom hook to use the GHL context
export function useGhl() {
  const context = useContext(GhlContext)
  
  if (context === undefined) {
    throw new Error('useGhl must be used within a GhlProvider')
  }
  
  return context
}
