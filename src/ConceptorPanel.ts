/**
 * @name ConceptorPanel
 * @responsibility Build webview panel to hold the display content of the "conceptor" extension
 **/

import * as vscode from 'vscode';

type Listener = (e: void) => any;

export class ConceptorPanel {
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private _onDidDisposeListeners: Listener[] = [];

  private dispose() {
    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
    this._onDidDisposeListeners.forEach((listener: Listener) => listener());
  }

  public constructor(panel: vscode.WebviewPanel) {
    this._panel = panel;

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public loadDependencies = (dependenciePaths: string[]) =>
    dependenciePaths.map((dependencyPath: string) =>
      this._panel.webview.asWebviewUri(vscode.Uri.file(dependencyPath)),
    );

  public setContent(content: string) {
    this._panel.webview.html = content;
  }

  public getPanel() {
    return this._panel;
  }

  public reveal() {
    this._panel.reveal();
  }

  public onDidDispose(listener: (e: void) => any) {
    this._onDidDisposeListeners.push(listener);
  }
}
