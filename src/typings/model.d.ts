export interface CRCCard {
  id: string;
  name: string;
  responsibilities?: string[];
  collaborators?: string[];
}

export interface DesignDocumentFormatType {
  header?: string;
  body: string;
}
