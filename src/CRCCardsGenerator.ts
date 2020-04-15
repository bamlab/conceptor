/**
 * @name CRCCardsGenerator
 * @responsibility Generates an array of CRC Cards for the given set of js/ts files
 **/

import * as vscode from 'vscode';
import { parse, Annotation, Tag } from 'doctrine';
import { without } from 'lodash';
import { CRCCard, ConceptionDocumentFormatType } from './types/model';
const ImportParser = require('import-parser');

class CRCParser {
  private static preparseDocument = (
    documentText: string,
  ): ConceptionDocumentFormatType => {
    // TODO: Use a cleaner way to ignore file body and keep header
    const [header, body] = documentText.split('**/');
    if (!body) {
      // the file actually has no header
      return {
        body: header,
      };
    }
    return {
      header,
      body,
    };
  };

  private static extractTagsFromAnnotation = (
    annotation: Annotation,
    tagTitle: Tag['title'],
  ) =>
    annotation.tags
      .filter(({ title }) => title === tagTitle)
      .map(({ name, description }) => name || description);

  private static extractNameAndResponsibilities = (
    documentHeader: string,
  ): {
    name: CRCCard['name'];
    responsibilities?: CRCCard['responsibilities'];
  } => {
    const annotation = parse(documentHeader, {
      unwrap: true,
    });

    return {
      name: CRCParser.extractTagsFromAnnotation(
        annotation,
        'name',
      )[0] as string,
      responsibilities: CRCParser.extractTagsFromAnnotation(
        annotation,
        'responsibility',
      ) as string[],
    };
  };

  private static extractCollaborators = (documentBody: string): string[] => {
    return ImportParser(documentBody)
      .map(({ importList }: { importList: string[] }) => importList)
      .flat();
  };

  public static extractCRCCard = (documentText: string) => {
    const { header, body } = CRCParser.preparseDocument(documentText);
    if (!header) {
      return null;
    }

    const { name, responsibilities } = CRCParser.extractNameAndResponsibilities(
      header,
    );

    if (!name) {
      return null;
    }

    return {
      name,
      responsibilities,
      collaborators: CRCParser.extractCollaborators(body),
    };
  };
}

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
