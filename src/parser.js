const {
  isDocumentTypeNode,
  isTextNode,
  isElementNode,
  isCommentNode
} = require('parse5/lib/tree-adapters/default')

class Parser {
  constructor ({ root, useTabs = false }) {
    this.root = root
    this.useTabs = useTabs
    this.pug = ''
  }

  get indent () {
    return this.useTabs ? '\t' : '  '
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
    if (!tree) {
      return
    }

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

  parseComment (node, indent) {
    const comment = node.data.split('\n')

    // Differentiate single line to multi-line comments
    if (comment.length > 1) {
      const multiLine = comment.map(line => `${indent}  ${line}`).join('\n')
      return `${indent}//${multiLine}`
    } else {
      return `${indent}//${comment}`
    }
  }

  parseNode (node, level) {
    const indent = this.indent.repeat(level)

    if (isDocumentTypeNode(node)) {
      return `${indent}doctype html`
    }

    if (isTextNode(node)) {
      return `${indent}| ${node.value}`
    } else if (isCommentNode(node)) {
      return this.parseComment(node, indent)
    } else if (isElementNode(node)) {
      let line = `${indent}${this.setAttributes(node)}`

      if (this.isUniqueTextNode(node)) {
        line += ` ${node.childNodes[0].value}`
      }

      return line
    } else {
      return node
    }
  }

  setAttributes (node) {
    const { tagName, attrs } = node
    const attributes = []
    let pugNode = tagName

    // Add CSS selectors to pug node and append any element attributes to it
    for (const attr of attrs) {
      const { name, value } = attr

      // Remove div tag if a selector is present (shorthand)
      // e.g. div#form() -> #form()
      const hasSelector = name === 'id' || name === 'class'
      if (tagName === 'div' && hasSelector) {
        pugNode = pugNode.replace('div', '')
      }

      switch (name) {
        case 'id':
          pugNode += `#${value}`
          break
        case 'class':
          pugNode += `.${value.split(' ').join('.')}`
          break
        default:
          // Add escaped single quotes (\') to attribute values
          const val = value.replace(/'/g, "\\'")
          attributes.push(`${name}='${val}'`)
          break
      }
    }

    if (attributes.length) {
      pugNode += `(${attributes.join(', ')})`
    }

    return pugNode
  }

  isUniqueTextNode (node) {
    return node.childNodes.length === 1 && isTextNode(node.childNodes[0])
  }
}

module.exports = Parser
