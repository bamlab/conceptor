/**
 * @name ConceptorPanelManager
 * @responsibility Hold the ConceptorPanel and ensure its unicity
 **/

import * as vscode from 'vscode';
import { ConceptorPanel } from './ConceptorPanel';

export class ConceptorPanelManager {
  public static currentPanel?: ConceptorPanel;

  public static createOrShow() {
    // If we already have a panel, show it.
    if (ConceptorPanelManager.currentPanel) {
      ConceptorPanelManager.currentPanel.reveal();
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      'conceptor.preview',
      'Conceptor',
      vscode.ViewColumn.Eight,
      {
        enableScripts: true,
      },
    );

    ConceptorPanelManager.currentPanel = new ConceptorPanel(panel);
    ConceptorPanelManager.currentPanel.onDidDispose(() => {
      ConceptorPanelManager.currentPanel = undefined;
    });
  }

  public static setContent(content: string) {
    ConceptorPanelManager.currentPanel?.setContent(content);
  }

  public static getPanel() {
    return ConceptorPanelManager.currentPanel?.getPanel();
  }
}
