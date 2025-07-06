import type { XmlVisitor } from "../visitors/visitor.js";

export interface XmlHasVisitor {
    accept(visitor: XmlVisitor): void;
}