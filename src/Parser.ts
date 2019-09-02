import {
  DefaultTreeCommentNode,
  DefaultTreeDocument,
  DefaultTreeElement,
  DefaultTreeNode,
  DefaultTreeTextNode,
} from 'parse5';
import { Options } from './Options';
import PugNode from './PugNode';

// Defines the type of parsed HTML nodes.
export enum Nodes {
  Doctype = '#documentType',
  Text = '#text',
  Comment = '#comment',
  Div = 'div',
}

/**
 * Parses an HTML document and creates a Pug string.
 */
class Parser {
  public pug: string = '';
  public root: DefaultTreeDocument;
  // Tabs vs Spaces
  public tabs: boolean;
  // Comma separate attributes
  public commas: boolean;
  // Use double quotes or single
  public doubleQuotes: boolean;

  constructor(root: DefaultTreeDocument, options: Options) {
    this.root = root;

    const {
      commas,
      doubleQuotes,
      tabs,
    }: {
      commas: boolean;
      doubleQuotes: boolean;
      tabs: boolean;
    } = options;

    this.commas = commas;
    this.doubleQuotes = doubleQuotes;
    this.tabs = tabs;
  }

  public parse(): string {
    const walk = this.walk(this.root.childNodes, 0);
    let iterator;

    do {
      iterator = walk.next();
    } while (!iterator.done);

    return this.pug.substring(1);
  }

  /**
   * DOM tree traversal
   * Depth-first search (pre-order)
   *
   * @param {DefaultTreeNode[]} tree - DOM Node tree
   * @param {Number} level - Current tree level
   */
  private *walk(
    tree: DefaultTreeNode[],
    indentLevel: number,
  ): IterableIterator<void> {
    if (!tree.length) {
      return;
    }

    for (const treeNode of tree) {
      const node = treeNode as DefaultTreeElement;

      const pugNode = this.parseHtmlNode(node, indentLevel);
      if (pugNode) {
        this.pug += `\n${pugNode.toString()}`;
      }

      if (
        Array.isArray(node.childNodes) &&
        node.childNodes.length &&
        !hasOnlyTextChildNode(node)
      ) {
        yield* this.walk(node.childNodes, indentLevel + 1);
      }
    }
  }
  /**
   * Creates a [PugNode] from a #documentType element.
   *
   * @param indentLevel
   */
  private createDoctypeNode = (indentLevel: number): PugNode =>
    new PugNode(
      Nodes.Doctype,
      'doctype html',
      indentLevel,
      this.tabs,
      this.commas,
    );

  /**
   * Creates a [PugNode] from a #comment element.
   * Block comments in Pug don't require the dot '.' character.
   *
   * @param indentLevel
   */
  private createCommentNode = (
    node: DefaultTreeCommentNode,
    indentLevel: number,
  ): PugNode =>
    new PugNode(Nodes.Comment, node.data, indentLevel, this.tabs, this.commas);

  /**
   * Creates a [PugNode] from a #text element.
   *
   * A #text element containing only line breaks (\n) indicates
   * unnecessary whitespace between elements that should be removed.
   *
   * Actual text in a single #text element has no significant
   * whitespace and should be treated as inline text.
   */
  private createTextNode(
    node: DefaultTreeTextNode,
    indentLevel: number,
  ): PugNode | void {
    const value: string = node.value;
    // Omit line breaks between HTML elements
    if (/^[\n]+$/.test(value)) {
      return;
    }

    return new PugNode(Nodes.Text, value, indentLevel, this.tabs, this.commas);
  }

  /**
   * Converts an HTML element into a [PugNode].
   *
   * @param node
   */
  private createElementNode(
    node: DefaultTreeElement,
    indentLevel: number,
  ): PugNode {
    let value: string = '';
    if (hasOnlyTextChildNode(node)) {
      const textNode = node.childNodes[0] as DefaultTreeTextNode;
      value = textNode.value;
    }

    const pugNode = new PugNode(
      node.tagName,
      value,
      indentLevel,
      this.tabs,
      this.commas,
    );
    node.attrs.forEach(attr =>
      pugNode.setAttribute(attr.name, attr.value, this.doubleQuotes),
    );
    return pugNode;
  }

