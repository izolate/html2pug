'use strict'

const jsdom = require('jsdom')
const html = `<h1 id='header'><span>foo</span></h1><ul class='list'><!-- test --><li data-id='1'>one</li><li>two</li><li>three</li></ul>`

const document = jsdom.jsdom()
const window = document.defaultView
const template = document.createElement('template')
template.innerHTML = html

let pug = ''
let i = 0

// Depth-first search in pre-order
function * treeTraversal (tree, parent, level) {
  if (!tree) return

  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    pug += `\n${'  '.repeat(level)}${parseNode(node)}`

    yield { node, parent, level }

    if (node.childNodes.length) {
      yield *treeTraversal(node.childNodes, node, level + 1)
    }
  }
}

function parseNode (node) {
  if (node instanceof window.Text) return `| ${node.textContent}`

  else if (node instanceof window.Comment)
    return `//${node.textContent}`

  else if (node.tagName) {
    return setAttributes(node)
  }

  else return node
}

function setAttributes (node) {
  let str = node.tagName.toLowerCase()

  // Add ID
  if (node.id) str += `#${node.id}`

  // Adds Class
  if (node.classList.length)
    for (var cls in node.classList)
      str += `.${node.classList[cls]}`

  return str
}


const walk = treeTraversal(template.content.childNodes, null, 0)
let it = walk.next()

while (!it.done) {
  it = walk.next()
}

console.log(pug)

