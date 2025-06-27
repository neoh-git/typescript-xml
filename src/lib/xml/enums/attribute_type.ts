export enum XmlAttributeType {
    SINGLE_QUOTE = "'",
    DOUBLE_QUOTE = '"',
}

export namespace XmlAttributeType {
    export function token(type: XmlAttributeType): string {
        switch (type) {
            case XmlAttributeType.SINGLE_QUOTE:
                return "'";
            case XmlAttributeType.DOUBLE_QUOTE:
                return '"';
        }
    }
}
