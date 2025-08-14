import { GraphState } from './graph-types'

export interface ValidationIssue {
  message: string
  offendingElements: {
    nodeIds?: string[]
    edgeIds?: string[]
  }
}

export function validateGraph(graph: GraphState): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // Rule: No self-loops
  for (const edge of Object.values(graph.edges)) {
    if (edge.sourceId === edge.targetId) {
      issues.push({
        message: `Edge ${edge.id} is a self-loop.`,
        offendingElements: {
          edgeIds: [edge.id]
        }
      })
    }
  }

  return issues
}
