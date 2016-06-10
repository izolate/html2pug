'use strict'

const treeAdapter = require('parse5').treeAdapters.default

class Parser {
  constructor (root, opts) {
    this.root = root
    this.pug = ''
  }

  parse () {
    return new Promise((yep, nope) => {
      const walk = this.walk(this.root.childNodes, 0)
      let it

      do {
        it = walk.next()
      } while (!it.done)

      yep(this.pug.substring(1))
    })
  }

  /**
   * DOM tree traversal
   * Depth-first search (pre-order)
   *
   * @param {DOM} tree - DOM tree or Node
   * @param {Number} level - Current tree level
   */
  * walk (tree, level) {
    if (!tree) return

    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]

      this.pug += `\n${this.parseNode(node, level)}`

      if (
        node.childNodes &&
        node.childNodes.length > 0 &&
        !this.isUniqueTextNode(node)
      ) {
        yield * this.walk(node.childNodes, level + 1)
      }
    }
  }

  parseNode (node, level) {
    const indentation = '  '.repeat(level)

    if (treeAdapter.isDocumentTypeNode(node)) return `${indentation}doctype html`

    if (treeAdapter.isTextNode(node)) return `${indentation}| ${node.value}`

    else if (treeAdapter.isCommentNode(node))
      return `${node.data.split('\n').map(l => `${indentation}//${l}`).join('\n')}`

    else if (treeAdapter.isElementNode(node)) {
      let line = `${indentation}${this.setAttributes(node)}`

      if (this.isUniqueTextNode(node))
        line += ` ${node.childNodes[0].value}`

      return line
    }

    else return node
  }

  setAttributes (node) {
    let str = node.tagName === 'div' ? '' : node.tagName
    let attributes = []
    let classList = []

    // Adds #id and .class
    if (node.id) str += `#${node.id}`

    for (let a = 0; a < node.attrs.length; a++) {
      const attr = node.attrs[a]

      switch (attr.name) {
        case undefined:
        case 'id':
        case 'class':
          classList = attr.value.split(' ')
          break
        default:
          attributes.push(`${attr.name}='${attr.value}'`)
          break
      }
    }

    if (classList.length) str += `.${classList.join('.')}`
    if (attributes.length) str += `(${attributes.join(', ')})`

    return str
  }

  // Identify Node type
  is (type, node) {
    return (node.nodeName === type)
  }

  isUniqueTextNode(node) {
    return node.childNodes.length === 1 && treeAdapter.isTextNode(node.childNodes[0])
  }
}

module.exports = Parser
