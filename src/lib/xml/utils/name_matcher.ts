import { XmlHasName } from '../mixins/has_name.js';
import type { Predicate } from './predicate.js';

/**
 * Internal factory to create element lookups.
 *
 * The `name` is considered to be a local name if a `namespaceUri` is provided,
 * otherwise `name` is considered to be fully qualified.
 */
export function createNameLookup(name: string, namespace?: string): Predicate<XmlHasName> {
    if (namespace == null) {
        return (named) => named.xmlName.qualified == name;
    } else {
        return (named) =>
            named.xmlName.local == name && named.xmlName.namespaceUri == namespace;
    }
}

// Internal factory to create element matchers with wildcards.
export function createNameMatcher(name: string, namespace?: string): Predicate<XmlHasName> {
    if (name == '*') {
        if (namespace == null || namespace == '*') {
            return (named) => true;
        } else {
            return (named) => named.xmlName.namespaceUri == namespace;
        }
    } else {
        if (namespace == null) {
            return (named) => named.xmlName.qualified == name;
        } else if (namespace == '*') {
            return (named) => named.xmlName.local == name;
        } else {
            return (named) =>
                named.xmlName.local == name && named.xmlName.namespaceUri == namespace;
        }
    }
}