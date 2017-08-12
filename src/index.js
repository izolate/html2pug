'use strict'

const { minify } = require('html-minifier')
const { parse, parseFragment } = require('parse5')
const Parser = require('./parser')

module.exports = (
  sourceHtml,
  {
    tabs = false,
    fragment = false,
    caseSensitive = true,
    removeEmptyAttributes = true,
    collapseWhitespace = true,
    collapseBooleanAttributes = true,
    collapseInlineTagWhitespace = true
  } = {}
) => {
  // Minify source HTML
  const html = minify(sourceHtml, {
    removeEmptyAttributes,
    collapseWhitespace,
    collapseBooleanAttributes,
    collapseInlineTagWhitespace,
    caseSensitive
  })

  // Parse minified HTML
  const parser = new Parser({
    root: fragment ? parseFragment(html) : parse(html),
    tabs
  })

  return parser.parse()
}
