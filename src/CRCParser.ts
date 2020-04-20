/**
 * @name CRCParser
 * @responsibility Parse document to extract CRC information
 **/

import * as vscode from 'vscode';
import { Annotation } from 'doctrine';
import { DocumentParser, ConceptionDocument } from './DocumentParser';
import { ConnectOpts } from 'net';

export class CRCParser {
  private static extractNameFromDocumentName = ({ name }: ConceptionDocument) =>
    name?.split('.')[0];

  private static extractNameFromAnnotation = ({
    annotation,
  }: ConceptionDocument) =>
    annotation
      ? DocumentParser.extractTagsFromAnnotation(annotation, 'name')[0]
      : undefined;

  private static extractName = (document: ConceptionDocument) =>
    CRCParser.extractNameFromAnnotation(document) ||
    CRCParser.extractNameFromDocumentName(document);

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
