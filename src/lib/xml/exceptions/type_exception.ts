import { XmlNodeType } from '../enums/node_type.js';
import { XmlHasChildren } from '../mixins/has_children.js';
import { XmlNode } from '../nodes/node.js';
import { XmlException } from './exception.js';

/**
 * Exception thrown when an unsupported node type is used.
 */
export class XmlNodeTypeException extends XmlException {
    /**
     * The unsupported node.
     */
    readonly node: XmlNode;

    /**
     * The expected node types.
     */
    readonly types: Iterable<XmlNodeType>;

    /**
     * Creates a new XmlNodeTypeException.
     */
    constructor(
        message: string,
        options: { node: XmlNode; types: Iterable<XmlNodeType> }
    ) {
        super(message);
        this.node = options.node;
        this.types = options.types;
    }

    /**
     * Ensure that `node` is of one of the provided `types`.
     */
    static checkValidType(node: XmlNode, types: Iterable<XmlNodeType>): void {
        let found = false;
        for (const type of types) {
            if (node.nodeType === type) {
                found = true;
                break;
            }
        }
        if (!found) {
            throw new XmlNodeTypeException(
                `Got ${node.nodeType}, but expected one of ${Array.from(types).join(', ')}`,
                { node, types }
            );
        }
    }

    /**
     * Ensure that `node` can have children.
     */
    static checkHasChildren(node: XmlNode): void {
        if (!(node instanceof XmlHasChildren)) {
            throw new XmlNodeTypeException(
                `${node.nodeType} cannot have child nodes.`,
                { node, types: [] }
            );
        }
    }

    override toString(): string {
        return `XmlNodeTypeException: ${this.message}`;
    }
}