const { minify } = require('html-minifier')
const { parse, parseFragment } = require('parse5')
const Pugify = require('./parser')

const defaultOptions = {
  // html2pug options
  isFragment: false,
  useTabs: false,
  useCommas: true,

  // html-minifier options
  caseSensitive: true,
  removeEmptyAttributes: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  preserveLineBreaks: true,
}

module.exports = (sourceHtml, options = {}) => {
  // Minify source HTML
  const opts = { ...defaultOptions, ...options }
  const html = minify(sourceHtml, opts)

  const { isFragment, useTabs, useCommas } = opts

  // Parse HTML and convert to Pug
  const documentRoot = isFragment ? parseFragment(html) : parse(html)
  const pugify = new Pugify(documentRoot, { useTabs, useCommas })
  return pugify.parse()
}
