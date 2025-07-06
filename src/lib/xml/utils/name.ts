// No direct equivalent for Dart's @internal, but we can use JSDoc for documentation purposes.

import { XmlNode } from '../nodes/node.js';
import type { XmlVisitor } from '../visitors/visitor.js';
import { XmlToken } from './token.js';
import { XmlPrefixName } from './prefix_name.js';
import { XmlSimpleName } from './simple_name.js';
import type { XmlHasParent } from '../mixins/has_parent.js';
import type { XmlHasVisitor } from '../mixins/has_visitor.js';
import type { XmlHasWriter } from '../mixins/has_writer.js';
import type { XmlEntityMapping } from '../entities/entity_mapping.js';
import type { Predicate } from './predicate.js';
import type { XmlAttribute } from '../nodes/attribute.js';
import { XmlWriter } from '../visitors/writer.js';

// Abstract base class for XML entity name.
export abstract class XmlName implements XmlHasVisitor, XmlHasWriter {
    /**
     * Creates a qualified XmlName from a local name and an optional prefix.
     */
    static create(local: string, prefix?: string): XmlName {
        if (!prefix || prefix.length === 0) {
            return new XmlSimpleName(local);
        } else {
            return new XmlPrefixName(prefix, local, `${prefix}${XmlToken.namespace}${local}`);
        }
    }

    /**
     * Create an XmlName by parsing the provided qualified name.
     */
    static fromString(qualified: string): XmlName {
        const index = qualified.indexOf(XmlToken.namespace);
        if (index > 0) {
            const prefix = qualified.substring(0, index);
            const local = qualified.substring(index + 1);
            return new XmlPrefixName(prefix, local, qualified);
        } else {
            return new XmlSimpleName(qualified);
        }
    }

    /**
     * Return the namespace prefix, or undefined.
     */
    abstract get prefix(): string | undefined;

    /**
     * Return the local name, excluding the namespace prefix.
     */
    abstract readonly local: string;

    /**
     * Return the fully qualified name, including the namespace prefix.
     */
    abstract get qualified(): string;

    /**
     * Return the namespace URI, or null.
     */
    abstract get namespaceUri(): string | undefined;

    abstract copy(): XmlName;

    /**
     * Accept a visitor.
     */
    accept(visitor: XmlVisitor): void {
        visitor.visitName(this);
    }

    toXmlString(options: {
        pretty?: boolean;
        entityMapping?: XmlEntityMapping;
        level?: number;
        indent?: string;
        newLine?: string;
        preserveWhitespace?: Predicate<XmlNode>;
        indentAttribute?: Predicate<XmlAttribute>;
        sortAttributes?: (a: XmlAttribute, b: XmlAttribute) => number;
        spaceBeforeSelfClose?: Predicate<XmlNode>;
    } = {}): string {
        const {
            pretty = false,
            entityMapping,
            level,
            indent,
            newLine,
            preserveWhitespace,
            indentAttribute,
            sortAttributes,
            spaceBeforeSelfClose,
        } = options;

        const buffer: string[] = [];
        const writer = pretty
            ? new XmlPrettyWriter(buffer, {
                entityMapping,
                level,
                indent,
                newLine,
                preserveWhitespace,
                indentAttribute,
                sortAttributes,
                spaceBeforeSelfClose,
            })
            : new XmlWriter(buffer, entityMapping);

        writer.visit(this);
        return buffer.join('');
    }
}