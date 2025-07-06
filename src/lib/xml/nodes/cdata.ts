import { XmlNodeType } from '../enums/node_type.js';
import type { XmlVisitor } from '../visitors/visitor.js';

class XmlCDATA extends XmlData {
    /// Create a CDATA section with `text`.
    XmlCDATA(super.value);

@override
  XmlNodeType get nodeType => XmlNodeType.CDATA;

@override
  XmlCDATA copy() => XmlCDATA(value);

@override
void accept(XmlVisitor visitor) => visitor.visitCDATA(this);
}