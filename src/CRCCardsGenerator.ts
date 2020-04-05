/**
 * @name CRCCardsGenerator
 * @responsibility Generates an array of CRC Cards for the given set of js/ts files
 **/

import * as vscode from 'vscode';
import { parse } from 'doctrine';
const ImportParser = require('import-parser');

export class CRCCardsGenerator {
  public static generateCRCCards = async (fileUris: vscode.Uri[]) => {
    const nodes = await Promise.all(
      fileUris.map(async (fileUri: vscode.Uri) => {
        const projectDocument = await vscode.workspace.openTextDocument(
          fileUri.path,
        );
        const text = projectDocument.getText();
        // TODO: Use a cleaner way to ignore file body and keep header
        const [header, body] = text.split('**/');
        if (!body) {
          // the file actually has no header so we break
          return;
        }
        const ast = parse(header, {
          unwrap: true,
        });

        const nameTag = ast.tags.find(({ title }) => title === 'name');
        if (!nameTag || !nameTag.name) {
          console.log(fileUri.path);
          console.log(`No name tag for component: ${ast}`);
          return;
        }

        const collaborators = ImportParser(body)
          .map(({ importList }: { importList: string[] }) => importList)
          .flat();
        console.log(collaborators);

        return {
          data: { id: nameTag.name, label: nameTag.name },
          collaborators,
        };
      }),
    );
    return nodes.filter((node) => !!node);
  };
}
