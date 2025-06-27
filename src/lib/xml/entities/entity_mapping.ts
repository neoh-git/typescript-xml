import { XmlAttributeType } from '../enums/attribute_type.js';
import { XmlToken } from '../utils/token.js';

/**
 * Describes the decoding and encoding of character entities.
 */
export abstract class XmlEntityMapping {
    /**
     * Decodes a string, resolving all possible entities.
     *
     * @param input The string to decode.
     * @returns The decoded string.
     */
    public decode(input: string): string {
        // If we obviously have no entities, return the input string.
        let start = input.indexOf(XmlToken.entityStart, 0);
        if (start < 0) {
            return input;
        }
        // Otherwise traverse the input and decode all entities.
        let buffer = '';
        buffer += input.substring(0, start);
        while (true) {
            const index = input.indexOf(XmlToken.entityEnd, start + 1);
            if (start + 1 < index) {
                const entity = input.substring(start + 1, index);
                const value = this.decodeEntity(entity);
                if (value !== undefined) {
                    // Valid entity found, write the transformed value.
                    buffer += value;
                    start = index + 1;
                } else {
                    buffer += XmlToken.entityStart;
                    start++;
                }
            } else {
                buffer += XmlToken.entityStart;
                start++;
            }
            // Find the next possible start position of an entity.
            const next = input.indexOf(XmlToken.entityStart, start);
            if (next === -1) {
                // Reached the end of the input.
                buffer += input.substring(start);
                break;
            }
            buffer += input.substring(start, next);
            start = next;
        }
        return buffer.toString();
    }

    /**
     * Decodes a single character entity, returns the decoded entity or
     * `undefined` if the input is invalid.
     *
     * @param input The entity to decode.
     * @returns The decoded entity, or `undefined` if the entity is not
     *          recognized.
     */
    abstract decodeEntity(input: string): string | undefined;

    /**
     * Encodes a string to be serialized as XML text.
     *
     * @param input The text to encode.
     * @returns The encoded text.
     */
    abstract encodeText(input: string): string;

    /**
     * Encodes a string to be serialized as XML attribute value.
     *
     * @param input The attribute value to encode.
     * @param type The type of attribute quote.
     * @returns The encoded attribute value.
     */
    abstract encodeAttributeValue(
        input: string,
        type: XmlAttributeType,
    ): string;

    /**
     * Encodes a string to be serialized as XML attribute value together with
     * its corresponding quotes.
     *
     * @param input The attribute value to encode.
     * @param type The type of attribute quote.
     * @returns The encoded attribute value with quotes.
     */
    public encodeAttributeValueWithQuotes(
        input: string,
        type: XmlAttributeType,
    ): string {
        const quote = XmlAttributeType.token(type);
        return `${quote}${this.encodeAttributeValue(input, type)}${quote}`;
    }
}
