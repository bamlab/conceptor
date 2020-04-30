/**
 * @name DesignGraphGenerator
 * @responsibility Generates a Design graph given a set of CRC Cards
 **/

import * as vscode from 'vscode';
import * as path from 'path';
import { compileTemplate } from './utils';
import { CRCCard } from '../types/model';
import { NodeType, EdgeType } from '../types/view';
import { ConfigurationManager } from '../ConfigurationManager';
import { ConceptorPanel } from '../ConceptorPanel';

const style = {
  crcCard: {
    height: 140,
    width: 200,
  },
};

export class DesignGraphGenerator {
  private readonly _panel: ConceptorPanel;
  private readonly _context: vscode.ExtensionContext;

  public constructor(panel: ConceptorPanel, context: vscode.ExtensionContext) {
    this._panel = panel;
    this._context = context;
  }

  private loadDependencies = () =>
    [
      path.join(
        this._context.extensionPath,
        'node_modules/cytoscape-node-html-label/dist',
        'cytoscape-node-html-label.min.js',
      ),
    ].map((dependencyPath: string) =>
      this._panel
        .getPanel()
        .webview.asWebviewUri(vscode.Uri.file(dependencyPath)),
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
      layout: ConfigurationManager.getDesignGraphLayout(),
    });

  public withDesignGraph = (crcCards: CRCCard[]) => async () => {
    const dependencies = this.loadDependencies();
    const nodes = await DesignGraphGenerator.createNodes(crcCards);
    const edges = DesignGraphGenerator.createEdges(crcCards);

    return compileTemplate('index.html', {
      dependencies,
      script: await DesignGraphGenerator.compileGraphScript(nodes, edges),
    });
  };
}
