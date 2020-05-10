export interface CRCCard {
  id: string;
  name: string;
  responsibilities?: string[];
  collaborators?: Collaborator[];
}

export interface Collaborator {
  id: string;
  name: string;
}

export interface Dependency {
  rawImportStatement: Import['originalMatch'];
  path: {
    raw: Import['modulePath'];
    absolute?: string;
  };
  importList: Import['importList'];
}

export interface DesignDocumentFormatType {
  header?: string;
  body: string;
}
