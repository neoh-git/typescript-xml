import { XmlAttributeType } from '../enums/attribute_type.js';
import { XmlEntityMapping } from './entity_mapping.js';
import { html5Entities, htmlEntities, xmlEntities } from './named_entities.js';

/**
 * Default entity mapping for XML, HTML, and HTML5 entities.
 */
export class XmlDefaultEntityMapping extends XmlEntityMapping {
    /**
     * Minimal entity mapping of XML character references.
     */
    static xml(): XmlDefaultEntityMapping {
        return new XmlDefaultEntityMapping(xmlEntities);
    }

    /**
     * Minimal entity mapping of HTML character references.
     */
    static html(): XmlDefaultEntityMapping {
        return new XmlDefaultEntityMapping(htmlEntities);
    }

    /**
     * Extensive entity mapping of HTML5 character references.
     */
    static html5(): XmlDefaultEntityMapping {
        return new XmlDefaultEntityMapping(html5Entities);
    }

    /**
     * Custom entity mapping.
     */
    private constructor(public readonly entities: Record<string, string>) {
        super();
    }

    public decodeEntity(input: string): string | undefined {
        if (input.length > 1 && input[0] === '#') {
            if (input.length > 2 && (input[1] === 'x' || input[1] === 'X')) {
                // Hexadecimal character reference.
                return this._decodeNumericEntity(input.substring(2), 16);
            } else {
                // Decimal character reference.
                return this._decodeNumericEntity(input.substring(1), 10);
            }
        } else {
            // Named character reference.
            return this.entities[input];
        }
    }

    private _decodeNumericEntity(
        input: string,
        radix: number,
    ): string | undefined {
        const value = parseInt(input, radix);
        if (isNaN(value) || value < 0 || 0x10ffff < value) return undefined;
        return String.fromCharCode(value);
    }

    public encodeText(input: string): string {
        return input.replace(_textPattern, _textReplace);
    }

    public encodeAttributeValue(input: string, type: XmlAttributeType): string {
        switch (type) {
            case XmlAttributeType.SINGLE_QUOTE:
                return input.replace(
                    _singeQuoteAttributePattern,
                    _singeQuoteAttributeReplace,
                );
            case XmlAttributeType.DOUBLE_QUOTE:
                return input.replace(
                    _doubleQuoteAttributePattern,
                    _doubleQuoteAttributeReplace,
                );
        }
    }
}

// Encode XML text.

const _textPattern =
    /[&<\u0001-\u0008\u000b\u000c\u000e-\u001f\u007f-\u0084\u0086-\u009f]|]]>/g;

function _textReplace(match: string): string {
    switch (match) {
        case '<':
            return '&lt;';
        case '&':
            return '&amp;';
        case ']]>':
            return ']]&gt;';
        default:
            return _asNumericCharacterReferences(match);
    }
}

// Encode XML attribute values (single quotes).

const _singeQuoteAttributePattern =
    /['&<\n\r\t\u0001-\u0008\u000b\u000c\u000e-\u001f\u007f-\u0084\u0086-\u009f]/g;

function _singeQuoteAttributeReplace(match: string): string {
    switch (match) {
        case "'":
            return '&apos;';
        case '&':
            return '&amp;';
        case '<':
            return '&lt;';
        default:
            return _asNumericCharacterReferences(match);
    }
}

// Encode XML attribute values (double quotes).

const _doubleQuoteAttributePattern =
    /["&<\n\r\t\u0001-\u0008\u000b\u000c\u000e-\u001f\u007f-\u0084\u0086-\u009f]/g;

function _doubleQuoteAttributeReplace(match: string): string {
    switch (match) {
        case '"':
            return '&quot;';
        case '&':
            return '&amp;';
        case '<':
            return '&lt;';
        default:
            return _asNumericCharacterReferences(match);
    }
}

// Lists all C0 and C1 control codes except NUL, HT, LF, CR and NEL.
//
// Sources:
// - https://www.w3.org/TR/xml/#charsets
// - https://en.wikipedia.org/wiki/XML#Valid_Unicode_characters_in_XML_1.0_and_XML_1.1
const _highlyDiscouragedCharClass =
    '\\u0001-\\u0008\\u000b\\u000c\\u000e-\\u001f\\u007f-\\u0084\\u0086-\\u009f';

function _asNumericCharacterReferences(toEscape: string): string {
    return Array.from(toEscape)
        .map((char) => {
            const rune = char.codePointAt(0);
            if (rune === undefined) {
                return '';
            }
            return `&#x${rune.toString(16).toUpperCase()};`;
        })
        .join('');
}

/**
 * The entity mapping used when nothing else is specified.
 */
export const defaultEntityMapping: XmlEntityMapping =
    XmlDefaultEntityMapping.xml();
