import { type UIMessage } from 'ai'
import { z } from 'zod'
import { galActionSchema } from '@/lib/graph-types'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: UIMessage[] }
  const lastMessagePart = messages[messages.length - 1].parts[0]
  const lastMessage =
    lastMessagePart.type === 'text' ? lastMessagePart.text.toLowerCase() : ''

  let actions

  if (lastMessage === 'undo') {
    actions = [{ type: 'Undo' }]
  } else if (lastMessage === 'redo') {
    actions = [{ type: 'Redo' }]
  } else if (lastMessage === 'snapshot') {
    actions = [{ type: 'Snapshot' }]
  } else if (lastMessage === 'layout') {
    actions = [{ type: 'AutoLayout' }]
  } else if (lastMessage === 'validate') {
    actions = [{ type: 'Validate' }]
  } else if (lastMessage.startsWith('export')) {
    const format = lastMessage.split(' ')[1] as 'json' | 'png'
    actions = [{ type: 'Export', format }]
  } else if (lastMessage.startsWith('import')) {
    const graphJson = lastMessage.substring('import'.length).trim()
    actions = [{ type: 'Import', graphJson }]
  } else {
    // For now, we are returning a hardcoded response to test the flow.
    actions = [
      {
        type: 'CreateNode',
        label: 'Photosynthesis',
        position: { x: 100, y: 100 }
      },
      {
        type: 'Disambiguate',
        message: 'Which "it" are you referring to?',
        options: ['Photosynthesis', 'The sun']
      }
    ]
  }

  return new Response(JSON.stringify({ actions }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
