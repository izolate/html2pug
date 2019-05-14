#!/usr/bin/env node

const hasFlag = require('has-flag')
const getStdin = require('get-stdin')
const html2pug = require('./')
const { version } = require('../package.json')

// help represents the usage guide
const help = `
  html2pug converts HTML to Pug.

  usage:
    html2pug [options] < [file]

  options:
    -f, --fragment       Don't wrap in enclosing <html> tag
    -t, --tabs           Use tabs for indentation
    -c, --commas         Use commas to separate attributes
    -d, --double-quotes  Use double quotes for attribute values
    -h, --help           Show this page
    -v, --version        Show version

  examples:
    # write to stdout
    html2pug < example.html

    # write to file
    html2pug < example.html > example.pug
`

// print logs to stdout and exits the process
const print = (text, exitCode = 0) => {
  /* eslint-disable no-console */
  if (exitCode === 1) {
    console.error(text)
  } else {
    console.log(text)
  }
  /* eslint-enable no-console */
  process.exit(exitCode)
}

// convert uses the stdin as input for the html2pug library
const convert = async (options = {}) => {
  const stdin = await getStdin()
  if (!stdin) {
    return print(help)
  }
  return html2pug(stdin, options)
}

if (hasFlag('h') || hasFlag('help')) {
  print(help)
}

if (hasFlag('v') || hasFlag('version')) {
  print(version)
}

const options = {
  fragment: hasFlag('f') || hasFlag('fragment'),
  tabs: hasFlag('t') || hasFlag('tabs'),
  commas: hasFlag('c') || hasFlag('commas'),
  doubleQuotes: hasFlag('d') || hasFlag('double-quotes'),
}

convert(options)
  .then(result => print(result))
  .catch(err => print(err, 1))
