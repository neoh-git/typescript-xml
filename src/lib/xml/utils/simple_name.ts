import { XmlName } from './name.js';
import { lookupAttribute } from './namespace.js';

/// An XML entity name without a prefix.
export class XmlSimpleName extends XmlName {
    constructor(local: string) {
        super();
        this.local = local;
    }

    local!: string;

    readonly prefix: string | undefined = undefined;

    readonly qualified: string = this.local;

    readonly namespaceUri: string | undefined = lookupAttribute(this.local, this.parent, undefined)?.value;

    copy(): XmlSimpleName {
        return new XmlSimpleName(this.local);
    }
}