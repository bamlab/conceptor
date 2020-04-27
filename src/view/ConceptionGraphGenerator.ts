/**
 * @name ConceptionGraphGenerator
 * @responsibility Generates a Conception graph given a set of CRC Cards
 **/

import * as vscode from 'vscode';
import * as path from 'path';
import { compileTemplate } from './utils';
import { CRCCard } from '../types/model';
import { NodeType, EdgeType } from '../types/view';
import { ConfigurationManager } from './ConfigurationManager';

const style = {
  crcCard: {
    height: 140,
    width: 200,
  },
};

export class ConceptionGraphGenerator {
  private static loadDependencies = (
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext,
  ) =>
    [
      path.join(
        context.extensionPath,
        'node_modules/cytoscape-node-html-label/dist',
        'cytoscape-node-html-label.min.js',
      ),
    ].map((dependencyPath: string) =>
      panel.webview.asWebviewUri(vscode.Uri.file(dependencyPath)),
    );

  private static createNodes = async (crcCards: CRCCard[]) =>
    Promise.all(
      crcCards.map(async (crcCard) => ({
        data: {
          id: `CRCCard:${crcCard.name}`,
          content: await compileTemplate('crc-card.html', {
            data: {
              name: crcCard.name,
              responsibilities: crcCard.responsibilities,
            },
            style: style.crcCard,
          }),
        },
      })),
    );

  private static createEdges = (crcCards: CRCCard[]) =>
    crcCards.reduce<EdgeType[]>((edges: EdgeType[], crcCard: CRCCard) => {
      const collaborationEdges: EdgeType[] = [];
      crcCard.collaborators?.forEach((collaborator: string) => {
        if (
          crcCards.find((otherCRCCard: CRCCard) => {
            return otherCRCCard.name === collaborator;
          })
        ) {
          collaborationEdges.push({
            data: {
              id: `Collaboration:${crcCard.name}->${collaborator}`,
              source: `CRCCard:${crcCard.name}`,
              target: `CRCCard:${collaborator}`,
            },
          });
        }
      }, []);
      return [...edges, ...collaborationEdges];
    }, []);

  private static compileGraphScript = async (
    nodes: NodeType[],
    edges: EdgeType[],
  ) =>
    compileTemplate('main.js', {
      nodes,
      edges,
      style,
      layout: ConfigurationManager.getConceptionGraphLayout(),
    });

  public static withConceptionGraph = (crcCards: CRCCard[]) => async (
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext,
  ) => {
    const dependencies = ConceptionGraphGenerator.loadDependencies(
      panel,
      context,
    );
    const nodes = await ConceptionGraphGenerator.createNodes(crcCards);
    const edges = ConceptionGraphGenerator.createEdges(crcCards);

    return compileTemplate('index.html', {
      dependencies,
      script: await ConceptionGraphGenerator.compileGraphScript(nodes, edges),
    });
  };
}
