/**
 * Represents a single attribute on a [PugNode].
 */
class Attribute {
  // Attribute name
  public name: string;
  // Attribute value
  public value: string;
  // Quote style for values
  public doubleQuotes: boolean = false;

  constructor(name: string, value: string, doubleQuotes?: boolean) {
    this.name = name;
    this.value = value;
    if (doubleQuotes) {
      this.doubleQuotes = doubleQuotes;
    }
  }

  /**
   * Returns a quote character based on quote style.
   */
  private get quote() {
    return this.doubleQuotes ? '"' : '\'';
  }

  /**
   * Creates a string representation of the attribute.
   * e.g. key="value"
   */
  public toString(): string {
    switch (this.name) {
      case 'id':
        return `#${this.value}`;

      case 'class':
        return `.${this.value.split(' ').join('.')}`;

      default: {
        // If value is blank, return just the name (shorthand)
        if (!this.value) {
          return this.name;
        }
        // Add escaped single quotes (\') to attribute values
        // to allow for surrounding single quotes.
        const safeValue: string = this.value.replace(/'/g, '\\\'');
        return `${this.name}=${this.quote}${safeValue}${this.quote}`;
      }
    }
  }
}

export default Attribute;
