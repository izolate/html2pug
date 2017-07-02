'use strict'

const minify = require('html-minifier').minify
const parse5 = require('parse5')
const Parser = require('./parser')

module.exports = async (sourceHtml, opts = {}) => {
  const html = minify(sourceHtml, {
    removeEmptyAttributes: true,
    collapseWhitespace: true,
    caseSensitive: true
  })

  // Server-side
  const document = opts.fragment
    ? parse5.parseFragment(html)
    : parse5.parse(html)

  const parser = new Parser(document)

  try {
    const pug = await parser.parse()
    return pug
  } catch (err) {
    throw err
  }
}
