import { XmlAttributeType } from '../enums/attribute_type.js';
import { XmlNodeType } from '../enums/node_type.js';
import { WithXmlHasName } from '../mixins/has_name.js';
import { XmlHasParent } from '../mixins/has_parent.js';
import { XmlName } from '../utils/name.js';
import { XmlVisitor } from '../visitors/visitor.js';
import { XmlNode } from './node.js';

export class XmlAttribute extends XmlNode implements WithXmlHasName, XmlHasParent<XmlNode> {
    public readonly name: XmlName;
    public value: string;
    public readonly attributeType: XmlAttributeType;

    constructor(
        name: XmlName,
        value: string,
        attributeType: XmlAttributeType = XmlAttributeType.DOUBLE_QUOTE
    ) {
        super();
        this.name = name;
        this.value = value;
        this.attributeType = attributeType;
        this.name.attachParent(this);
    }

    get nodeType(): XmlNodeType {
        return XmlNodeType.ATTRIBUTE;
    }

    copy(): XmlAttribute {
        return new XmlAttribute(this.name.copy(), this.value, this.attributeType);
    }

    accept(visitor: XmlVisitor): void {
        visitor.visitAttribute(this);
    }

    // Implementations for mixins if needed
    attachParent(parent: XmlNode): void {
        // Implementation depends on XmlHasParent mixin
    }
}