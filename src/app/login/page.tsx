import React from 'react'
import GoogleAuth from '@/components/auth/GoogleAuth'
import MainLayout from '@/components/layout/MainLayout'

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <GoogleAuth />
      </div>
    </MainLayout>
  )
}
