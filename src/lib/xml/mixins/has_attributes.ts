import { XmlNodeType } from '../enums/node_type.js';
import { XmlAttribute } from '../nodes/attribute.js';
import { XmlNode } from '../nodes/node.js';
import { applyMixins, EmtpyClass, type Constructor } from '../utils/apply_mixins.js';
import { XmlName } from '../utils/name.js';
import { createNameMatcher, createNameLookup } from '../utils/name_matche.js';
import { lookupNamespacePrefix } from '../utils/namespace.js';
import { XmlNodeList } from '../utils/node_list.js';

export function WithXmlAttributesBase<TBase extends Constructor>(Base?: TBase) {
    if (Base === undefined) {
        Base = EmtpyClass as TBase;
    }
    return class extends Base {
        /**
         * Return the attribute nodes of this node in document order.
         */
        readonly attributes: Array<XmlAttribute> = [];

        /** 
         * Return the attribute value with the given `name`, or `null`.
         * Both `name` and `namespace` can be a specific [String]; or `'*'` to match
         * anything. If no `namespace` is provided, the _fully qualified_ name is
         * compared; otherwise only the _local name_ is considered.
         *
         * For example:
         * - `element.getAttribute('xsd:name')` returns the first attribute value
         *   with the fully qualified attribute name `xsd:name`.
         * - `element.getAttribute('name', namespace: '*')` returns the first
         *   attribute value with the local attribute name `name` no matter the
         *   namespace.
         * - `element.getAttribute('*', namespace: 'http://www.w3.org/2001/XMLSchema')`
         *  returns the first attribute value within the provided namespace URI.
         */
        getAttribute(name: string, namespace?: string): string | undefined {
            return undefined;
        }

        /** 
         * Return the attribute node with the given `name`, or `null`.
         *
         * Both `name` and `namespace` can be a specific [String]; or `'*'` to match
         * anything. If no `namespace` is provided, the _fully qualified_ name is
         * compared; otherwise only the _local name_ is considered.
         *
         * For example:
         * - `element.getAttributeNode('xsd:name')` returns the first attribute node
         *   with the fully qualified attribute name `xsd:name`.
         * - `element.getAttributeNode('name', namespace: '*')` returns the first
         *   attribute node with the local attribute name `name` no matter the
         *   namespace.
         * - `element.getAttributeNode('*', namespace: 'http://www.w3.org/2001/XMLSchema')`
         *  returns the first attribute node within the provided namespace URI.
         */
        getAttributeNode(name: string, namespace?: string): XmlAttribute | undefined {
            return undefined;
        }

        /**
        * Set the attribute value with the given fully qualified `name` to `value`.
        * If an attribute with the name already exist, its value is updated.
        * If the value is `null`, the attribute is removed.
        *
        * Both `name` and `namespace` can be a specific [String]; or `'*'` to match
        * anything. If no `namespace` is provided, the _fully qualified_ name is
        * compared; otherwise only the _local name_ is considered.
        *
        * For example:
        * - `element.setAttribute('xsd:name', 'value')` updates the attribute with
        *   the fully qualified attribute name `xsd:name`.
        * - `element.setAttribute('name', 'value', namespace: '*')` updates the
        *   attribute with the local attribute name `name` no matter the
        *   namespace.
        * - `element.setAttribute('*', 'value', namespace: 'http://www.w3.org/2001/XMLSchema')`
        *   updates the attribute within the provided namespace URI.
        */
        setAttribute(name: string, value?: string, namespace?: string): void {
            throw new Error('$this has no attributes');
        }

        /**
         *  Removes the attribute value with the given fully qualified `name`.
         *
         * Both `name` and `namespace` can be a specific [String]; or `'*'` to match
         * anything. If no `namespace` is provided, the _fully qualified_ name is
         * compared; otherwise only the _local name_ is considered.
         *
         * For example:
         * - `element.removeAttribute('xsd:name')` removes the attribute with the
         *   fully qualified attribute name `xsd:name`.
         * - `element.removeAttribute('name', namespace: '*')` removes the attribute
         *   with the local attribute name `name` no matter the namespace.
         * - `element.removeAttribute('*', namespace: 'http://www.w3.org/2001/XMLSchema')`
         *   removes the attribute within the provided namespace URI.
         */
        removeAttribute(name: string, namespace?: string): void {
            this.setAttribute(name, undefined, namespace);
        }
    };
}

const XmlAttributesBase = WithXmlAttributesBase();
type XmlAttributesBase = InstanceType<typeof XmlAttributesBase>;

function WithXmlHasAttributes<TBase extends Constructor<XmlNode & XmlAttributesBase>>(Base: TBase) {
    return class extends Base {
        constructor() {
            super();
        }

        readonly nodeType: XmlNodeType = XmlNodeType.ATTRIBUTE;

        copy(): XmlNode {
            return this;
        }

        readonly attributes: XmlNodeList<XmlAttribute> = new XmlNodeList<XmlAttribute>();

        getAttribute(name: string, namespace?: string): string | undefined {
            return this.getAttributeNode(name, namespace)?.value;
        }

        getAttributeNode(name: string, namespace?: string): XmlAttribute | undefined {
            const tester = createNameMatcher(name, namespace);
            for (const attribute of this.attributes) {
                if (tester(attribute)) {
                    return attribute;
                }
            }
            return undefined;
        }

        setAttribute(name: string, value?: string, namespace?: string): void {
            const index = this.attributes.findIndex(createNameLookup(name, namespace));
            if (index < 0) {
                if (value != undefined) {
                    const prefix = namespace === undefined ? undefined : lookupNamespacePrefix(namespace, this);
                    this.attributes.push(new XmlAttribute(XmlName.create(name, prefix), value));
                }
            } else {
                if (value != undefined) {
                    this.attributes[index]!.value = value;
                } else {
                    this.attributes.splice(index, 1);
                }
            }
        }
    }
}

export abstract class XmlHasAttributes {



}
export interface XmlHasAttributes extends XmlAttributesBase, XmlNode { }
applyMixins(XmlHasAttributes, [XmlAttributesBase, XmlNode]);

