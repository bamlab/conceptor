/**
 * @name CRCParser
 * @responsibility Parse document to extract CRC information
 **/

import * as vscode from 'vscode';
import { CRCCard } from './types/model';
import { parse, Annotation, Tag } from 'doctrine';
const ImportParser = require('import-parser');
import { readFile } from './utils/FileSystem';
import { DocumentParser } from './DocumentParser';

export class CRCParser {
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

  public static extractCRCCard = async (fileUri: vscode.Uri) => {
    const documentText = await readFile(fileUri);

    const { header, body } = DocumentParser.preparseDocument(documentText);
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
