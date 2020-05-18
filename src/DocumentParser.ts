/**
 * @name DocumentParser
 * @responsibility Parse document for information and transform into an analyzable design Document
 **/

import * as vscode from 'vscode';
import * as path from 'path';
import { parse, Annotation, Tag } from 'doctrine';
import { DesignDocumentFormatType, Dependency } from './typings/model';
import {
  extractFileName,
  readFile,
  extractFileLocation,
} from './utils/FileSystem';
const ImportParser = require('import-parser');

export interface DesignDocument {
  name?: string;
  annotation?: Annotation;
  dependencies: Dependency[];
  body: string;
}

export interface DocumentParsingOptions {
  skipUnannotated?: boolean;
}

export class DocumentParser {
  private static preparseDocument = (
    documentText: string,
  ): DesignDocumentFormatType => {
    const header = documentText.match(/(\/\*\*)([\s\S]*?)(\*\/)/g)?.shift();
    if (!header) {
      return {
        body: documentText,
      };
    }
    return {
      header,
      body: documentText.replace(header, ''),
    };
  };

  private static parseImportStatements = (
    fileUri: vscode.Uri,
    documentBody: string,
  ) => {
    try {
      return (ImportParser(documentBody) as Import[]).map<Dependency>(
        (importStatement: Import) => ({
          rawImportStatement: importStatement.originalMatch,
          path: {
            raw: importStatement.modulePath,
            absolute: importStatement.modulePath.startsWith('.')
              ? path.resolve(
                  extractFileLocation(fileUri),
                  importStatement.modulePath,
                )
              : undefined,
          },
          importList: importStatement.importList,
        }),
      );
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
      dependencies: DocumentParser.parseImportStatements(fileUri, body),
      body,
    };
  };
}
