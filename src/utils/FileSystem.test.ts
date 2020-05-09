import * as assert from 'assert';
import { extractFilePath, extractFileLocation } from './FileSystem';
import { Uri } from 'vscode';

// @ts-ignore
const mockUri = new Uri({
  path: 'the/path/to/my/file',
  authority: '',
  scheme: 'file',
  query: 'mock query',
});

suite('FileSystem', () => {
  suite('extractFilePath', () => {
    test('should return the path of the given uri', async () => {
      assert.equal(extractFilePath(mockUri), mockUri.path);
    });
  });
  suite('extractFileLocation', () => {
    test('should return the location of the given uri', async () => {
      assert.equal(extractFileLocation(mockUri), 'the/path/to/my');
    });
  });
});
