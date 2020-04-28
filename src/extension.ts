/**
 * @name extension
 * @description Conceptor Extension entry point
 * @responsibility Register the "conceptor" command
 * @responsibility Request the build of the Design Graph
 * @responsibility Display message to let the user know it's ready
 **/

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Conceptor } from './Conceptor';

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

    const conceptor = new Conceptor(context);
    await conceptor.buildDesignGraph();

    vscode.workspace.onDidOpenTextDocument(() => {
      console.log('Opening document');
      conceptor.panel.webview.postMessage({ hello: 'world' });
    });

    vscode.window.showInformationMessage('✅ Design Graph ready, 🙌 enjoy!');
  });
  context.subscriptions.push(disposable);
};

// this method is called when your extension is deactivated
export function deactivate() {}
