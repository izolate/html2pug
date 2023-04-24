/**
 * Defines all the options for html2pug.
 */
export interface Options {
  caseSensitive: boolean;
  collapseBooleanAttributes: boolean;
  collapseWhitespace: boolean;
  commas: boolean;
  doubleQuotes: boolean;
  fragment: boolean;
  preserveLineBreaks: boolean;
  removeEmptyAttributes: boolean;
  tabs: boolean;
}

// Default options for html2pug.
export const defaultOptions = {
  caseSensitive: true,
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  commas: true,
  doubleQuotes: false,
  fragment: false,
  preserveLineBreaks: true,
  removeEmptyAttributes: true,
  tabs: false,
};
