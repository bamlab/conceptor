/**
 * @responsibility Create a webview panel
 * @responsibility List project files according to the include/ignore patterns configured
 * @responsibility Request CRC Cards corresponding to the given set of files
 * @responsibility Request Design Graph rendering and attach it to the created panel
 **/

import * as vscode from 'vscode';
import { CRCCardsGenerator } from './CRCCardsGenerator';
import { DesignGraphGenerator } from './DesignGraphGenerator';
import { CRCCard } from './typings/model';
import { ConfigurationManager } from './ConfigurationManager';
import { ConceptorPanelManager } from './ConceptorPanelManager';
import * as dirTree from 'directory-tree';

export class Conceptor {
  private context: vscode.ExtensionContext;
  private designGraphGenerator: DesignGraphGenerator;

  private static findFiles = async () =>
    vscode.workspace.findFiles(
      ConfigurationManager.getIncludeFilePatterns(),
      ConfigurationManager.getIgnoreFilePatterns(),
    );

  private renderDesignGraph = async (crcCards: CRCCard[]) => {
    ConceptorPanelManager.setContent(
      await this.designGraphGenerator.generateDesignGraph(crcCards),
    );
  };

  public constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.designGraphGenerator = new DesignGraphGenerator(
      ConceptorPanelManager.createOrShow(),
    );

    // Register lifecycle listeners
    vscode.workspace.onDidSaveTextDocument(this.buildDesignGraph);
    vscode.window.onDidChangeActiveTextEditor((editor?: vscode.TextEditor) => {
      if (!editor) {
        return;
      }
      this.designGraphGenerator.triggerFocusOnCard(editor.document);
    });
  }

  public buildDesignGraph = async () => {
    const fileUris = await Conceptor.findFiles();

    const filteredTree = dirTree(`${vscode.workspace.rootPath}`, {
      exclude: /\..*/,
      extensions: /\.(ts|tsx$)/,
    });
    console.log(filteredTree.children?.length);
    filteredTree.children?.forEach((folder) => {
      console.log(folder.path);
      if (folder.path.includes('/src')) {
        folder.children?.forEach((toto) => {
          console.log(toto.path);
        });
      }
    });

    const crcCards = (await CRCCardsGenerator.generateCRCCards(
      fileUris,
    )) as CRCCard[];

    this.renderDesignGraph(crcCards);
  };
}
