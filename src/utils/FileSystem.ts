/**
 * @name utils/FileSystem
 * @responsibility Provide file system related utilities
 **/

import * as vscode from 'vscode';

export const readFile = async (fileUri: vscode.Uri) => {
  const document = await vscode.workspace.openTextDocument(fileUri.path);
  return document.getText();
};

export const extractFilePath = (fileUri: vscode.Uri) => fileUri.path;

export const extractFileName = (fileUri: vscode.Uri) =>
  fileUri.path?.split('/').pop();

export const extractFileLocation = (fileUri: vscode.Uri) =>
  fileUri.path?.split('/').slice(0, -1).join('/');

export const removeExtension = (path: vscode.Uri['path']) =>
  path.split('.').slice(0, -1).join('.');

export const toAbsoluteLocalPath = (path?: vscode.Uri['path']) =>
  path?.replace(`${vscode.workspace.rootPath}/` || '', '');
