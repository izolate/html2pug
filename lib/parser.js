'use strict'

class Parser {
  constructor (document, opts) {
    this.document = document
    this.window = document.defaultView
    this.pug = ''
  }

  parse (tree) {
    return new Promise((yep, nope) => {
      const walk = this.walk(tree, 0)
      let it = walk.next()

      while (!it.done) it = walk.next()

      yep(this.pug)
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

      this.pug += `\n${'  '.repeat(level)}${this.parseNode(node)}`

      if (node.childNodes.length > 1) {
        yield * this.walk(node.childNodes, level + 1)
      }
    }
  }

  parseNode (node) {
    if (this.is('DocumentType', node)) return `doctype html`

    if (this.is('Text', node)) return `| ${node.textContent}`

    else if (this.is('Comment', node))
      return `//${node.textContent}`

    else if (node.nodeName) {
      let line = this.setAttributes(node)

      if (node.childNodes.length === 1 && this.is('Text', node.childNodes[0]))
        line += ` ${node.childNodes[0].textContent}`

      return line
    }

    else return node
  }

  setAttributes (node) {
    let str = node.nodeName === 'DIV' ? '' : node.nodeName.toLowerCase()
    let attributes = []

    // Adds #id and .class
    if (node.id) str += `#${node.id}`
    if (node.classList.length)
      for (let cls in node.classList) str += `.${node.classList[cls]}`

    for (let a = 0; a < node.attributes.length; a++) {
      const attr = node.attributes[a]

      switch (attr.localName) {
        case undefined:
        case 'id':
        case 'class':
          break
        default:
          attributes.push(`${attr.localName}='${attr.value}'`)
          break
      }
    }

    if (attributes.length) str += `(${attributes.join(', ')})`

    return str
  }

  // Identify Node type
  is (type, node) {
    return (node instanceof this.window[type])
  }
}

module.exports = Parser
