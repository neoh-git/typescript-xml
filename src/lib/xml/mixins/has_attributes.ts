import { XmlAttribute } from '../nodes/attribute';

export interface IHasAttributes {
    attributes: XmlAttribute[];
    getAttribute(name: string): string | undefined;
    getAttributeNode(name: string): XmlAttribute | undefined;
    setAttribute(name: string, value: string): void;
}
