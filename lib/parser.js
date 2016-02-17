'use strict'

class Parser {
  constructor (window, document, opts) {
    this.window = window
    this.document = document
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

      if (node.childNodes.length)
        yield * this.walk(node.childNodes, level + 1)
    }
  }

  parseNode (node) {
    if (node instanceof this.window.Text) return `| ${node.textContent}`

    else if (node instanceof this.window.Comment)
      return `//${node.textContent}`

    else if (node.tagName) {
      return this.setAttributes(node)
    }

    else return node
  }

  setAttributes (node) {
    let str = node.tagName.toLowerCase()
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
}

module.exports = Parser
