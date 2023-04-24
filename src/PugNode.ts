import Attribute from './Attribute';
import { Nodes } from './Parser';

/**
 * Represents a Pug node element.
 */
class PugNode {
  // The pug node name
  public name: string;
  // The node value
  public value: string;
  // List of node attributes
  public attributes: Attribute[] = [];
  // Indent level
  public indentLevel: number;
  // Option to comma-separate attributes
  public commas: boolean = false;
  // Indent style
  public tabs: boolean = false;

  constructor(
    name: string,
    value: string = '',
    indentLevel: number = 0,
    tabs?: boolean,
    commas?: boolean,
  ) {
    this.name = name;
    this.value = value;
    this.indentLevel = indentLevel;
    if (tabs) {
      this.tabs = tabs;
    }
    if (commas) {
      this.commas = commas;
    }
  }

  /**
   * Adds a new attribute to the attributes list.
   *
   * @param name
   * @param value
   */
  public setAttribute(name: string, value: string, doubleQuotes?: boolean) {
    this.attributes.push(new Attribute(name, value, doubleQuotes));
  }

  /**
   * Creates a string representation of the Pug node.
   */
  public toString(): string {
    // Construct the string starting with the tag name.
    let str: string = this.tagName;

    // Add the element ID
    const id = this.attributes.find((attr: Attribute) => attr.name === 'id');
    if (id) {
      str += id.toString();
    }

    // Add the class names
    const className = this.attributes.find(
      (attr: Attribute) => attr.name === 'class',
    );
    if (className) {
      str += className.toString();
    }

    // Add the rest of the attributes
    const attrs = this.attributes
      .filter((attr: Attribute) => !['id', 'class'].includes(attr.name))
      .map((attr: Attribute) => attr.toString());
    if (attrs.length) {
      str += `(${attrs.join(this.commas ? ', ' : ' ')})`;
    }

    // Append the node value inline or as multi-line block.
    if (this.value) {
      if (this.isMultiLine) {
        // TODO change block character
        // TODO add indent
        const childIndent = this.getIndent(this.indentLevel + 1);
        str += `.\n${childIndent}${this.value}`;
      } else {
        // The following leading space is not an indent, but the
        // standard single space between the node name and its value.
        // Text nodes don't have tag names, so no space needed there.
        str += str.length ? ` ${this.value}` : this.value;
      }
    }

    const rootIndent = this.getIndent();
    return `${rootIndent}${str}`;
  }

  /**
   * Returns the tag name using appropriate short forms.
   */
  private get tagName(): string {
    switch (this.name) {
      case Nodes.Text:
        return '';
      case Nodes.Doctype:
        return 'doctype';
      case Nodes.Comment:
        return '//';
      case Nodes.Div: {
        const hasClassOrId = this.attributes.some((attr: Attribute) =>
          ['class', 'id'].includes(attr.name),
        );
        return hasClassOrId ? '' : this.name;
      }
      default:
        return this.name;
    }
  }

  /**
   * Returns the indent based on indent level and indent style.
   *
   * @param level
   */
  private getIndent(level: number = this.indentLevel): string {
    const indentStyle = this.tabs ? '\t' : '  ';
    return indentStyle.repeat(level);
  }

  // Denotes whether the value is multi-line or not
  private get isMultiLine(): boolean {
    if (!this.value) {
      return false;
    }
    const lines = this.value.split('\n');
    return lines.length > 1;
  }
}

export default PugNode;
