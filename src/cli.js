#!/usr/bin/env node

'use strict'

const getStdin = require('get-stdin')
const html2pug = require('./')
const argv = require('yargs').argv

const help = [
  '\n  Usage: html2pug [options] < [file]\n',
  '  Options:\n',
  `    -f, --fragment          Don't wrap output in <html>/<body> tags\n`,
  '  Examples:\n',
  '    # Accept input from file and write to stdout',
  '    $ html2pug < example.html\n',
  '    # Or write to a file',
  '    $ html2pug < example.html > example.pug \n'
].join('\n')

async function main () {
  const fragment = argv.fragment || argv.f
  const needsHelp = argv.help || argv.h

  const stdin = await getStdin()

  if (needsHelp || !stdin) {
    console.log(help)
  } else {
    try {
      const pug = await html2pug(stdin, { fragment })
      console.log(pug)
    } catch (e) {
      throw e
    }
  }
}

main()
