'use strict'

const treeAdapter = require('parse5').treeAdapters.default

class Parser {
  constructor (root) {
    this.root = root
    this.pug = ''
  }

  parse () {
    const walk = this.walk(this.root.childNodes, 0)
    let it

    do {
      it = walk.next()
    } while (!it.done)

    return this.pug.substring(1)
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

    if (treeAdapter.isDocumentTypeNode(node)) {
      return `${indentation}doctype html`
    }

    if (treeAdapter.isTextNode(node)) return `${indentation}| ${node.value}`
    else if (treeAdapter.isCommentNode(node)) {
      return `${node.data
        .split('\n')
        .map(l => `${indentation}//${l}`)
        .join('\n')}`
    } else if (treeAdapter.isElementNode(node)) {
      let line = `${indentation}${this.setAttributes(node)}`

      if (this.isUniqueTextNode(node)) {
        line += ` ${node.childNodes[0].value}`
      }

      return line
    } else {
      return node
    }
  }

  setAttributes (node) {
    const { tagName, attrs: attributes } = node
    const attributeList = []
    let pugNode = tagName

    attributes.forEach(({ name, value }) => {
      let hasClass = false
      let hasId = false

      switch (name) {
        case 'id':
          hasId = true
          pugNode += `#${value}`
          break
        case 'class':
          hasClass = true
          pugNode += `.${value.split(' ').join('.')}`
          break
        default:
          attributeList.push(`${name}='${value}'`)
          break
      }

      // Remove div tagName
      if (tagName === 'div' && (hasId || hasClass)) {
        pugNode = pugNode.replace('div', '')
      }
    })

    if (attributeList.length) {
      pugNode += `(${attributeList.join(', ')})`
    }

    return pugNode
  }

  // Identify Node type
  is (type, node) {
    return node.nodeName === type
  }

  isUniqueTextNode (node) {
    return (
      node.childNodes.length === 1 && treeAdapter.isTextNode(node.childNodes[0])
    )
  }
}

module.exports = Parser
