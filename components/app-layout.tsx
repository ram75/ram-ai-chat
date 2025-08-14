'use client'

import * as React from 'react'
import { Inspector } from './inspector'

export function AppLayout({
  sidebar,
  children
}: {
  sidebar: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-screen w-full">
      <div className="w-1/4 flex-none overflow-y-auto">{sidebar}</div>
      <main className="flex-1 bg-muted/50">{children}</main>
      <div className="w-1/4 flex-none border-l bg-gray-50">
        <Inspector />
      </div>
    </div>
  )
}
