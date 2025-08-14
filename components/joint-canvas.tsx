'use client'

import * as React from 'react'
import { useStore } from '@/lib/store'
import * as joint from '@joint/core'
import { edgeStyles, nodeStyles } from '@/lib/styling'
import { GraphExecutor } from '@/lib/graph-executor'
import { GalAction } from '@/lib/graph-types'

export interface JointCanvasHandle {
  execute: (actions: GalAction[]) => void
}

export const JointCanvas = React.forwardRef<JointCanvasHandle, {}>(
  (props, ref) => {
    const canvasRef = React.useRef<HTMLDivElement>(null)
    const graphRef = React.useRef<joint.dia.Graph | null>(null)
    const paperRef = React.useRef<joint.dia.Paper | null>(null)
    const executorRef = React.useRef<GraphExecutor | null>(null)

    const { nodes, edges } = useStore()

    React.useImperativeHandle(ref, () => ({
      execute: actions => {
        if (executorRef.current) {
          executorRef.current.execute(actions)
        }
      }
    }))

    React.useEffect(() => {
      const graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes })
      graphRef.current = graph
      executorRef.current = new GraphExecutor(graph)

      const paper = new joint.dia.Paper({
        el: canvasRef.current,
        model: graph,
        width: '100%',
        height: '100%',
        gridSize: 10,
        drawGrid: true,
        background: {
          color: 'rgba(0, 255, 0, 0.3)'
        },
        cellViewNamespace: joint.shapes
      })
      paperRef.current = paper

      paper.on('cell:pointerclick', cellView => {
        useStore.getState().setSelection({ nodeIds: [cellView.model.id as string] })
      })

      paper.on('blank:pointerclick', () => {
        useStore.getState().setSelection({ nodeIds: [] })
      })

      return () => {
        paper.remove()
        graph.clear()
      }
    }, [])

    React.useEffect(() => {
      const graph = graphRef.current
      if (!graph) return

      const storeNodes = Object.values(nodes)
      const storeEdges = Object.values(edges)

      const graphNodes = graph.getElements()
      const graphEdges = graph.getLinks()

      // Add/update nodes
      for (const node of storeNodes) {
        let cell = graph.getCell(node.id) as joint.shapes.standard.Rectangle
        if (!cell) {
          cell = new joint.shapes.standard.Rectangle({
            id: node.id,
            position: node.position,
            size: { width: 100, height: 40 }
          })
          const style = nodeStyles[node.type]
          if (style) {
            cell.attr(style.attrs)
          }
          cell.attr('label/text', node.label)
          graph.addCell(cell)
        } else {
          cell.position(node.position.x, node.position.y)
          cell.attr('label/text', node.label)
          const style = nodeStyles[node.type]
          if (style) {
            cell.attr(style.attrs)
          }
        }
      }

      // Add/update edges
      for (const edge of storeEdges) {
        let link = graph.getCell(edge.id) as joint.shapes.standard.Link
        if (!link) {
          link = new joint.shapes.standard.Link({
            id: edge.id,
            source: { id: edge.sourceId },
            target: { id: edge.targetId }
          })
          const style = edgeStyles[edge.type ?? '']
          if (style) {
            link.attr(style.attrs)
          }
          if (edge.label) {
            link.labels([
              {
                attrs: {
                  text: {
                    text: edge.label
                  }
                }
              }
            ])
          }
          graph.addCell(link)
        }
      }

      // Remove nodes
      for (const node of graphNodes) {
        if (!nodes[node.id]) {
          graph.removeCells([node])
        }
      }

      // Remove edges
      for (const edge of graphEdges) {
        if (!edges[edge.id]) {
          graph.removeCells([edge])
        }
      }
    }, [nodes, edges])

    return <div ref={canvasRef} className="size-full" />
  }
)

JointCanvas.displayName = 'JointCanvas'
