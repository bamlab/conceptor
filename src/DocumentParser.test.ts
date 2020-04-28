import * as assert from 'assert';
import { DocumentParser } from './DocumentParser';
import * as sinon from 'sinon';
import { Uri } from 'vscode';
import * as FileSystem from './utils/FileSystem';

const readFileStub = sinon.stub(FileSystem, 'readFile');

suite('DocumentParser', () => {
  suite('parse', () => {
    test('should return null when the "skipUnannotated" option is provided and the document has no header', async () => {
      readFileStub.callsFake(async () => 'Document with no header');
      const document = await DocumentParser.parse(Uri.file('/my/path'), {
        skipUnannotated: true,
      });
      assert.equal(document, null);
    });
  });
});
