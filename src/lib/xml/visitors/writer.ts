import { defaultEntityMapping } from '../entities/default_mapping.js';
import { XmlEntityMapping } from '../entities/entity_mapping.js';
import { XmlHasAttributes } from '../mixins/has_attributes.js';
import type { XmlHasVisitor } from '../mixins/has_visitor.js';
import { XmlAttribute } from '../nodes/attribute.js';
import { XmlCDATA } from '../nodes/cdata.js';
import { XmlComment } from '../nodes/comment.js';
import { XmlDeclaration } from '../nodes/declaration.js';
import { XmlDoctype } from '../nodes/doctype.js';
import { XmlDocument } from '../nodes/document.js';
import { XmlDocumentFragment } from '../nodes/document_fragment.js';
import { XmlElement } from '../nodes/element.js';
import { XmlProcessing } from '../nodes/processing.js';
import { XmlText } from '../nodes/text.js';
import { XmlName } from '../utils/name.js';
import { XmlToken } from '../utils/token.js';
import type { XmlVisitor } from './visitor.js';

export class XmlWriter implements XmlVisitor {
    private buffer: string[];
    private entityMapping: XmlEntityMapping;

    constructor(buffer: string[], entityMapping?: XmlEntityMapping) {
        this.buffer = buffer;
        this.entityMapping = entityMapping ?? defaultEntityMapping;
    }

    visitAttribute(node: XmlAttribute): void {
        this.visit(node.name);
        this.buffer.push(XmlToken.equals);
        this.buffer.push(
            this.entityMapping.encodeAttributeValueWithQuotes(
                node.value,
                node.attributeType,
            ),
        );
    }

    visitCDATA(node: XmlCDATA): void {
        this.buffer.push(XmlToken.openCDATA);
        this.buffer.push(node.value);
        this.buffer.push(XmlToken.closeCDATA);
    }

    visitComment(node: XmlComment): void {
        this.buffer.push(XmlToken.openComment);
        this.buffer.push(node.value);
        this.buffer.push(XmlToken.closeComment);
    }

    visitDeclaration(node: XmlDeclaration): void {
        this.buffer.push(XmlToken.openDeclaration);
        this.writeAttributes(node);
        this.buffer.push(XmlToken.closeDeclaration);
    }

    visitDoctype(node: XmlDoctype): void {
        this.buffer.push(XmlToken.openDoctype);
        this.buffer.push(XmlToken.whitespace);
        this.buffer.push(node.name);
        if (node.externalId != null) {
            this.buffer.push(XmlToken.whitespace);
            this.buffer.push(node.externalId);
        }
        if (node.internalSubset != null) {
            this.buffer.push(XmlToken.whitespace);
            this.buffer.push(XmlToken.openDoctypeIntSubset);
            this.buffer.push(node.internalSubset);
            this.buffer.push(XmlToken.closeDoctypeIntSubset);
        }
        this.buffer.push(XmlToken.closeDoctype);
    }

    visitDocument(node: XmlDocument): void {
        this.writeIterable(node.children);
    }

    visitDocumentFragment(node: XmlDocumentFragment): void {
        this.buffer.push('#document-fragment');
    }

    visitElement(node: XmlElement): void {
        this.buffer.push(XmlToken.openElement);
        this.visit(node.name);
        this.writeAttributes(node);
        if (node.children.length === 0 && node.isSelfClosing) {
            this.buffer.push(XmlToken.closeEndElement);
        } else {
            this.buffer.push(XmlToken.closeElement);
            this.writeIterable(node.children);
            this.buffer.push(XmlToken.openEndElement);
            this.visit(node.name);
            this.buffer.push(XmlToken.closeElement);
        }
    }

    visitName(name: XmlName): void {
        this.buffer.push(name.qualified);
    }

    visitProcessing(node: XmlProcessing): void {
        this.buffer.push(XmlToken.openProcessing);
        this.buffer.push(node.target);
        if (node.value && node.value.length > 0) {
            this.buffer.push(XmlToken.whitespace);
            this.buffer.push(node.value);
        }
        this.buffer.push(XmlToken.closeProcessing);
    }

    visitText(node: XmlText): void {
        this.buffer.push(this.entityMapping.encodeText(node.value));
    }

    private writeAttributes(node: XmlHasAttributes): void {
        if (node.attributes.length > 0) {
            this.buffer.push(XmlToken.whitespace);
            this.writeIterable(node.attributes, XmlToken.whitespace);
        }
    }

    private writeIterable(nodes: Iterable<XmlHasVisitor>, separator?: string): void {
        const arr = Array.isArray(nodes) ? nodes : Array.from(nodes);
        if (arr.length === 0) return;
        if (!separator) {
            for (const node of arr) {
                this.visit(node);
            }
        } else {
            this.visit(arr[0]);
            for (let i = 1; i < arr.length; i++) {
                this.buffer.push(separator);
                this.visit(arr[i]);
            }
        }
    }

    visit(node: XmlHasVisitor): void {
        node.accept(this);
    }
}
