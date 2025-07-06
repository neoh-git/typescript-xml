import { EmtpyClass, type Constructor } from '../utils/apply_mixins.js';
import '../utils/name.js';
import type { XmlName } from '../utils/name.js';

export class XmlHasName {
  // The XmlName instance is a dependency injected via the constructor.
  constructor(readonly xmlName: XmlName) { }

  /**
   * Return the fully qualified name, including the namespace prefix.
   * e.g., 'atom:link'
   */
  public get qualifiedName(): string {
    return this.xmlName.qualified;
  }

  /**
   * Return the local name, excluding the namespace prefix.
   * e.g., 'link' from 'atom:link'
   */
  public get localName(): string {
    return this.xmlName.local;
  }

  /**
   * Return the namespace prefix, or `undefined` if not present.
   * e.g., 'atom' from 'atom:link'
   */
  public get namespacePrefix(): string | undefined {
    return this.xmlName.prefix;
  }

  /**
   * Return the namespace URI, or `undefined` if not available.
   */
  public get namespaceUri(): string | undefined {
    return this.xmlName.namespaceUri;
  }
}