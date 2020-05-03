/**
 * @name DocumentParser
 * @responsibility Parse document for information and transform into an analyzable design Document
 **/

import * as vscode from 'vscode';
import { parse, Annotation, Tag } from 'doctrine';
import { DesignDocumentFormatType } from './types/model';
import { extractFileName, readFile } from './utils/FileSystem';
const ImportParser = require('import-parser');

export interface DesignDocument {
  name?: string;
  annotation?: Annotation;
  imports: Import[];
  body: string;
}

export interface DocumentParsingOptions {
  skipUnannotated?: boolean;
}

export class DocumentParser {
  private static preparseDocument = (
    documentText: string,
  ): DesignDocumentFormatType => {
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

  private static parseImportStatements = (documentBody: string): Import[] => {
    try {
      return ImportParser(documentBody);
    } catch {
      return [];
    }
  };

  public static extractTagsFromAnnotation = (
    annotation: Annotation,
    tagTitle: Tag['title'],
  ) =>
    annotation.tags
      .filter(({ title }) => title === tagTitle)
      .map(({ name, description }) => name || description);

  public static parse = async (
    fileUri: vscode.Uri,
    options?: DocumentParsingOptions,
  ): Promise<DesignDocument | null> => {
    const documentText = await readFile(fileUri);
    const { header, body } = DocumentParser.preparseDocument(documentText);
    let annotation;
    if (options?.skipUnannotated && !header) {
      return null;
    }
    annotation = header
      ? parse(header, {
          unwrap: true,
        })
      : undefined;
    return {
      name: extractFileName(fileUri),
      annotation,
      imports: DocumentParser.parseImportStatements(body),
      body,
    };
  };
}
