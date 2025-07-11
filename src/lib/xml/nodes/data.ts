import { XmlHasParent } from '../mixins/has_parent.js';
import { XmlNode } from 'node.js';

/// Abstract XML data node.
abstract class XmlData extends XmlNode implements XmlHasParent<XmlNode> {
    /// Create a data section with `value`.
    XmlData(this.value);

    // The textual value of this node.
    @override
  String value;


    @Deprecated('Use `XmlData.value` setter instead')
    set text(String text) => value = text;
}