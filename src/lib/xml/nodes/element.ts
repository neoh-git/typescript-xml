import { XmlNodeType } from '../enums/node_type.js';
import { XmlHasAttributes } from '../mixins/has_attributes.js';
import { XmlHasChildren } from '../mixins/has_children.js';
import { XmlHasName } from '../mixins/has_name.js';
import { XmlHasParent } from '../mixins/has_parent.js';
import { XmlName } from '../utils/name.js';
import { XmlVisitor } from '../visitors/visitor.js';
import { XmlAttribute } from './attribute.js';
import { XmlNode } from './node.js';

export class XmlElement extends XmlNode
    implements XmlHasName, XmlHasParent<XmlNode>, XmlHasAttributes, XmlHasChildren<XmlNode> {
    public isSelfClosing: boolean;
    public name: XmlName;

    constructor(
        name: XmlName,
        attributes: Iterable<XmlAttribute> = [],
        children: Iterable<XmlNode> = [],
        isSelfClosing: boolean = true
    ) {
        super();
        this.name = name;
        this.isSelfClosing = isSelfClosing;

        // Mixins initialization
        (this as any).attributes = [];
        (this as any).children = [];

        if (typeof (this.name as any).attachParent === 'function') {
            (this.name as any).attachParent(this);
        }
        if (typeof (this as any).attributes.initialize === 'function') {
            (this as any).attributes.initialize(this, attributeNodeTypes);
        }
        if (typeof (this as any).attributes.addAll === 'function') {
            (this as any).attributes.addAll(attributes);
        } else {
            for (const attr of attributes) {
                (this as any).attributes.push(attr);
            }
        }
        if (typeof (this as any).children.initialize === 'function') {
            (this as any).children.initialize(this, childrenNodeTypes);
        }
        if (typeof (this as any).children.addAll === 'function') {
            (this as any).children.addAll(children);
        } else {
            for (const child of children) {
                (this as any).children.push(child);
            }
        }
    }

    static tag(
        qualifiedName: string,
        options: {
            attributes?: Iterable<XmlAttribute>;
            children?: Iterable<XmlNode>;
            isSelfClosing?: boolean;
        } = {}
    ): XmlElement {
        const {
            attributes = [],
            children = [],
            isSelfClosing = true,
        } = options;
        return new XmlElement(
            XmlName.fromString(qualifiedName),
            attributes,
            children,
            isSelfClosing
        );
    }

    readonly nodeType: XmlNodeType = XmlNodeType.ELEMENT;

    copy(): XmlElement {
        return new XmlElement(
            this.name.copy(),
            Array.from((this as any).attributes, (each: XmlAttribute) => each.copy()),
            Array.from((this as any).children, (each: XmlNode) => each.copy()),
            this.isSelfClosing
        );
    }
}

// Supported child node types.
export const childrenNodeTypes: Set<XmlNodeType> = new Set([
    XmlNodeType.CDATA,
    XmlNodeType.COMMENT,
    XmlNodeType.ELEMENT,
    XmlNodeType.PROCESSING,
    XmlNodeType.TEXT,
]);

// Supported attribute node types.
export const attributeNodeTypes: Set<XmlNodeType> = new Set([
    XmlNodeType.ATTRIBUTE,
]);