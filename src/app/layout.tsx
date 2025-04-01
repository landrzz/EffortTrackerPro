import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ModalProvider } from '@/context/ModalContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { AuthProvider } from '@/context/auth/AuthContext'
import { GhlProvider } from '@/context/GhlContext'
import dynamic from 'next/dynamic'

// Import DebugPanel with dynamic import to avoid SSR issues
const DebugPanel = dynamic(() => import('@/components/debug/DebugPanel'), { ssr: false })

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Activity Tracking Dashboard',
  description: 'Track your activities and view progress analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-bgGray min-h-screen`}>
        <GhlProvider>
          <ModalProvider>
            <NotificationProvider>
              <AuthProvider>
                {children}
                <DebugPanel />
              </AuthProvider>
            </NotificationProvider>
          </ModalProvider>
        </GhlProvider>
      </body>
    </html>
  )
} 