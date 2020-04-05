/**
 * @name CRCCardsGenerator
 * @responsibility Generates an array of CRC Cards for the given set of js/ts files
 **/

import * as vscode from 'vscode';
import { parse, Annotation, Tag } from 'doctrine';
const ImportParser = require('import-parser');

interface CRCCardDataType {
  name: string;
  responsibilities?: string[];
  collaborators?: string[];
}

interface ConceptionDocumentFormatType {
  header?: string;
  body: string;
}

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

  private static extractTagFromAnnotation = (
    annotation: Annotation,
    tagTitle: Tag['title'],
  ) => {
    const targetTag = annotation.tags.find(({ title }) => title === tagTitle);
    if (!targetTag || !targetTag.name) {
      throw new Error(
        `Cannot extract document name from document annotation: ${JSON.stringify(
          annotation,
        )}. Please ensure the file's annotationn inclue the following tag: "@${tagTitle}"`,
      );
    }
    return targetTag.name;
  };

  private static extractNameAndResponsibilities = (
    documentHeader: string,
  ): {
    name: CRCCardDataType['name'];
    responsibilities?: CRCCardDataType['responsibilities'];
  } => {
    const annotation = parse(documentHeader, {
      unwrap: true,
    });

    return { name: CRCParser.extractTagFromAnnotation(annotation, 'name') };
  };

  private static extractCollaborators = (documentBody: string): string[] => {
    return ImportParser(documentBody)
      .map(({ importList }: { importList: string[] }) => importList)
      .flat();
  };

  public static extractCRCData = (documentText: string): ?CRCCardDataType => {
    const { header, body } = CRCParser.preparseDocument(documentText);
    if (!header) {
      return null;
    }

    return {
      ...CRCParser.extractNameAndResponsibilities(header),
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
    const crcCards = await Promise.all(
      fileUris.map(async (fileUri: vscode.Uri) => {
        const documentText = await CRCCardsGenerator.readFile(fileUri);

        return CRCParser.extractCRCData(documentText);
      }),
    );
    return crcCards.filter((crcCard) => !!crcCard);
  };
}
