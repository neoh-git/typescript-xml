import { XmlNodeType } from '../enums/node_type.js';
import type { IHasAttributes } from '../mixins/has_attributes.js';
import type { IHasChildren } from '../mixins/has_children.js';
import type { IHasParent } from '../mixins/has_parent.js';
import type { IHasValue } from '../mixins/has_value.js';
import type { IHasVisitor } from '../mixins/has_visitor.js';
import type { IHasWriter } from '../mixins/has_writer.js';

/**
 * Abstract XML node.
 */
export abstract class XmlNode implements IHasAttributes, IHasChildren, IHasParent, IHasValue, IHasVisitor, IHasWriter {
    /**
     * Return the node type of this node.
     */
    abstract readonly nodeType: XmlNodeType;

    /**
     * Return a copy of this node and all its children.
     */
    abstract copy(): XmlNode;

    // Properties from mixins
    attributes!: any[];
    children!: XmlNode[];
    parent?: XmlNode;
    value?: string;

    // Methods from mixins
    abstract getAttribute(name: string): string | undefined;
    abstract getAttributeNode(name: string): any;
    abstract setAttribute(name: string, value: string): void;
    abstract accept(visitor: unknown): void;
    abstract writeTo(buffer: string[], options: unknown): void;
    abstract writeToAsync(buffer: string[], options: unknown): Promise<void>;
}
