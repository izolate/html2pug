'use strict'

const jsdom = require('jsdom')
const co = require('co')
const each = require('co-each')

const html = `<h1><span>Foo</span></h1><ul><!-- test --><li>one</li><li>two</li><li>three</li></ul>`

const document = jsdom.jsdom()
const window = document.defaultView
const template = document.createElement('template')
template.innerHTML = html

//let final = []
let pug = ''
let i = 0

function * walks (currentNode) {
  console.log('- - - - - - - - - -')
  console.log(`ROUND ${++i}:\n `, currentNode, `[${currentNode.length}]`)

  if (currentNode instanceof window.NodeList) {
    yield each ([].slice.call(currentNode), function * (node) {

      if (node.childNodes.length) {
        console.log(`  <${node.tagName}> has children`)
        yield walk(node.childNodes)
      }

      else {
        console.log('  no children')
        //pug += node.tagName.toLowerCase()
      }
    })
  }
}


const forEach = (nodeList, fn) => [].map.call(nodeList, fn)

/*
co(function * () {
  const files = yield walk(template.content.childNodes)
  return pug
})
  .then(ok => {
    console.log(final)
    console.log(pug)
    console.log(ok)
  })
  .catch(err => console.log(err.stack))
*/

/*
const walk = require('tree-walk')
walk.preorder(template.content.childNodes, (value, key, parent) => {
  console.log('-----------')
  console.log('parent', parent)
  console.log(key, value)
})
 */

/*
const walk = require('dom-walk')
walk(template.content.childNodes, (node) => {
  console.log(node)
})
*/

let final = ''

// Depth-first search in pre-order
function * treeTraversal (tree, parent, level) {
  if (!tree) return

  console.log('--------')
  //console.log('Parent: ', parent)
  console.log('Level: ', level)

  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    final += `\n${'  '.repeat(level)}${node.tagName}`
    yield { node, parent, level }

    if (node.childNodes.length) {
      yield *treeTraversal(node.childNodes, node, level + 1)
    }
  }
}

const walk = treeTraversal(template.content.childNodes, null, 0)
let it = walk.next()

while (!it.done) {
  console.log(it.value)
  it = walk.next()
}

console.log(final)

