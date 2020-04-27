import { renderFile } from 'ejs';
import * as path from 'path';

export const compileTemplate = (templateName: string, data: Object) =>
  new Promise<string>(async (resolve, reject) => {
    renderFile(
      path.resolve(__dirname, `../templates/${templateName}.ejs`),
      data,
      {},
      (err, str) => {
        if (err) {
          console.warn(err);
          reject(err);
        }
        resolve(str);
      },
    );
  });
