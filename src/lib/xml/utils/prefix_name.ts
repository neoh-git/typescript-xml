import { XmlName } from './name.js';
import { lookupAttribute, xmlns } from './namespace.js';

/**
 * An XML entity name with a prefix.
 */
export class XmlPrefixName extends XmlName {
    readonly prefix: string;
    readonly local: string;
    readonly qualified: string;

    constructor(prefix: string, local: string, qualified: string) {
        super();
        this.prefix = prefix;
        this.local = local;
        this.qualified = qualified;
    }

    get namespaceUri(): string | undefined {
        // Assumes `parent` is a property of XmlName or its subclasses
        // and that lookupAttribute returns an object with a `value` property or undefined.
        const attr = lookupAttribute((this as any).parent, xmlns, this.prefix);
        return attr?.value;
    }

    override copy(): XmlName {
        return new XmlPrefixName(this.prefix, this.local, this.qualified) as XmlName;
    }
}