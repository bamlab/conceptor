/**
 * @name CRCParser
 * @responsibility Parse document to extract CRC information
 **/

import * as vscode from 'vscode';
import { CRCCard } from './types/model';
import { Annotation, Tag } from 'doctrine';
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
    annotation: Annotation,
  ): {
    name: CRCCard['name'];
    responsibilities?: CRCCard['responsibilities'];
  } => {
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

  private static extractCollaborators = (imports: Import[]) =>
    imports.reduce<string[]>(
      (allImports, { importList }) => [...allImports, ...importList],
      [],
    );

  public static extractCRCCard = async (fileUri: vscode.Uri) => {
    const { annotation, imports } = await DocumentParser.parse(fileUri);
    if (!annotation) {
      return null;
    }

    const { name, responsibilities } = CRCParser.extractNameAndResponsibilities(
      annotation,
    );

    if (!name) {
      return null;
    }

    return {
      name,
      responsibilities,
      collaborators: CRCParser.extractCollaborators(imports),
    };
  };
}
