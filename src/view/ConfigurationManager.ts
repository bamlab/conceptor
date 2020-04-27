/**
 * @name ConfigurationManager
 * @responsibility Provides vscode configuration for the Conceptor Extension
 **/

import * as vscode from 'vscode';

export class ConfigurationManager {
  public static getIncludeFilePatterns = () =>
    vscode.workspace.getConfiguration('conceptor')?.includeFilePatterns;
  public static getIgnoreFilePatterns = () =>
    vscode.workspace.getConfiguration('conceptor')?.ignoreFilePatterns;
  public static getDesignGraphLayout = () =>
    vscode.workspace.getConfiguration('conceptor')?.designGraphLayout;
}
