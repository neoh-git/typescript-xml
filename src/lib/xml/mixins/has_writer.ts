import { XmlEntityMapping } from '../entities/entity_mapping.js';
import { XmlAttribute } from '../nodes/attribute.js';
import type { XmlNode } from '../nodes/node.js';
import type { Predicate } from '../utils/predicate.js';
import { XmlPrettyWriter } from '../visitors/pretty_writer.js';
import type { XmlVisitor } from '../visitors/visitor.js';
import { XmlWriter } from '../visitors/writer.js';
import type { XmlHasVisitor } from './has_visitor.js';

// export function defaultToXmlString(options: {
//     pretty?: boolean;
//     entityMapping?: XmlEntityMapping;
//     level?: number;
//     indent?: string;
//     newLine?: string;
//     preserveWhitespace?: Predicate<XmlNode>;
//     indentAttribute?: Predicate<XmlAttribute>;
//     sortAttributes?: (a: XmlAttribute, b: XmlAttribute) => number;
//     spaceBeforeSelfClose?: Predicate<XmlNode>;
// } = {}): string {
//     const {
//         pretty = false,
//         entityMapping,
//         level,
//         indent,
//         newLine,
//         preserveWhitespace,
//         indentAttribute,
//         sortAttributes,
//         spaceBeforeSelfClose,
//     } = options;

//     const buffer: string[] = [];
//     const writer = pretty
//         ? new XmlPrettyWriter(buffer, {
//             entityMapping,
//             level,
//             indent,
//             newLine,
//             preserveWhitespace,
//             indentAttribute,
//             sortAttributes,
//             spaceBeforeSelfClose,
//         })
//         : new XmlWriter(buffer, { entityMapping });

//     writer.visit(this);
//     return buffer.join('');
// }

// Serialize XML to a [StringBuffer].
export interface XmlHasWriter {
    toXmlString(options: {
        pretty?: boolean;
        entityMapping?: XmlEntityMapping;
        level?: number;
        indent?: string;
        newLine?: string;
        preserveWhitespace?: Predicate<XmlNode>;
        indentAttribute?: Predicate<XmlAttribute>;
        sortAttributes?: (a: XmlAttribute, b: XmlAttribute) => number;
        spaceBeforeSelfClose?: Predicate<XmlNode>;
    }): string;

    toString(): string;
}