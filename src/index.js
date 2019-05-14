const { minify } = require('html-minifier')
const { parse, parseFragment } = require('parse5')
const Pugify = require('./parser')

const defaultOptions = {
  // html2pug options
  fragment: false,
  tabs: false,
  commas: true,
  doubleQuotes: false,

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

  const { fragment, tabs, commas, doubleQuotes } = opts

  // Parse HTML and convert to Pug
  const doc = fragment ? parseFragment(html) : parse(html)
  const pugify = new Pugify(doc, {
    tabs,
    commas,
    doubleQuotes,
  })
  return pugify.parse()
}