  /**
   * Parses the HTML node and converts it to a [PugNode].
   *
   * @param node
   * @param indentLevel
   */
  private parseHtmlNode(
    node: DefaultTreeNode,
    indentLevel: number,
  ): PugNode | void {
    switch (node.nodeName) {
      case Nodes.Doctype:
        return this.createDoctypeNode(indentLevel);
      case Nodes.Comment:
        return this.createCommentNode(
          node as DefaultTreeCommentNode,
          indentLevel,
        );
      case Nodes.Text:
        return this.createTextNode(node as DefaultTreeTextNode, indentLevel);
      default:
        return this.createElementNode(node as DefaultTreeElement, indentLevel);
    }
  }

  /*
   * formatPugNode applies the correct indent for the current line,
   * and formats the value as either as a single or multiline string.
  private formatPugNode(
    node: PugNode,
    value: string = '',
    level: number,
    blockChar: string = '.',
  ): PugNode {
    const indent = this.getIndent(level);
    const result = `${indent}${node.toString()}`;

    const lines = value.split('\n');

    // Create an inline node
    if (lines.length <= 1) {
      return value.length ? `${result} ${value}` : result;
    }

    // Create a multiline node
    const indentChild = this.getIndent(level + 1);
    const multiline = lines.map(line => `${indentChild}${line}`).join('\n');

    return `${result}${blockChar}\n${multiline}`;
  }

  /**
   * createDoctype formats a #documentType element
  private createDoctype(level: number) {
    const indent = this.getIndent(level);
    return `${indent}doctype html`;
  }

  /**
   * createComment formats a #comment element.
   *
   * Block comments in Pug don't require the dot '.' character.
  private createComment(node: DefaultTreeCommentNode, level: number) {
    return this.formatPugNode(COMMENT_NODE_PUG, node.data, level, '');
  }

  /**
   * createText formats a #text element.
   *
   * A #text element containing only line breaks (\n) indicates
   * unnecessary whitespace between elements that should be removed.
   *
   * Actual text in a single #text element has no significant
   * whitespace and should be treated as inline text.
  private createText(node: DefaultTreeTextNode, level: number) {
    const { value } = node;
    const indent = this.getIndent(level);

    // Omit line breaks between HTML elements
    if (/^[\n]+$/.test(value)) {
      return false;
    }

    return `${indent}| ${value}`;
  }

  /**
   * createElement formats a generic HTML element.
  private createElement(node: DefaultTreeElement, level: number) {
    const pugNode: PugNode = this.createPugNode(node);

    const value = hasSingleTextNodeChild(node)
      ? node.childNodes[0].value
      : node.value;

    return this.formatPugNode(pugNode, value, level);
  }

  private parseNode(node: DefaultTreeNode, level: number) {
    const { nodeName } = node;

    switch (nodeName) {
      case DOCUMENT_TYPE_NODE:
        return this.createDoctype(level);

      case COMMENT_NODE:
        return this.createComment(node as DefaultTreeCommentNode, level);

      case TEXT_NODE:
        return this.createText(node as DefaultTreeTextNode, level);

      default:
        return this.createElement(node as DefaultTreeElement, level);
    }
  }
  */
}

/**
 * Checks whether a [node] only has a single text child node.
 *
 * @param node
 */
function hasOnlyTextChildNode(node: DefaultTreeElement): boolean {
  if (Array.isArray(node.childNodes) && node.childNodes.length === 1) {
    if (node.childNodes[0].nodeName === Nodes.Text) {
      return true;
    }
  }
  return false;
}

export default Parser;
