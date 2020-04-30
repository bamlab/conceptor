/**
 * @name ConceptorPanel
 * @responsibility Build webview panel to hold the display content of the "conceptor" extension
 **/

import * as vscode from 'vscode';

export class ConceptorPanel {
  public static currentPanel?: ConceptorPanel;

  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow() {
    // If we already have a panel, show it.
    if (ConceptorPanel.currentPanel) {
      ConceptorPanel.currentPanel._panel.reveal();
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

    ConceptorPanel.currentPanel = new ConceptorPanel(panel);
  }

  public static setContent(content: string) {
    ConceptorPanel.currentPanel?._setContent(content);
  }

  public static getPanel() {
    return ConceptorPanel.currentPanel?._panel;
  }

  private constructor(panel: vscode.WebviewPanel) {
    this._panel = panel;

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  private _setContent(content: string) {
    this._panel.webview.html = content;
  }

  public dispose() {
    ConceptorPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
