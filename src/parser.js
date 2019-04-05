const {
  isDocumentTypeNode,
  isTextNode,
  isElementNode,
  isCommentNode
} = require('parse5').treeAdapters.default

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
    const { tagName, attrs: attributes } = node
    const attributeList = []
    let pugNode = tagName

    attributes.forEach(({ name, value }) => {
      let noTag = false

      switch (name) {
        case 'id':
          noTag = true
          pugNode += `#${value}`
          break

        case 'class':
          noTag = true
          pugNode += `.${value.split(' ').join('.')}`
          break

        default:
          // Add escaped single quotes (\') to attribute values
          const val = value.replace(/'/g, "\\'")
          attributeList.push(`${name}='${val}'`)
          break
      }

      // Remove div tag
      if (tagName === 'div' && noTag) {
        pugNode = pugNode.replace('div', '')
      }
    })

    if (attributeList.length) {
      pugNode += `(${attributeList.join(', ')})`
    }

    return pugNode
  }

  isUniqueTextNode (node) {
    return node.childNodes.length === 1 && isTextNode(node.childNodes[0])
  }
}

module.exports = Parser
