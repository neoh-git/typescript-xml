import { XmlAttribute } from '../nodes/attribute.js';
import { XmlNode } from '../nodes/node.js';

// XML namespace declarations.
export const xml = 'xml';
export const xmlUri = 'http://www.w3.org/XML/1998/namespace';
export const xmlns = 'xmlns';

/**
 * Lookup XmlAttribute with the given `prefix` and `local` name by walking up
 * the XML DOM from the provided `start`. Return `null` if the attribute
 * cannot be found.
 */
export function lookupAttribute(
    local: string,
    start?: XmlNode,
    prefix?: string,
): XmlAttribute | null {
    for (let node = start; node != null; node = node.parent) {
        for (const attribute of node.attributes) {
            const name = attribute.name;
            if (name.prefix === prefix && name.local === local) {
                return attribute;
            }
        }
    }
    return null;
}

/**
 * Lookup the namespace prefix (possibly an empty string), for the given
 * namespace `uri` by walking up the XML DOM from the provided `start`.
 * Return `null` if the prefix cannot be found.
 */
export function lookupNamespacePrefix(
    uri: string,
    start?: XmlNode,
): string | undefined {
    for (let node = start; node != undefined; node = node.parent) {
        for (const attribute of node.attributes) {
            if (attribute.value === uri) {
                const name = attribute.name;
                if (name.prefix === xmlns) {
                    return name.local;
                } else if (!name.prefix && name.local === xmlns) {
                    return '';
                }
            }
        }
    }
    return undefined;
}