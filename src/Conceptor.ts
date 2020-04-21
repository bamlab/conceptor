/**
 * @responsibility Create a webview panel
 * @responsibility List project files according to the include/ignore patterns configured
 * @responsibility Request CRC Cards corresponding to the given set of files
 * @responsibility Request Conception Graph rendering and attach it to the created panel
 **/

import * as vscode from 'vscode';
import { CRCCardsGenerator } from './CRCCardsGenerator';
import { ConceptionGraphGenerator } from './view/ConceptionGraphGenerator';
import { CRCCard } from './types/model';
import { ConfigurationManager } from './view/ConfigurationManager';

export class Conceptor {
  private context: vscode.ExtensionContext;
  private panel: vscode.WebviewPanel;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.panel = vscode.window.createWebviewPanel(
      'conceptor.preview',
      'Conceptor',
      vscode.ViewColumn.Eight,
      { enableScripts: true },
    );

    // Register lifecycle listeners
    vscode.workspace.onDidSaveTextDocument(this.buildConceptionGraph);
  }

  private static findFiles = async () =>
    vscode.workspace.findFiles(
      ConfigurationManager.getIncludeFilePatterns(),
      ConfigurationManager.getIgnoreFilePatterns(),
    );

  private renderConceptionGraph = async (crcCards: CRCCard[]) => {
    this.panel.webview.html = await ConceptionGraphGenerator.withConceptionGraph(
      crcCards,
    )(this.panel, this.context);
  };

  public buildConceptionGraph = async () => {
    const fileUris = await Conceptor.findFiles();

    const crcCards = (await CRCCardsGenerator.generateCRCCards(
      fileUris,
    )) as CRCCard[];

    this.renderConceptionGraph(crcCards);
  };
}
