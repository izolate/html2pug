#!/usr/bin/env node

'use strict'

const pkg = require('../package.json')
const argv = require('minimist')(process.argv.slice(2))
const html2pug = require('./index')
const fs = require('fs')
const arrify = require('arrify')

if (argv.f) {
  const files = arrify(argv.f)
  const options = {
    fragment: argv.hasOwnProperty('fragment')
  }

  files.forEach(file =>
    fs.readFile(file, (err, buf) => {
      if (err) {
        throw new Error(err)
      } else {
        html2pug(buf.toString(), options)
          .then(pug => console.log(pug))
          .catch(err => console.log(err.stack))
      }
    })
  )
}
