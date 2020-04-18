/**
 * @name CRCCardsGenerator
 * @responsibility Generates an array of CRC Cards for the given set of js/ts files
 **/

import * as vscode from 'vscode';
import { without } from 'lodash';
import { CRCParser } from './CRCParser';

export class CRCCardsGenerator {
  private static readFile = async (fileUri: vscode.Uri) => {
    const document = await vscode.workspace.openTextDocument(fileUri.path);
    return document.getText();
  };

  public static generateCRCCards = async (fileUris: vscode.Uri[]) => {
    return without(
      await Promise.all(
        fileUris.map(async (fileUri: vscode.Uri) => {
          const documentText = await CRCCardsGenerator.readFile(fileUri);

          return CRCParser.extractCRCCard(documentText);
        }),
      ),
      null,
    );
  };
}
