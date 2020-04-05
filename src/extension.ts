/**
 * @name extension
 * @description Conceptor Extension entry point
 * @responsibility Create the extension panel
 * @responsibility List project files for which Conception may be relevant
 **/

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CRCCardsGenerator } from './CRCCardsGenerator';

interface NodeType {
  data: {
    id: string;
    label: string;
  };
  collaborators: string[];
}
interface EdgeType {
  data: {
    id: string;
    source: string;
    target: string;
  };
}

function getWebviewContent(nodes: (NodeType | undefined)[], edges: EdgeType[]) {
  const elements = [...nodes, ...edges];
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
        elements: ${JSON.stringify(elements)},
        style: [
          {
              selector: 'node',
              style: {
                  shape: 'round-rectangle',
                  height: 140,
                  width: 200,
                  'background-color': 'white',
                  label: 'data(label)',
                  'text-halign': 'center',
                  'text-valign': 'center'
              }
          },
          {
            selector: 'edge',
            style: {
              'target-arrow-shape': 'vee'
            }
          }
        ]    
      });
    </script>
</body>
</html>`;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export const activate = (context: vscode.ExtensionContext) => {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "conceptor" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('conceptor', async () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage('🚀Launching Conceptor ...');

    const panel = vscode.window.createWebviewPanel(
      'conceptor.preview',
      'Conceptor',
      vscode.ViewColumn.Eight,
      { enableScripts: true },
    );

    // const nodes: NodeType[] = [];
    const fileUris = await vscode.workspace.findFiles(
      'src/**/*.{ts,js,tsx,jsx}',
      '**/node_modules/**',
    );

    const documentedNodes = await CRCCardsGenerator.generateCRCCards(fileUris);

    const edges = documentedNodes
      .map((node: NodeType) => {
        const collaborationEdges = [];
        node.collaborators.forEach((collaborator: string) => {
          if (
            documentedNodes.find((otherNode: NodeType) => {
              return otherNode.data.id === collaborator;
            })
          ) {
            collaborationEdges.push({
              data: {
                id: `${node.data.id}->${collaborator}`,
                source: node.data.id,
                target: collaborator,
              },
            });
          }
        });
        return collaborationEdges;
      })
      .flat();

    panel.webview.html = getWebviewContent(documentedNodes, edges);
  });
  context.subscriptions.push(disposable);
};

// this method is called when your extension is deactivated
export function deactivate() {}
