/**
 * @responsibility Create a webview panel
 * @responsibility List project files according to the include/ignore patterns configured
 * @responsibility Request CRC Cards corresponding to the given set of files
 * @responsibility Request Design Graph rendering and attach it to the created panel
 **/

import * as vscode from 'vscode';
import { CRCCardsGenerator } from './CRCCardsGenerator';
import { DesignGraphGenerator } from './view/DesignGraphGenerator';
import { CRCCard } from './types/model';
import { ConfigurationManager } from './ConfigurationManager';
import { ConceptorPanelManager } from './ConceptorPanelManager';

export class Conceptor {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    ConceptorPanelManager.createOrShow();

    // Register lifecycle listeners
    vscode.workspace.onDidSaveTextDocument(this.buildDesignGraph);
  }

  private static findFiles = async () =>
    vscode.workspace.findFiles(
      ConfigurationManager.getIncludeFilePatterns(),
      ConfigurationManager.getIgnoreFilePatterns(),
    );

  private renderDesignGraph = async (crcCards: CRCCard[]) => {
    const panel = ConceptorPanelManager.getPanel();
    if (!panel) {
      return;
    }
    ConceptorPanelManager.setContent(
      await DesignGraphGenerator.withDesignGraph(crcCards)(panel, this.context),
    );
  };

  public buildDesignGraph = async () => {
    const fileUris = await Conceptor.findFiles();

    const crcCards = (await CRCCardsGenerator.generateCRCCards(
      fileUris,
    )) as CRCCard[];

    this.renderDesignGraph(crcCards);
  };
}
