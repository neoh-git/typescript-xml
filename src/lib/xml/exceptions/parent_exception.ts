import { XmlException } from './exception.js';
import { XmlNode } from '../nodes/node.js';
import type { XmlParentBase } from '../mixins/has_parent.js';

/**
 * Exception thrown when the parent relationship between nodes is invalid.
 */
export class XmlParentException extends XmlException {
    public readonly node: XmlParentBase;
    public readonly parent?: XmlNode;

    /**
     * Creates a new XmlParentException.
     */
    constructor(message: string, node: XmlParentBase, parent?: XmlNode) {
        super(message);
        this.node = node;
        this.parent = parent;
        Object.setPrototypeOf(this, XmlParentException.prototype);
    }

    /**
     * Ensure that `node` has a parent and returns that node.
     */
    static checkParent(node: XmlParentBase): XmlNode {
        const parent = node.parent;
        if (!parent) {
            throw new XmlParentException('Node has no parent', node);
        }
        return parent;
    }

    /**
     * Ensure that `node` has no parent.
     */
    static checkNoParent(node: XmlParentBase): void {
        if (node.parent) {
            throw new XmlParentException(
                'Node already has a parent, copy or remove it first',
                node,
                node.parent
            );
        }
    }

    /**
     * Ensure that `node` has a matching parent.
     */
    static checkMatchingParent(node: XmlParentBase, parent: XmlNode): void {
        if (node.parent !== parent) {
            // If this exception is ever thrown, this is likely a bug in the internal
            // code of the library.
            throw new XmlParentException(
                'Node already has a non-matching parent',
                node,
                parent
            );
        }
    }

    override toString(): string {
        return `XmlParentException: ${this.message}`;
    }
}