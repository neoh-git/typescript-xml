import { XmlNodeType } from '../enums/node_type.js';
import { WithXmlAttributesBase } from '../mixins/has_attributes.js';
import { WithXmlChildrenBase } from '../mixins/has_children.js';
import type { XmlParentBase } from '../mixins/has_parent.js';
import type { XmlValueBase } from '../mixins/has_value.js';
import type { XmlHasVisitor } from '../mixins/has_visitor.js';
import { XmlHasWriter } from '../mixins/has_writer.js';
import { applyMixins } from '../utils/apply_mixins.js';

// Immutable abstract XML node.
export abstract class XmlNode extends WithXmlChildrenBase(WithXmlAttributesBase()) {
    constructor() {
        super();
    }

    abstract readonly nodeType: XmlNodeType;
    // Return a copy of this node and all its children.
    abstract copy(): XmlNode;
}
// export interface XmlNode extends XmlAttributesBase, XmlChildrenBase, XmlHasVisitor, XmlHasWriter, XmlParentBase, XmlValueBase { }
// applyMixins(XmlNode, [XmlAttributesBase, XmlChildrenBase, XmlHasWriter, XmlParentBase, XmlValueBase]);