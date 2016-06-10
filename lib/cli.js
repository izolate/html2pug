#!/usr/bin/env node

'use strict'

const pkg = require('../package.json')
const argv = require('minimist')(process.argv.slice(2))
const html2pug = require('./index')
const fs = require('fs')

if (argv.f) {
  argv.f = argv.f instanceof Array ? argv.f : [argv.f]
  argv.f.forEach(file => fs.readFile(file, (err, buf) => {
    if (err) throw new Error(err)
    else html2pug(buf.toString())
      .then(pug => console.log(pug))
      .catch(err => console.log(err.stack))
  }))
}
