import { type UIMessage } from 'ai'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { IconRefresh, IconStop } from '@/components/ui/icons'
import { nanoid } from '@/lib/utils'

export interface ChatPanelProps {
  isLoading: boolean
  stop: () => void
  append: (message: UIMessage) => void
  reload: () => void
  messages: UIMessage[]
  input: string
  setInput: (value: string) => void
}

export function ChatPanel({
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages
}: ChatPanelProps) {
  return (
    <div className="w-full">
      <div className="flex h-10 items-center justify-center">
        {isLoading ? (
          <Button
            variant="outline"
            onClick={() => stop()}
            className="bg-background"
          >
            <IconStop className="mr-2" />
            Stop generating
          </Button>
        ) : (
          messages?.length > 0 && (
            <Button
              variant="outline"
              onClick={() => reload()}
              className="bg-background"
            >
              <IconRefresh className="mr-2" />
              Regenerate response
            </Button>
          )
        )}
      </div>
      <div className="space-y-4 border-t bg-background px-4 py-2 md:py-4">
        <PromptForm
          onSubmit={async value => {
            await append({
              id: nanoid(),
              role: 'user',
              parts: [{ type: 'text', text: value }]
            })
          }}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
        />
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() =>
              append({
                id: nanoid(),
                role: 'user',
                parts: [{ type: 'text', text: 'undo' }]
              })
            }
          >
            Undo
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              append({
                id: nanoid(),
                role: 'user',
                parts: [{ type: 'text', text: 'redo' }]
              })
            }
          >
            Redo
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              append({
                id: nanoid(),
                role: 'user',
                parts: [{ type: 'text', text: 'snapshot' }]
              })
            }
          >
            Snapshot
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              append({
                id: nanoid(),
                role: 'user',
                parts: [{ type: 'text', text: 'layout' }]
              })
            }
          >
            Layout
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              append({
                id: nanoid(),
                role: 'user',
                parts: [{ type: 'text', text: 'validate' }]
              })
            }
          >
            Validate
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              append({
                id: nanoid(),
                role: 'user',
                parts: [{ type: 'text', text: 'export json' }]
              })
            }
          >
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const graphJson = prompt('Paste graph JSON here:')
              if (graphJson) {
                append({
                  id: nanoid(),
                  role: 'user',
                  parts: [{ type: 'text', text: `import ${graphJson}` }]
                })
              }
            }}
          >
            Import
          </Button>
        </div>
      </div>
    </div>
  )
}
