declare module 'import-parser';

interface Import {
  originalMatch: string;
  moddulePath: string;
  importList: string[];
}
