// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { parse } from 'doctrine';

function getWebviewContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conceptor Graph</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.14.1/cytoscape.min.js"></script>
</head>
<style>
    #cy {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
    }
</style>
<body>
    <div id="cy"></div>
    <script>
      var cy = cytoscape({
        container: document.getElementById('cy'),
        elements: [
          { data: { id: 'a' } },
          { data: { id: 'b' } },
          {
            data: {
              id: 'ab',
              source: 'a',
              target: 'b'
            }
          }
        ],
        style: [
          {
              selector: 'node',
              style: {
                  shape: 'round-rectangle',
                  'background-color': 'white',
                  label: 'data(id)',
                  'text-halign': 'center',
                  'text-valign': 'center'
              }
          }]    
      });
    </script>
</body>
</html>`;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "conceptor" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('conceptor', () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage('🚀Launching Conceptor ...');

    const panel = vscode.window.createWebviewPanel(
      'conceptor.preview',
      'Conceptor',
      vscode.ViewColumn.Eight,
      { enableScripts: true },
    );

    panel.webview.html = getWebviewContent();

    // vscode.workspace
    //   .findFiles('**/*.{ts,js,tsx,jsx}', '**/node_modules/**')
    //   .then((fileUris: vscode.Uri[]) => {
    //     fileUris.forEach((fileUri: vscode.Uri) => {
    //       vscode.workspace
    //         .openTextDocument(fileUri.path)
    //         .then((projectDocument: vscode.TextDocument) =>
    //           projectDocument.getText(),
    //         )
    //         .then((text: string) => {
    //           // TODO: Use a cleaner way to ignore file body and keep header
    //           const [header, body] = text.split('**/');
    //           if (!body) {
    //             // the file actually has no header so we break
    //             return;
    //           }
    //           const ast = parse(header, {
    //             unwrap: true,
    //           });
    //           console.log(ast);
    //         });
    //     });
    //   });
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
