/**
 * @name CRCCardsGenerator
 * @responsibility Generates an array of CRC Cards for the given set of js/ts files
 **/

import * as vscode from 'vscode';
import { without } from 'lodash';
import { CRCParser } from './CRCParser';

export class CRCCardsGenerator {
  public static generateCRCCards = async (fileUris: vscode.Uri[]) => {
    return without(
      await Promise.all(fileUris.map(CRCParser.extractCRCCard)),
      null,
    );
  };
}
