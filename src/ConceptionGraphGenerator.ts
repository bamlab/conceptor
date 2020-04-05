/**
 * @name ConceptionGraphGenerator
 * @responsibility Generates a Conception graph given a set of CRC Cards
 **/

function getWebviewContent(nodes: (NodeType | undefined)[], edges: EdgeType[]) {
  const elements = [...nodes, ...edges];
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Conceptor Graph</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.14.1/cytoscape.min.js"></script>
  </head>
  <style>
      #cy {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0px;
          left: 0px;
      }
  </style>
  <body>
      <div id="cy"></div>
      <script>
        var cy = cytoscape({
          container: document.getElementById('cy'),
          elements: ${JSON.stringify(elements)},
          style: [
            {
                selector: 'node',
                style: {
                    shape: 'round-rectangle',
                    height: 140,
                    width: 200,
                    'background-color': 'white',
                    label: 'data(label)',
                    'text-halign': 'center',
                    'text-valign': 'center'
                }
            },
            {
              selector: 'edge',
              style: {
                'target-arrow-shape': 'vee'
              }
            }
          ]    
        });
      </script>
  </body>
  </html>`;
}

export class ConceptionGraphGenerator {
  public static generateConceptionGraph(documentedNodes) {
    const edges = documentedNodes
      .map((node: NodeType) => {
        const collaborationEdges = [];
        node.collaborators.forEach((collaborator: string) => {
          if (
            documentedNodes.find((otherNode: NodeType) => {
              return otherNode.data.id === collaborator;
            })
          ) {
            collaborationEdges.push({
              data: {
                id: `${node.data.id}->${collaborator}`,
                source: node.data.id,
                target: collaborator,
              },
            });
          }
        });
        return collaborationEdges;
      })
      .flat();
    return getWebviewContent(documentedNodes, edges);
  }
}
