import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ModalProvider } from '@/context/ModalContext'
import { NotificationProvider } from '@/context/NotificationContext'

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
        <ModalProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ModalProvider>
      </body>
    </html>
  )
} 