import { GalAction, GraphState } from './graph-types'
import { useStore } from './store'
import { nanoid } from 'nanoid'
import * as joint from '@joint/core'
import { DirectedGraph } from '@joint/layout-directed-graph'
import { validateGraph } from './validation'

type NodeReference = string | { id: string } | { label: string }

function resolveNode(
  nodes: Record<string, any>,
  ref: NodeReference
): string | undefined {
  if (typeof ref === 'string') {
    // Try resolving by ID first, then by label
    if (nodes[ref]) {
      return ref
    }
    const node = Object.values(nodes).find(n => n.label === ref)
    return node?.id
  }
  if ('id' in ref) {
    return nodes[ref.id] ? ref.id : undefined
  }
  if ('label' in ref) {
    const node = Object.values(nodes).find(n => n.label === ref.label)
    return node?.id
  }
  return undefined
}

export class GraphExecutor {
  private graph: joint.dia.Graph

  constructor(graph: joint.dia.Graph) {
    this.graph = graph
  }

  public execute(actions: GalAction[]): string[] {
    const { getState, setState } = useStore
    const messages: string[] = []

    for (const action of actions) {
      const currentState = getState()
      switch (action.type) {
        case 'CreateNode': {
          const id = nanoid()
          useStore.getState().addNode({
            id,
            label: action.label,
            type: action.nodeType ?? 'Concept',
            position: action.position ?? { x: 200, y: 200 }
          })
          break
        }
        case 'Connect': {
          const sourceId = resolveNode(currentState.nodes, action.from as any)
          const targetId = resolveNode(currentState.nodes, action.to as any)

          if (sourceId && targetId) {
            const id = nanoid()
            useStore.getState().addEdge({
              id,
              sourceId,
              targetId,
              label: action.label,
              type: action.edgeType
            })
          }
          break
        }
        case 'RenameNode': {
          const nodeId = resolveNode(
            currentState.nodes,
            action.nodeRef as any
          )
          if (nodeId) {
            useStore.getState().updateNode(nodeId, { label: action.newLabel })
          }
          break
        }
        case 'Delete': {
          const nodeId = resolveNode(currentState.nodes, action.ref as any)
          if (nodeId) {
            useStore.getState().removeNode(nodeId)
          }
          break
        }
        case 'Undo': {
          useStore.getState().undo()
          break
        }
        case 'Redo': {
          useStore.getState().redo()
          break
        }
        case 'Snapshot': {
          useStore.getState().snapshot(action.name)
          break
        }
        case 'Disambiguate': {
          messages.push(
            `${action.message} Options: ${action.options.join(', ')}`
          )
          break
        }
        case 'Style': {
          const targetId = resolveNode(
            currentState.nodes,
            action.targetRef as any
          )
          if (targetId) {
            useStore.getState().updateNode(targetId, { attrs: action.attrs })
          }
          break
        }
        case 'AutoLayout': {
          DirectedGraph.layout(this.graph, {
            rankDir: 'TB'
          })
          break
        }
        case 'Validate': {
          const issues = validateGraph(currentState)
          if (issues.length > 0) {
            messages.push(
              `Validation failed: ${issues.map(i => i.message).join(', ')}`
            )
          } else {
            messages.push('Validation successful.')
          }
          break
        }
        case 'Export': {
          if (action.format === 'json') {
            const graphJson = JSON.stringify(currentState, null, 2)
            console.log(graphJson)
            messages.push('Graph exported to console.')
          }
          break
        }
        case 'Import': {
          const graphState = JSON.parse(action.graphJson)
          setState(graphState)
          break
        }
      }
    }
    return messages
  }
}
