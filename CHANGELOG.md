# Change Log

All notable changes to the "conceptor" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.4] - 15-05-2020

### 🚑 Fixed

- Fix focus on card when a document is open :
  - Even if the document is already opened, and we focus on it
  - Focus on the concerned card and it's collaborators

## [0.4.3] - 12-05-2020

### 🚑 Fixed

- Fix graph rendering with empty cards most of the time - [Issue #11](https://github.com/bamlab/conceptor/issues/11)

## [0.4.2] - 11-05-2020

### 🚑 Fixed

- Support multiple lines import statements when parsing document for collaborations

## [0.4.1] - 10-05-2020

### 🚑 Fixed

- Display collaboration link with component when exported components do not match file name
- Render graph when using vscode's autocompleted syntax for JSdoc

## [0.4.0] - 06-05-2020

### 🎉 Added

- Display loader in panel to materialize loading time
- Display arrows on collaboration edges to show highlight orientation from component to collaborators

## [0.3.0] - 03-05-2020

### 🎉 Added

- Provide an option to chose whether the graph should be built with only annotated files rather than all project's files
- Focus on the corresponding CRC Card when a file is open
- Provide an option to chose whether successors nodes should be included within the view when focusing on opened file

### 🦋 Changed

- Modify ignore files pattern to ignore node_modules by default
- Prevent from opening multiple panels when running the "Conceptor" command several time. It only reloads it

### 🚑 Fixed

- Fix CRC Cards content inconsistent initial rendering

## [0.2.1] - 2020-04-27

### 🚑 Fixed

- Fix graph rendering (copy rendering templates during compilation)
- Rename "Conception" into "Design" for more accuracy

## [0.2.0] - 2020-04-22

### 🎉 Added

- Live update the design graph on each file save

### 🦋 Changed

- Provide graph layout selection through a predefined list

## [0.1.0] - 2020-04-19

### 🎉 Added

- Provide include/ignore file patterns configurability
- Provide design graph layout configurability

### 🦋 Changed

- Infer component name from file name if no annotation is provided

## [0.0.1] - 2020-04-17

### 🎉 Added

- Initial release
