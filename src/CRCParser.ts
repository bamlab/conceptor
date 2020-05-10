/**
 * @name CRCParser
 * @responsibility Parse document to extract CRC information
 **/

import * as vscode from 'vscode';
import { Annotation } from 'doctrine';
import {
  extractFilePath,
  removeExtension,
  toAbsoluteLocalPath,
} from './utils/FileSystem';
import { DocumentParser, DesignDocument } from './DocumentParser';
import { ConfigurationManager } from './ConfigurationManager';
import { Collaborator, Dependency } from './typings/model';

export class CRCParser {
  private static extractNameFromDocumentName = ({ name }: DesignDocument) =>
    name?.split('.')[0];

  private static extractNameFromAnnotation = ({ annotation }: DesignDocument) =>
    annotation
      ? DocumentParser.extractTagsFromAnnotation(annotation, 'name')[0]
      : undefined;

  private static extractName = (document: DesignDocument) =>
    CRCParser.extractNameFromAnnotation(document) ||
    CRCParser.extractNameFromDocumentName(document);

  private static extractResponsibilities = (annotation?: Annotation) =>
    annotation
      ? (DocumentParser.extractTagsFromAnnotation(
          annotation,
          'responsibility',
        ) as string[])
      : [];

  private static extractCollaborators = (
    dependencies: Dependency[],
  ): Collaborator[] => {
    return dependencies.reduce<Collaborator[]>(
      (allCollaborators, dependency) => {
        return [
          ...allCollaborators,
          ...dependency.importList.map((importedComponentName: string) => ({
            id: dependency.path.absolute || dependency.path.raw,
            name: importedComponentName,
          })),
        ];
      },
      [],
    );
  };

  public static extractId = (fileUri: vscode.Uri) =>
    removeExtension(toAbsoluteLocalPath(extractFilePath(fileUri)) as string);

  public static extractCRCCard = async (fileUri: vscode.Uri) => {
    const document = await DocumentParser.parse(fileUri, {
      skipUnannotated: ConfigurationManager.shouldOnlyIncludeAnnotatedFiles(),
    });
    return document
      ? {
          id: CRCParser.extractId(fileUri),
          name: CRCParser.extractName(document),
          responsibilities: CRCParser.extractResponsibilities(
            document.annotation,
          ),
          collaborators: CRCParser.extractCollaborators(document.dependencies),
        }
      : null;
  };
}
