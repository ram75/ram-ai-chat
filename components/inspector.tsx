'use client'

import { useStore } from '@/lib/store'
import { Node } from '@/lib/graph-types'

export function Inspector() {
  const { selection, nodes } = useStore()
  const selectedNodeId = selection.nodeIds[0]
  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null

  if (!selectedNode) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold">Inspector</h2>
        <p>No node selected</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Inspector</h2>
      <div>
        <p>
          <strong>ID:</strong> {selectedNode.id}
        </p>
        <p>
          <strong>Label:</strong> {selectedNode.label}
        </p>
        <p>
          <strong>Type:</strong> {selectedNode.type}
        </p>
        <p>
          <strong>Position:</strong> {selectedNode.position.x},{' '}
          {selectedNode.position.y}
        </p>
      </div>
    </div>
  )
}
