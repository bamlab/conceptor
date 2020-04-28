import * as assert from 'assert';
import { DocumentParser } from './DocumentParser';
import * as sinon from 'sinon';
import { Uri } from 'vscode';

import * as FileSystem from './utils/FileSystem';

const readFileStub = sinon.stub(FileSystem, 'readFile');

const name = 'MyComponent.ts';
const annotation = {
  description: '',
  tags: [
    {
      description: null,
      name: 'MyComponent',
      title: 'name',
    },
    {
      description: 'Do some stuff',
      title: 'responsibility',
    },
  ],
};
const imports = [
  {
    importList: ['GreatLib'],
    modulePath: 'great-lib',
    originalMatch: "import GreatLib from 'great-lib'",
  },
  {
    importList: ['Titi'],
    modulePath: 'toto',
    originalMatch: "import { Titi } from 'toto'",
  },
  {
    importList: ['Foo'],
    modulePath: './bar',
    originalMatch: "import { Foo } from './bar'",
  },
];
const header = `/**\n* @${annotation.tags[0].title} ${annotation.tags[0].name}\n* @${annotation.tags[1].title} ${annotation.tags[1].description}\n**/`;
const body = `\n${imports[0].originalMatch}';\n${imports[1].originalMatch};\n${imports[2].originalMatch};\n\nexport class ${name} {\n public static doStuff = async (param: string) => {\n   return \`Do somoe stuff with \${param}\`\n };\n}\n`;
const annotatedDocument = `${header}${body}`;
const unannotatedDocument = body;

suite('DocumentParser', () => {
  suite('parse', () => {
    test('should return null when the "skipUnannotated" option is provided and the document has no header', async () => {
      readFileStub.callsFake(async () => unannotatedDocument);
      const document = await DocumentParser.parse(
        Uri.file('/my/path/to/MyComponent.ts'),
        {
          skipUnannotated: true,
        },
      );
      assert.equal(document, null);
    });
    test('should return parsed document when the document is annotated when the "skipUnannotated" option is provided', async () => {
      readFileStub.callsFake(async () => annotatedDocument);
      const document = await DocumentParser.parse(
        Uri.file('/my/path/to/MyComponent.ts'),
        {
          skipUnannotated: true,
        },
      );
      const expectedParsedDocument = {
        name,
        annotation,
        body,
        imports,
      };
      assert.notStrictEqual(document, expectedParsedDocument);
    });
    test('should return parsed document when the document is annotated when the "skipUnannotated" option is not provided', async () => {
      readFileStub.callsFake(async () => annotatedDocument);
      const document = await DocumentParser.parse(
        Uri.file('/my/path/to/MyComponent.ts'),
        {
          skipUnannotated: false,
        },
      );
      const expectedParsedDocument = {
        name,
        annotation,
        body,
        imports,
      };
      assert.notStrictEqual(document, expectedParsedDocument);
    });
  });
});
