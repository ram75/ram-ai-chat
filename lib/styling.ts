export const nodeStyles: Record<string, any> = {
  Concept: {
    attrs: {
      body: {
        fill: '#000000',
        stroke: '#0891b2',
        strokeWidth: 2
      },
      label: {
        fill: '#ffffff'
      }
    }
  },
  Example: {
    attrs: {
      body: {
        fill: '#0891b2',
        stroke: '#000000',
        strokeWidth: 2,
        rx: 5,
        ry: 5
      },
      label: {
        fill: '#ffffff'
      }
    }
  }
}

export const edgeStyles: Record<string, any> = {
  leads_to: {
    attrs: {
      line: {
        stroke: '#0891b2',
        strokeWidth: 2
      }
    }
  },
  depends_on: {
    attrs: {
      line: {
        stroke: '#000000',
        strokeWidth: 2,
        strokeDasharray: '5,5'
      }
    }
  }
}
