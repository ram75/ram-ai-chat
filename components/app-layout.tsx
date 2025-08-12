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
        <div className="flex-1">
          {/* Empty div to push content to bottom */}
        </div>
        <div>{sidebar}</div>
      </div>
      <main className="w-[80%] flex-1 flex-col bg-muted/50 p-4">
        {children}
      </main>
    </div>
  )
}
