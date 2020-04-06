/**
 * @name ConceptionGraphGenerator
 * @responsibility Generates a Conception graph given a set of CRC Cards
 **/

import { renderFile } from 'ejs';
import { CRCCard } from './types/model';
import { NodeType, EdgeType } from './types/view';

const graphStyle = [
  {
    selector: 'node',
    style: {
      shape: 'round-rectangle',
      height: 140,
      width: 200,
      'background-color': 'white',
      label: 'data(label)',
      'text-halign': 'center',
      'text-valign': 'center',
    },
  },
  {
    selector: 'edge',
    style: {
      'target-arrow-shape': 'vee',
    },
  },
];

const getWebviewContent = async (nodes: NodeType[], edges: EdgeType[]) => {
  const elements = [...nodes, ...edges];
  return new Promise<string>((resolve, reject) => {
    renderFile(
      './src/extension_webview_panel.template.html',
      {
        script: `var cy = cytoscape({
            container: document.getElementById('cy'),
            elements: ${JSON.stringify(elements)},
            style: ${JSON.stringify(graphStyle)},
          });`,
      },
      {},
      function (err, str) {
        if (err) {
          console.warn(err);
          reject(err);
        }
        resolve(str);
      },
    );
  });
};

export class ConceptionGraphGenerator {
  public static async generateConceptionGraph(crcCards: CRCCard[]) {
    const nodes = crcCards.map((crcCard) => ({
      data: { id: crcCard.name, label: crcCard.name },
    }));
    const edges = crcCards.reduce<EdgeType[]>(
      (edges: EdgeType[], crcCard: CRCCard) => {
        const collaborationEdges: EdgeType[] = [];
        crcCard.collaborators?.forEach((collaborator: string) => {
          if (
            crcCards.find((otherCRCCard: CRCCard) => {
              return otherCRCCard.name === collaborator;
            })
          ) {
            collaborationEdges.push({
              data: {
                id: `${crcCard.name}->${collaborator}`,
                source: crcCard.name,
                target: collaborator,
              },
            });
          }
        }, []);
        return [...edges, ...collaborationEdges];
      },
      [],
    );

    return getWebviewContent(nodes, edges);
  }
}
