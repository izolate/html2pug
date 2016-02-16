#!/usr/bin/env node

'use strict'

const pkg = require('../package.json')
const argv = require('minimist')(process.argv.slice(2))
const html2pug = require('./index')
const fs = require('fs')

if (argv.f) {
  argv.f = argv.f instanceof Array ? argv.f : [argv.f]
  argv.f.forEach(file => fs.readFile(file, (err, html) => {
    if (err) throw new Error(err)
    else console.log(html2pug(html.toString()))
  }))
}
