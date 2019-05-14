# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2019-05-14
### Added
- Option `doubleQuotes` for attribute values
- Option `commas` to CLI
- Travis CI file

### Changed
- Refactored cli.js
- Option `useTabs` to `tabs` (**BREAKING CHANGE**)
- Option `useCommas` to `commas` (**BREAKING CHANGE**)
- Option `isFragment` to `fragment` (**BREAKING CHANGE**)

## [3.0.0] - 2019-04-07
### Changed
- Option `tabs` to `useTabs` (**BREAKING CHANGE**)
- Option `fragment` to `isFragment` (**BREAKING CHANGE**)
- `preserveLineBreaks` default is `true`

### Added
- Multiline element values (`<script>`, `<pre>` etc.)
- Extend method to merge options with defaults
- Prettier + ESLint
- Shorthand for boolean/empty attributes
- Option `useCommas` for attribute separator

### Removed
- Standard code style

### Fixed
- Replaced single quotes in attributes with an escaped single quote
- Vulnerabilities in dependencies

## [2.0.1] - 2017-08-13
### Changed
- Remove unused async function
- Correct documenation on doctype

## [2.0.0] - 2017-08-12
### Changed
- CLI invocation syntax (**BREAKING CHANGE**)

### Added
- Support for tab indentation
- Tests

## [1.0.0] - 2017-07-09
### Changed
- Use parse5 instead of jsdom

### Fixed
- Text node bug due to inconsistent whitespace
- &nbsp; conversion error
- Cyrillic characters encoding
- Indentation for multi-line comments
- Canvas tag issue
