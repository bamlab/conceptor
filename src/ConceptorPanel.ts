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

  // The documentation (https://code.visualstudio.com/api/extension-guides/webview#loading-local-content)
  // explains that Webview.asWebviewUri should format the given Uri into "vscode-resource:/my/absolute/path/to/my-local-resource.png".
  // However, it actually returns a Uri formatted as "vscode-resource://file///my/absolute/path/to/my-local-resource.png"
  // which seems to load unconsistently.
  // We must ignore typing constraints and use private constructor for vscode.Uri class in order to
  // remove the "file" authority and the unnecessary "//" prefix to the path
  // This function may be removed if the issue is fixed in the https://github.com/microsoft/vscode repository
  private static adaptWebviewUri = (webviewUri: vscode.Uri) =>
    // @ts-ignore
    new vscode.Uri(
      webviewUri.scheme,
      '',
      webviewUri.path.replace(/\/\//, ''),
      webviewUri.query,
      webviewUri.fragment,
    );

  public constructor(panel: vscode.WebviewPanel) {
    this._panel = panel;

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public loadDependencies = (dependenciePaths: string[]) =>
    dependenciePaths.map((dependencyPath: string) => {
      const webviewUri = this._panel.webview.asWebviewUri(
        vscode.Uri.file(dependencyPath),
      );
      return ConceptorPanel.adaptWebviewUri(webviewUri);
    });

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
