import type { XmlHasVisitor } from "../mixins/has_visitor.js";
import type { XmlAttribute } from "../nodes/attribute.js";
import type { XmlName } from "../utils/name.js";

// Basic visitor over [XmlHasVisitor] nodes.
export interface XmlVisitor {
    visit(node: XmlHasVisitor): void;
    visitName(name: XmlName): void;
    visitAttribute(node: XmlAttribute): void;
    visitDeclaration(node: XmlDeclaration): void;
    visitDocument(node: XmlDocument): void;
    visitDocumentFragment(node: XmlDocumentFragment): void;
    visitElement(node: XmlElement): void;
    visitCDATA(node: XmlCDATA): void;
    visitComment(node: XmlComment): void;
    visitDoctype(node: XmlDoctype): void;
    visitProcessing(node: XmlProcessing): void;
    visitText(node: XmlText): void;
}