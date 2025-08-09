import React from 'react'
import { cn } from '@/lib/client-utils'

export default function H1({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h1 className={cn('font-medium text-2xl leading-6', className)}>
      {children}
    </h1>
  )
}
