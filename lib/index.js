'use strict'

const jsdom = require('jsdom')
const minify = require('html-minifier').minify
const Parser = require('./parser')

module.exports = (html, opts) => {
  let tree
  const document = jsdom.jsdom()
  const window = document.defaultView

  const parser = new Parser(window, document, opts)

  const template = document.createElement('template')
  template.innerHTML = minify(html, {
    removeEmptyAttributes: true,
    collapseWhitespace: true,
    caseSensitive: true
  })

  // if (nodejs)
  tree = template.content.childNodes

  return parser.parse(tree).then(pug => pug)
}
