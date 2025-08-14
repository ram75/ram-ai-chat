import { z } from 'zod'

// Canonical Graph Model
export interface Node {
  id: string
  label: string
  type: string
  position: { x: number; y: number }
  attrs?: Record<string, any>
}

export interface Edge {
  id: string
  sourceId: string
  targetId: string
  label?: string
  type?: string
  attrs?: Record<string, any>
}

export interface GraphState {
  nodes: Record<string, Node>
  edges: Record<string, Edge>
  selection: {
    nodeIds: string[]
    edgeIds: string[]
  }
  aliases: Record<string, string[]>
  history: any[]
}

// Graph Action Language (GAL)
const createNodeSchema = z.object({
  type: z.literal('CreateNode'),
  label: z.string(),
  nodeType: z.string().optional(),
  position: z
    .object({
      x: z.number(),
      y: z.number()
    })
    .optional()
})

const connectNodesSchema = z.object({
  type: z.literal('Connect'),
  from: z.union([z.string(), z.object({ id: z.string() })]),
  to: z.union([z.string(), z.object({ id: z.string() })]),
  label: z.string().optional(),
  edgeType: z.string().optional()
})

const renameNodeSchema = z.object({
  type: z.literal('RenameNode'),
  nodeRef: z.union([z.string(), z.object({ id: z.string() })]),
  newLabel: z.string()
})

const deleteSchema = z.object({
  type: z.literal('Delete'),
  ref: z.union([z.string(), z.object({ id: z.string() })])
})

const disambiguateSchema = z.object({
  type: z.literal('Disambiguate'),
  message: z.string(),
  options: z.array(z.string())
})

const undoSchema = z.object({
  type: z.literal('Undo')
})

const redoSchema = z.object({
  type: z.literal('Redo')
})

const snapshotSchema = z.object({
  type: z.literal('Snapshot'),
  name: z.string().optional()
})

const styleSchema = z.object({
  type: z.literal('Style'),
  targetRef: z.union([z.string(), z.object({ id: z.string() })]),
  attrs: z.record(z.any())
})

const autoLayoutSchema = z.object({
  type: z.literal('AutoLayout'),
  algorithm: z.string().optional()
})

const validateSchema = z.object({
  type: z.literal('Validate'),
  ruleset: z.string().optional()
})

const exportSchema = z.object({
  type: z.literal('Export'),
  format: z.union([z.literal('json'), z.literal('png'), z.literal('svg')])
})

const importSchema = z.object({
  type: z.literal('Import'),
  graphJson: z.string()
})

export const galActionSchema = z.union([
  createNodeSchema,
  connectNodesSchema,
  renameNodeSchema,
  deleteSchema,
  disambiguateSchema,
  undoSchema,
  redoSchema,
  snapshotSchema,
  styleSchema,
  autoLayoutSchema,
  validateSchema,
  exportSchema,
  importSchema
])

export const galSchema = z.object({
  actions: z.array(galActionSchema)
})

export type GalAction = z.infer<typeof galActionSchema>
