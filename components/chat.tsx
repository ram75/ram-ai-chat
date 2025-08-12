'use client'

import { type Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'

export interface ChatProps extends React.ComponentProps<'div'> {
  messages: Message[]
  isLoading: boolean
  setInput: (input: string) => void
  id?: string
}

export function Chat({ messages, isLoading, setInput, className }: ChatProps) {
  return (
    <>
      <div className={cn('pb-10 pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
    </>
  )
}
