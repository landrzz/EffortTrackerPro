'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { extractGhlParams } from '@/lib/userUtils'

// Define the context type
interface GhlContextType {
  ghlUserId: string
  ghlLocationId: string
  ghlUserName: string
  ghlUserEmail: string
  ghlUserPhone: string
  isGhlParamsLoaded: boolean
  appendGhlParamsToUrl: (url: string) => string
}

// Create the context with default values
const GhlContext = createContext<GhlContextType>({
  ghlUserId: '',
  ghlLocationId: '',
  ghlUserName: '',
  ghlUserEmail: '',
  ghlUserPhone: '',
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
    ghlUserName: string;
    ghlUserEmail: string;
    ghlUserPhone: string;
    isGhlParamsLoaded: boolean; 
    appendGhlParamsToUrl: (url: string) => string 
  }) => void 
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  
  const [ghlUserId, setGhlUserId] = useState<string>('')
  const [ghlLocationId, setGhlLocationId] = useState<string>('')
  const [ghlUserName, setGhlUserName] = useState<string>('')
  const [ghlUserEmail, setGhlUserEmail] = useState<string>('')
  const [ghlUserPhone, setGhlUserPhone] = useState<string>('')
  const [isGhlParamsLoaded, setIsGhlParamsLoaded] = useState<boolean>(false)
  
  // Function to append GHL params to any URL
  const appendGhlParamsToUrl = (url: string): string => {
    if (!ghlUserId || !ghlLocationId) return url
    
    const hasQueryParams = url.includes('?')
    const separator = hasQueryParams ? '&' : '?'
    
    let result = `${url}${separator}ghlUserId=${ghlUserId}&ghlLocationId=${ghlLocationId}`
    
    // Add other params if available
    if (ghlUserName) result += `&ghlUserName=${encodeURIComponent(ghlUserName)}`
    if (ghlUserEmail) result += `&ghlUserEmail=${encodeURIComponent(ghlUserEmail)}`
    if (ghlUserPhone) result += `&ghlUserPhone=${encodeURIComponent(ghlUserPhone)}`
    
    return result
  }
  
  // Extract GHL params from URL on initial load
  useEffect(() => {
    if (searchParams) {
      const { 
        ghlUserId: userId, 
        ghlLocationId: locationId,
        ghlUserName: userName,
        ghlUserEmail: userEmail,
        ghlUserPhone: userPhone
      } = extractGhlParams(searchParams as any)
      
      if (userId && locationId) {
        setGhlUserId(userId)
        setGhlLocationId(locationId)
        setGhlUserName(userName || '')
        setGhlUserEmail(userEmail || '')
        setGhlUserPhone(userPhone || '')
        setIsGhlParamsLoaded(true)
        
        // Store in sessionStorage for persistence
        sessionStorage.setItem('ghlUserId', userId)
        sessionStorage.setItem('ghlLocationId', locationId)
        if (userName) sessionStorage.setItem('ghlUserName', userName)
        if (userEmail) sessionStorage.setItem('ghlUserEmail', userEmail)
        if (userPhone) sessionStorage.setItem('ghlUserPhone', userPhone)
      } else {
        // Try to get from sessionStorage if not in URL
        const storedUserId = sessionStorage.getItem('ghlUserId')
        const storedLocationId = sessionStorage.getItem('ghlLocationId')
        const storedUserName = sessionStorage.getItem('ghlUserName')
        const storedUserEmail = sessionStorage.getItem('ghlUserEmail')
        const storedUserPhone = sessionStorage.getItem('ghlUserPhone')
        
        if (storedUserId && storedLocationId) {
          setGhlUserId(storedUserId)
          setGhlLocationId(storedLocationId)
          if (storedUserName) setGhlUserName(storedUserName)
          if (storedUserEmail) setGhlUserEmail(storedUserEmail)
          if (storedUserPhone) setGhlUserPhone(storedUserPhone)
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
      ghlUserName,
      ghlUserEmail,
      ghlUserPhone,
      isGhlParamsLoaded,
      appendGhlParamsToUrl
    })
  }, [ghlUserId, ghlLocationId, ghlUserName, ghlUserEmail, ghlUserPhone, isGhlParamsLoaded, setContextValue])
  
  return null
}

// Create the provider component
export function GhlProvider({ children }: GhlProviderProps) {
  const [contextValue, setContextValue] = useState<GhlContextType>({
    ghlUserId: '',
    ghlLocationId: '',
    ghlUserName: '',
    ghlUserEmail: '',
    ghlUserPhone: '',
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
