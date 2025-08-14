'use client'

import * as React from 'react'

export function AppLayout({
  sidebar,
  children
}: {
  sidebar: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-screen pt-[10vh]">
      <div className="sidebar">
        <div className="mt-auto">{sidebar}</div>
      </div>
      <main className="w-[80%] flex-1 flex-col bg-muted/50 p-4">
        {children}
      </main>
    </div>
  )
}
