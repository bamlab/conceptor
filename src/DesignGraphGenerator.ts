/**
 * @name DesignGraphGenerator
 * @responsibility Generates a Design graph given a set of CRC Cards
 **/

import * as vscode from 'vscode';
import * as path from 'path';
import { compileTemplate } from './utils/Template';
import { CRCCard } from './typings/model';
import { NodeType, EdgeType } from './typings/view';
import { ConfigurationManager } from './ConfigurationManager';
import { ConceptorPanel } from './ConceptorPanel';
import { CRCParser } from './CRCParser';

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

    vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
      this._panel.postMessage({
        type: 'focus',
        targetID: `CRCCard:${CRCParser.extractId(document.uri)}`,
      });
    });
  }

  private loadDependencies = () =>
    this._panel.loadDependencies([
      path.join(
        this._context.extensionPath,
        'node_modules/cytoscape-node-html-label/dist',
        'cytoscape-node-html-label.min.js',
      ),
    ]);

  private static createNodes = async (crcCards: CRCCard[]) =>
    Promise.all(
      crcCards.map(async (crcCard) => ({
        data: {
          id: `CRCCard:${crcCard.id}`,
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
              id: `Collaboration:${crcCard.id}->${collaborator}`,
              source: `CRCCard:${crcCard.id}`,
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
      options: {
        includeSuccessorsOnFocus: ConfigurationManager.shouldIncludeSuccessorsOnAutoFocus(),
      },
    });

  public generateDesignGraph = async (crcCards: CRCCard[]) => {
    const dependencies = this.loadDependencies();
    const nodes = await DesignGraphGenerator.createNodes(crcCards);
    const edges = DesignGraphGenerator.createEdges(crcCards);

    return compileTemplate('index.html', {
      dependencies,
      script: await DesignGraphGenerator.compileGraphScript(nodes, edges),
    });
  };
}
