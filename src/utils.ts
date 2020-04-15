import { renderFile } from 'ejs';

export const compileTemplate = (templatePath: string, data: Object) =>
  new Promise<string>(async (resolve, reject) => {
    renderFile(templatePath, data, {}, (err, str) => {
      if (err) {
        console.warn(err);
        reject(err);
      }
      resolve(str);
    });
  });
