/**
 * @name CRCParser
 * @responsibility Parse document to extract CRC information
 **/

import * as vscode from 'vscode';
import { Annotation } from 'doctrine';
import { DocumentParser, ConceptionDocument } from './DocumentParser';

export class CRCParser {
  private static extractName = ({ name, annotation }: ConceptionDocument) => {
    const documentName = name?.split('.')[0];
    if (!annotation) {
      return documentName;
    }
    return (
      DocumentParser.extractTagsFromAnnotation(annotation, 'name')[0] ||
      documentName
    );
  };

  private static extractResponsibilities = (annotation?: Annotation) =>
    annotation
      ? (DocumentParser.extractTagsFromAnnotation(
          annotation,
          'responsibility',
        ) as string[])
      : [];

  private static extractCollaborators = (imports: Import[]) =>
    imports.reduce<string[]>(
      (allImports, { importList }) => [...allImports, ...importList],
      [],
    );

  public static extractCRCCard = async (fileUri: vscode.Uri) => {
    const document = await DocumentParser.parse(fileUri);

    return {
      name: CRCParser.extractName(document),
      responsibilities: CRCParser.extractResponsibilities(document.annotation),
      collaborators: CRCParser.extractCollaborators(document.imports),
    };
  };
}
