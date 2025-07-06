import { XmlParentException } from '../exceptions/parent_exception.js';
import { XmlNode } from '../nodes/node.js';

export interface XmlParentBase {
    // Return the parent node of this node, or `undefined` if there is none.
    get parent(): XmlNode | undefined;

    // Test whether the node has a parent or not.
    get hasParent(): boolean;

    // Internal helper to attach a child to this parent, do not call directly.
    attachParent(parent: XmlNode): void;

    // Internal helper to detach a child from its parent, do not call directly.
    detachParent(parent: XmlNode): void;
}

/**
 * A helper class that encapsulates the logic for managing a node's parent.
 * It contains the state and methods from the `XmlHasParent` mixin.
 */
export class XmlHasParent<T extends XmlNode> {
    private _parent?: T = undefined;

    /**
     * @param ownerNode The node that this manager is responsible for.
     *                  Used for providing context in error messages.
     */
    constructor(private readonly ownerNode: XmlNode) { }

    /**
     * Returns the parent node, or `undefined` if there is none.
     */
    get parent(): T | undefined {
        return this._parent;
    }

    /**
     * Returns `true` if the node has a parent.
     */
    get hasParent(): boolean {
        return this._parent !== undefined;
    }

    /**
     * Internal method to attach a child to this parent.
     * Should only be called by the parent's manipulation methods (e.g., `addChild`).
     * @param parent The node to set as the parent.
     */
    attachParent(parent: T): void {
        // This logic comes from `XmlParentException.checkNoParent(this)`.
        if (this._parent !== undefined) {
            throw XmlParentException.checkNoParent(this);
        }
        this._parent = parent;
    }

    /**
     * Internal method to detach a child from its parent.
     * Should only be called by the parent's manipulation methods (e.g., `removeChild`).
     * @param parent The node to check against the current parent before detaching.
     */
    detachParent(parent: T): void {
        // This logic comes from `XmlParentException.checkMatchingParent(this, parent)`.
        if (this._parent !== parent) {
            throw XmlParentException.checkNoParent(this);
        }
        this._parent = undefined;
    }
}