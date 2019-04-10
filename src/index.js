const { minify } = require('html-minifier')
const { parse, parseFragment } = require('parse5')
const Pugify = require('./parser')
const { extend } = require('./utils')

// Default options supplied to minifier
const defaultOptions = {
  caseSensitive: true,
  removeEmptyAttributes: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  preserveLineBreaks: true,
}

module.exports = (sourceHtml, options = {}) => {
  // Minify source HTML
  const html = minify(sourceHtml, extend(defaultOptions, options))

  const { isFragment, useTabs } = options

  // Parse HTML and convert to Pug
  const documentRoot = isFragment ? parseFragment(html) : parse(html)
  const pugify = new Pugify(documentRoot, { useTabs })
  return pugify.parse()
}
