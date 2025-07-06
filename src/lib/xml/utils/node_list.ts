import { XmlNodeType } from '../enums/node_type.js';
import { XmlParentException } from '../exceptions/parent_exception.js';
import { XmlNodeTypeException } from '../exceptions/type_exception.js';
import { XmlNode } from '../nodes/node.js';

/**
 * Mutable list of XmlNodes, manages the parenting of the nodes.
 */
export class XmlNodeList<E extends XmlNode> extends Array<XmlNode> {
    private _nodes: E[] = [];
    private _parent!: XmlNode;
    private _nodeTypes!: Set<XmlNodeType>;

    /**
     * Internal initializer of the node list with parent and supported node types.
     */
    initialize(parent: XmlNode, nodeTypes: Set<XmlNodeType>): void {
        this._parent = parent;
        this._nodeTypes = nodeTypes;
    }

    override get length(): number {
        return this._nodes.length;
    }

    get(index: number): E | undefined {
        if (index < 0 || index >= this._nodes.length) {
            throw new RangeError('Index out of range');
        }
        return this._nodes[index];
    }

    set(index: number, value: E): void {
        if (index < 0 || index >= this._nodes.length) {
            throw new RangeError('Index out of range');
        }
        if (value.nodeType === XmlNodeType.DOCUMENT_FRAGMENT) {
            this.replaceRange(index, index + 1, this._expandFragment(value));
        } else {
            XmlNodeTypeException.checkValidType(value, this._nodeTypes);
            XmlParentException.checkNoParent(value);
            this._nodes[index]?._detachParent(this._parent);
            this._nodes[index] = value;
            value._attachParent(this._parent);
        }
    }

    add(value: E): void {
        if (value.nodeType === XmlNodeType.DOCUMENT_FRAGMENT) {
            this.addAll(this._expandFragment(value));
        } else {
            XmlNodeTypeException.checkValidType(value, this._nodeTypes);
            XmlParentException.checkNoParent(value);
            this._nodes.push(value);
            value._attachParent(this._parent);
        }
    }

    addAll(iterable: Iterable<E>): void {
        const expanded = this._expandNodes(iterable);
        for (const node of expanded) {
            this._nodes.push(node);
            node._attachParent(this._parent);
        }
    }

    remove(value: E): boolean {
        const index = this._nodes.indexOf(value);
        if (index !== -1) {
            this._nodes[index]?._detachParent(this._parent);
            this._nodes.splice(index, 1);
            return true;
        }
        return false;
    }

    removeWhere(test: (element: E) => boolean): void {
        for (let i = this._nodes.length - 1; i >= 0; i--) {
            if (test(this._nodes[i]!)) {
                this._nodes[i]?._detachParent(this._parent);
                this._nodes.splice(i, 1);
            }
        }
    }

    retainWhere(test: (element: E) => boolean): void {
        for (let i = this._nodes.length - 1; i >= 0; i--) {
            if (!test(this._nodes[i]!)) {
                this._nodes[i]?._detachParent(this._parent);
                this._nodes.splice(i, 1);
            }
        }
    }

    clear(): void {
        for (const node of this._nodes) {
            node._detachParent(this._parent);
        }
        this._nodes = [];
    }

    removeLast(): E {
        if (this._nodes.length === 0) {
            throw new RangeError('No elements to remove');
        }
        const node = this._nodes.pop()!;
        node._detachParent(this._parent);
        return node;
    }

    removeRange(start: number, end: number): void {
        if (start < 0 || end > this._nodes.length || start > end) {
            throw new RangeError('Invalid range');
        }
        for (let i = start; i < end; i++) {
            this._nodes[i]?._detachParent(this._parent);
        }
        this._nodes.splice(start, end - start);
    }

    insert(index: number, element: E): void {
        if (element.nodeType === XmlNodeType.DOCUMENT_FRAGMENT) {
            this.insertAll(index, this._expandFragment(element));
        } else {
            XmlNodeTypeException.checkValidType(element, this._nodeTypes);
            XmlParentException.checkNoParent(element);
            this._nodes.splice(index, 0, element);
            element._attachParent(this._parent);
        }
    }

    insertAll(index: number, iterable: Iterable<E>): void {
        const expanded = this._expandNodes(iterable);
        this._nodes.splice(index, 0, ...expanded);
        for (const node of expanded) {
            node._attachParent(this._parent);
        }
    }

    removeAt(index: number): E | undefined {
        if (index < 0 || index >= this._nodes.length) {
            throw new RangeError('Index out of range');
        }
        const node = this._nodes[index];
        if (node === undefined) return undefined;
        node._detachParent(this._parent);
        this._nodes.splice(index, 1);
        return node;
    }

    replaceRange(start: number, end: number, iterable: Iterable<E>): void {
        if (start < 0 || end > this._nodes.length || start > end) {
            throw new RangeError('Invalid range');
        }
        for (let i = start; i < end; i++) {
            this._nodes[i]?._detachParent(this._parent);
        }
        const expanded = Array.from(this._expandNodes(iterable));
        this._nodes.splice(start, end - start, ...expanded);
        for (const node of expanded) {
            node._attachParent(this._parent);
        }
    }

    private _expandFragment(fragment: E): E[] {
        return fragment.children.map((node: XmlNode) => {
            XmlNodeTypeException.checkValidType(node, this._nodeTypes);
            return node.copy() as E;
        });
    }

    private _expandNodes(iterable: Iterable<E>): E[] {
        const expanded: E[] = [];
        for (const node of iterable) {
            if (node.nodeType === XmlNodeType.DOCUMENT_FRAGMENT) {
                expanded.push(...this._expandFragment(node));
            } else {
                XmlNodeTypeException.checkValidType(node, this._nodeTypes);
                XmlParentException.checkNoParent(node);
                expanded.push(node);
            }
        }
        return expanded;
    }

    // Optional: iterator support
    override[Symbol.iterator](): ArrayIterator<E> {
        return this._nodes[Symbol.iterator]();
    }
}
