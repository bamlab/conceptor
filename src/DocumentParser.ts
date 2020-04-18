/**
 * @name DocumentParser
 * @responsibility Parse document for information and transform into an analyzable object
 **/

import { ConceptionDocumentFormatType } from './types/model';

export class DocumentParser {
  public static preparseDocument = (
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
}
