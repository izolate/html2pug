#!/usr/bin/env node

'use strict'

const { version } = require('../package.json')
const getStdin = require('get-stdin')
const html2pug = require('./')
const argv = require('yargs').argv

/**
 * Create a help page
 */
const help = [
  '\n  Usage: html2pug [options] < [file]\n',
  '  Options:\n',
  `    -f, --fragment          Don't wrap output in <html>/<body> tags`,
  `    -t, --tabs              Use tabs instead of spaces`,
  `    -h, --help              Show this page`,
  `    -v, --version           Show version\n`,
  '  Examples:\n',
  '    # Accept input from file and write to stdout',
  '    $ html2pug < example.html\n',
  '    # Or write to a file',
  '    $ html2pug < example.html > example.pug \n'
].join('\n')

/**
 * Convert HTML from stdin to Pug
 */
async function main ({ fragment, needsHelp, showVersion, tabs }) {
  const stdin = await getStdin()

  if (showVersion) {
    return console.log(version)
  }

  if (needsHelp || !stdin) {
    return console.log(help)
  }

  const pug = html2pug(stdin, { tabs, fragment })
  console.log(pug)
}

/**
 * Get the CLI options and run program
 */
main({
  fragment: !!(argv.fragment || argv.f),
  needsHelp: !!(argv.help || argv.h),
  showVersion: !!(argv.version || argv.v),
  tabs: !!(argv.tabs || argv.t)
})
