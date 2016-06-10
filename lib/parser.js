'use strict'

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

      this.pug += `\n${'  '.repeat(level)}${this.parseNode(node)}`

      if (node.childNodes && node.childNodes.length > 1) {
        yield * this.walk(node.childNodes, level + 1)
      }
    }
  }

  parseNode (node) {
    if (this.is('#documentType', node)) return `doctype html`

    if (this.is('#text', node)) return `| ${node.value}`

    else if (this.is('#comment', node))
      return `//${node.data}`

    else if (node.nodeName) {
      let line = this.setAttributes(node)

      if (node.childNodes.length === 1 && this.is('#text', node.childNodes[0]))
        line += ` ${node.childNodes[0].value}`

      return line
    }

    else return node
  }

  setAttributes (node) {
    let str = node.nodeName === 'DIV' ? '' : node.nodeName.toLowerCase()
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
}

module.exports = Parser
