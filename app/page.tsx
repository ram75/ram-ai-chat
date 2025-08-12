'use client'

import { useChat } from 'ai/react'
import { Chat } from '@/components/chat'
import { ChatPanel } from '@/components/chat-panel'
import { nanoid } from '@/lib/utils'
import { AppLayout } from '@/components/app-layout'

export const runtime = 'edge'

export default function IndexPage() {
  const id = nanoid()
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({ id })

  return (
    <AppLayout
      sidebar={
        <ChatPanel
          id={id}
          isLoading={isLoading}
          stop={stop}
          append={append}
          reload={reload}
          messages={messages}
          input={input}
          setInput={setInput}
        />
      }
    >
      <Chat
        id={id}
        messages={messages}
        isLoading={isLoading}
        setInput={setInput}
      />
    </AppLayout>
  )
}
