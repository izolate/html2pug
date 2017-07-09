'use strict'

const minify = require('html-minifier').minify
const parse5 = require('parse5')
const Parser = require('./parser')

module.exports = async (
  sourceHtml,
  {
    fragment = false,
    caseSensitive = true,
    removeEmptyAttributes = true,
    collapseWhitespace = true,
    collapseBooleanAttributes = true,
    collapseInlineTagWhitespace = true
  } = {}
) => {
  const html = minify(sourceHtml, {
    removeEmptyAttributes,
    collapseWhitespace,
    collapseBooleanAttributes,
    collapseInlineTagWhitespace,
    caseSensitive
  })

  // Server-side
  const document = fragment ? parse5.parseFragment(html) : parse5.parse(html)

  const parser = new Parser(document)
  return parser.parse()
}
