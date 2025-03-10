'use client'

import { useEffect } from 'react'
import { useModal } from '@/context/ModalContext'
import { useRouter } from 'next/navigation'

export default function RecordActivityRedirect() {
  const { openRecordActivityModal } = useModal()
  const router = useRouter()
  
  useEffect(() => {
    // Open the modal
    openRecordActivityModal()
    
    // Redirect to home
    router.push('/')
  }, [openRecordActivityModal, router])
  
  // This component doesn't render anything, it just redirects
  return null
} 