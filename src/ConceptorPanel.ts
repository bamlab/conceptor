/**
 * @name ConceptorPanel
 * @responsibility Build webview panel to hold the display content of the "conceptor" extension
 **/

import * as vscode from 'vscode';
import { compileTemplate } from './utils/Template';

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

  private initLoadingView = () =>
    compileTemplate('loader.html').then((loadingViewContent: string) => {
      this._panel.webview.html = loadingViewContent;
    });

  public constructor(panel: vscode.WebviewPanel) {
    this._panel = panel;

    this.initLoadingView();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public setContent(content: string) {
    this._panel.webview.html = content;
  }

  public postMessage(data: any) {
    this._panel.webview.postMessage(data);
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
