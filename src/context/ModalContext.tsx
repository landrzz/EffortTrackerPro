'use client'

import React, { createContext, useState, useContext } from 'react'
import RecordActivityModal from '@/components/features/RecordActivityModal'

interface ModalContextType {
  openRecordActivityModal: () => void
  closeRecordActivityModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isRecordActivityModalOpen, setIsRecordActivityModalOpen] = useState(false)

  const openRecordActivityModal = () => setIsRecordActivityModalOpen(true)
  const closeRecordActivityModal = () => setIsRecordActivityModalOpen(false)

  return (
    <ModalContext.Provider 
      value={{ 
        openRecordActivityModal, 
        closeRecordActivityModal 
      }}
    >
      {children}
      <RecordActivityModal 
        isOpen={isRecordActivityModalOpen} 
        onClose={closeRecordActivityModal} 
      />
    </ModalContext.Provider>
  )
}

// Custom hook to use the modal context
export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
} 