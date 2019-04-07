const { minify } = require('html-minifier')
const { parse, parseFragment } = require('parse5')
const Parser = require('./parser')
const { extend } = require('./utils')

// Default options supplied to minifier
const defaultOptions = {
  caseSensitive: true,
  removeEmptyAttributes: true,
  collapseWhitespace: true,
  collapseBooleanAttribute: true,
  collapseInlineTagWhitespac: true,
}

module.exports = (sourceHtml, options = {}) => {
  // Minify source HTML
  const html = minify(sourceHtml, extend(defaultOptions, options))

  const { isFragment, useTabs } = options

  // Parse minified HTML
  const parser = new Parser({
    root: isFragment ? parseFragment(html) : parse(html),
    useTabs,
  })

  return parser.parse()
}
