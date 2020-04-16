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
import { ConceptionGraphGenerator } from './ConceptionGraphGenerator';
import { CRCCard } from './types/model';

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
    vscode.window.showInformationMessage(
      '🔍 Loading CRC Cards from project sources ...',
    );

    const panel = vscode.window.createWebviewPanel(
      'conceptor.preview',
      'Conceptor',
      vscode.ViewColumn.Eight,
      { enableScripts: true },
    );

    const fileUris = await vscode.workspace.findFiles(
      'src/**/*.{ts,js,tsx,jsx}',
      '**/node_modules/**',
    );

    const crcCards = (await CRCCardsGenerator.generateCRCCards(
      fileUris,
    )) as CRCCard[];

    vscode.window.showInformationMessage('🏗Loading Conception Graph...');

    panel.webview.html = await ConceptionGraphGenerator.withConceptionGraph(
      crcCards,
    )(panel, context);

    vscode.window.showInformationMessage(
      '✅ Conception Graph delivered, 🙌 enjoy!',
    );
  });
  context.subscriptions.push(disposable);
};

// this method is called when your extension is deactivated
export function deactivate() {}
