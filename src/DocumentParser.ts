/**
 * @name DocumentParser
 * @responsibility Parse document for information and transform into an analyzable object
 **/

import * as vscode from 'vscode';
import { parse, Annotation } from 'doctrine';
import { ConceptionDocumentFormatType } from './types/model';
import { readFile } from './utils/FileSystem';

interface ConceptionDocument {
  name?: string;
  annotation?: Annotation;
  body: string;
}

export class DocumentParser {
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

  public static parse = async (
    fileUri: vscode.Uri,
  ): Promise<ConceptionDocument> => {
    const documentText = await readFile(fileUri);
    const { header, body } = DocumentParser.preparseDocument(documentText);
    const annotation = header
      ? parse(header, {
          unwrap: true,
        })
      : undefined;
    return {
      annotation,
      body,
    };
  };
}
