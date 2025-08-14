import { create } from 'zustand'
import { Edge, GraphState, Node } from './graph-types'

interface Actions {
  addNode: (node: Node) => void
  updateNode: (nodeId: string, partialNode: Partial<Node>) => void
  removeNode: (nodeId: string) => void
  addEdge: (edge: Edge) => void
  removeEdge: (edgeId: string) => void
  setSelection: (selection: { nodeIds?: string[]; edgeIds?: string[] }) => void
  undo: () => void
  redo: () => void
  snapshot: (name?: string) => void
}

const initialState: GraphState = {
  nodes: {},
  edges: {},
  selection: {
    nodeIds: [],
    edgeIds: []
  },
  aliases: {},
  history: []
}

interface Store extends GraphState {
  past: GraphState[]
  future: GraphState[]
  snapshots: Record<string, GraphState>
}

export const useStore = create<Store & Actions>(set => ({
  ...initialState,
  past: [],
  future: [],
  snapshots: {},
  addNode: node => {
    set(state => {
      const { past, ...rest } = state
      return {
        past: [...past, rest],
        future: [],
        nodes: { ...state.nodes, [node.id]: node }
      }
    })
  },
  updateNode: (nodeId, partialNode) => {
    set(state => {
      const { past, ...rest } = state
      return {
        past: [...past, rest],
        future: [],
        nodes: {
          ...state.nodes,
          [nodeId]: { ...state.nodes[nodeId], ...partialNode }
        }
      }
    })
  },
  removeNode: nodeId => {
    set(state => {
      const { past, ...rest } = state
      const newNodes = { ...state.nodes }
      delete newNodes[nodeId]
      return {
        past: [...past, rest],
        future: [],
        nodes: newNodes
      }
    })
  },
  addEdge: edge => {
    set(state => {
      const { past, ...rest } = state
      return {
        past: [...past, rest],
        future: [],
        edges: { ...state.edges, [edge.id]: edge }
      }
    })
  },
  removeEdge: edgeId => {
    set(state => {
      const { past, ...rest } = state
      const newEdges = { ...state.edges }
      delete newEdges[edgeId]
      return {
        past: [...past, rest],
        future: [],
        edges: newEdges
      }
    })
  },
  setSelection: selection => {
    set(state => ({
      selection: {
        nodeIds: selection.nodeIds ?? state.selection.nodeIds,
        edgeIds: selection.edgeIds ?? state.selection.edgeIds
      }
    }))
  },
  undo: () => {
    set(state => {
      const { past, future, ...present } = state
      if (past.length === 0) return {}
      const newPast = past.slice(0, past.length - 1)
      const newPresent = past[past.length - 1]
      return {
        ...newPresent,
        past: newPast,
        future: [present, ...future]
      }
    })
  },
  redo: () => {
    set(state => {
      const { past, future, ...present } = state
      if (future.length === 0) return {}
      const newFuture = future.slice(1)
      const newPresent = future[0]
      return {
        ...newPresent,
        past: [...past, present],
        future: newFuture
      }
    })
  },
  snapshot: name => {
    set(state => {
      const { past, future, snapshots, ...present } = state
      return {
        snapshots: {
          ...snapshots,
          [name ?? `Snapshot ${Object.keys(snapshots).length + 1}`]: present
        }
      }
    })
  }
}))
