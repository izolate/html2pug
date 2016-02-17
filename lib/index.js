'use strict'

const jsdom = require('jsdom')
const minify = require('html-minifier').minify
const Parser = require('./parser')

module.exports = (html, opts) => {

  html = minify(html, {
    removeEmptyAttributes: true,
    collapseWhitespace: true,
    caseSensitive: true
  })

  // Server-side
  const document = jsdom.jsdom(html)

  const parser = new Parser(document, opts)
  return parser.parse(document.childNodes).then(pug => pug)
}
