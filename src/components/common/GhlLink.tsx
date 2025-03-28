'use client'

import React from 'react'
import Link from 'next/link'
import { useGhl } from '@/context/GhlContext'

interface GhlLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  [key: string]: any
}

export default function GhlLink({ href, children, ...props }: GhlLinkProps) {
  const { appendGhlParamsToUrl } = useGhl()
  const enhancedHref = appendGhlParamsToUrl(href)
  
  return (
    <Link href={enhancedHref} {...props}>
      {children}
    </Link>
  )
}
