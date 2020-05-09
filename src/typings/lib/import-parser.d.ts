declare module 'import-parser';

interface Import {
  originalMatch: string;
  modulePath: string;
  importList: string[];
}
