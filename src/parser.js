const DOCUMENT_TYPE_NODE = '#documentType'
const TEXT_NODE = '#text'
const DIV_NODE = 'div'
const COMMENT_NODE = '#comment'
const COMMENT_NODE_PUG = '//'

const hasSingleTextNodeChild = node => {
  return (
    node.childNodes &&
    node.childNodes.length === 1 &&
    node.childNodes[0].nodeName === TEXT_NODE
  )
}

class Parser {
  constructor({ root, useTabs = false }) {
    this.root = root
    this.useTabs = useTabs
    this.pug = ''
  }

  // Tab vs. Space
  get indentType() {
    return this.useTabs ? '\t' : '  '
  }

  getIndent(level = 0) {
    return this.indentType.repeat(level)
  }

  parse() {
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
  *walk(tree, level) {
    if (!tree) {
      return
    }

    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]

      const newline = this.parseNode(node, level)
      if (newline) {
        this.pug += `\n${newline}`
      }

      if (
        node.childNodes &&
        node.childNodes.length > 0 &&
        !hasSingleTextNodeChild(node)
      ) {
        yield* this.walk(node.childNodes, level + 1)
      }
    }
  }

  /*
   * Returns a Pug node name with all attributes set in parentheses.
   */
  static getNodeWithAttributes(node) {
    const { tagName, attrs } = node
    const attributes = []
    let pugNode = tagName

    if (!attrs) {
      return pugNode
    }

    // Add CSS selectors to pug node and append any element attributes to it
    for (const attr of attrs) {
      const { name, value } = attr

      // Remove div tag if a selector is present (shorthand)
      // e.g. div#form() -> #form()
      const hasSelector = name === 'id' || name === 'class'
      if (tagName === DIV_NODE && hasSelector) {
        pugNode = pugNode.replace(DIV_NODE, '')
      }

      switch (name) {
        case 'id':
          pugNode += `#${value}`
          break
        case 'class':
          pugNode += `.${value.split(' ').join('.')}`
          break
        default: {
          // Add escaped single quotes (\') to attribute values
          const val = value.replace(/'/g, "\\'")
          attributes.push(`${name}='${val}'`)
          break
        }
      }
    }

    if (attributes.length) {
      pugNode += `(${attributes.join(', ')})`
    }

    return pugNode
  }

  /**
   * formatPugNode applies the correct indent for the current line,
   * and formats the value as either as a single or multiline string.
   *
   * @param {String} node - The pug node (e.g. header(class='foo'))
   * @param {String} value - The node's value
   * @param {Number} level - Current tree level to generate indent
   * @param {String} blockChar - The character used to denote a multiline value
   */
  formatPugNode(node, value = '', level, blockChar = '.') {
    const indent = this.getIndent(level)
    const result = `${indent}${node}`

    const lines = value.split('\n')

    if (lines.length > 1) {
      const indentChild = this.getIndent(level + 1)
      const multiline = lines.map(line => `${indentChild}${line}`).join('\n')
      return `${result}${blockChar}\n${multiline}`
    }

    return value.length ? `${result} ${value}` : result
  }

  /**
   * createDoctype formats a #documentType element
   */
  createDoctype(node, level) {
    const indent = this.getIndent(level)
    return `${indent}doctype html`
  }

  /**
   * createComment formats a #comment element.
   *
   * Block comments in Pug don't require the dot '.' character.
   */
  createComment(node, level) {
    return this.formatPugNode(COMMENT_NODE_PUG, node.data, level, '')
  }

  /**
   * createText formats a #text element.
   *
   * A #text element containing only line breaks (\n) indicates
   * unnecessary whitespace between elements that should be removed.
   *
   * Actual text in a single #text element has no significant
   * whitespace and should be treated as inline text.
   */
  createText(node, level) {
    const { value } = node
    const indent = this.getIndent(level)

    // Omit line breaks between HTML elements
    if (/^[\n]+$/.test(value)) {
      return false
    }

    return `${indent}| ${value}`
  }

  /**
   * createElement formats a generic HTML element.
   */
  createElement(node, level) {
    let pugNode = Parser.getNodeWithAttributes(node)

    if (hasSingleTextNodeChild(node)) {
      const value = node.childNodes[0].value
      return this.formatPugNode(pugNode, value, level)
    }

    return this.formatPugNode(pugNode, node.value, level)
  }

  parseNode(node, level) {
    let { nodeName } = node

    switch (nodeName) {
      case DOCUMENT_TYPE_NODE:
        return this.createDoctype(node, level)

      case COMMENT_NODE:
        return this.createComment(node, level)

      case TEXT_NODE:
        return this.createText(node, level)

      default:
        return this.createElement(node, level)
    }
  }
}

module.exports = Parser
