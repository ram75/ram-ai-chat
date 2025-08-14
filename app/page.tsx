'use client'

import { useRef, useState } from 'react'
import { Chat } from '@/components/chat'
import { ChatPanel } from '@/components/chat-panel'
import { JointCanvas, JointCanvasHandle } from '@/components/joint-canvas'
import { nanoid } from '@/lib/utils'
import { AppLayout } from '@/components/app-layout'
import { type UIMessage } from 'ai'
import { galSchema } from '@/lib/graph-types'

export const runtime = 'edge'

export default function IndexPage() {
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const jointCanvasRef = useRef<JointCanvasHandle>(null)

  const append = async (message: UIMessage) => {
    setMessages(currentMessages => [...currentMessages, message])
    setIsLoading(true)

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: [...messages, message] })
    })

    setIsLoading(false)

    if (response.ok) {
      const json = await response.json()
      const parsed = galSchema.safeParse(json)
      if (parsed.success) {
        if (jointCanvasRef.current) {
          const executorMessages = jointCanvasRef.current.execute(
            parsed.data.actions
          )
          const newMessages = [
            ...messages,
            {
              id: nanoid(),
              role: 'assistant',
              parts: [
                {
                  type: 'text',
                  text: `AI: Executed ${parsed.data.actions.length} actions.`
                }
              ]
            } as UIMessage
          ]
          if (executorMessages && executorMessages.length > 0) {
            newMessages.push({
              id: nanoid(),
              role: 'assistant',
              parts: [
                {
                  type: 'text',
                  text: executorMessages.join('\n')
                }
              ]
            } as UIMessage)
          }
          setMessages(newMessages)
        }
      } else {
        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            role: 'assistant',
            parts: [
              {
                type: 'text',
                text: `AI: Error parsing response.`
              }
            ]
          } as UIMessage
        ])
      }
    }
  }

  return (
    <AppLayout
      sidebar={
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto">
            <Chat
              messages={messages}
              isLoading={isLoading}
              setInput={setInput}
            />
          </div>
          <div className="flex-none">
            <ChatPanel
              isLoading={isLoading}
              stop={() => {}}
              append={append}
              reload={() => {}}
              messages={messages}
              input={input}
              setInput={setInput}
            />
          </div>
        </div>
      }
    >
      <JointCanvas ref={jointCanvasRef} />
    </AppLayout>
  )
}
