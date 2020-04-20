/**
 * @name utils/FileSystem
 * @responsibility Provide file system related utilities
 **/

import * as vscode from 'vscode';

export const readFile = async (fileUri: vscode.Uri) => {
  const document = await vscode.workspace.openTextDocument(fileUri.path);
  return document.getText();
};
