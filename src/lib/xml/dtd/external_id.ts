import { XmlAttributeType } from '../enums/attribute_type.js';
import { XmlToken } from '../utils/token.js';

/**
 * Immutable external ID.
 */
export class DtdExternalId {
    /**
     * The public identifier for the external subset of the document type
     * definition. This is a string, or `null`.
     */
    public readonly publicId: string | null;

    public readonly publicIdType: XmlAttributeType | null;

    /**
     * The system identifier for the external subset of the document type
     * definition. This is a URI as a string, or `null`.
     */
    public readonly systemId: string;

    public readonly systemIdType: XmlAttributeType;

    private constructor(
        publicId: string | null,
        publicIdType: XmlAttributeType | null,
        systemId: string,
        systemIdType: XmlAttributeType,
    ) {
        this.publicId = publicId;
        this.publicIdType = publicIdType;
        this.systemId = systemId;
        this.systemIdType = systemIdType;
    }

    public static createPublic(
        publicId: string,
        publicIdType: XmlAttributeType,
        systemId: string,
        systemIdType: XmlAttributeType,
    ): DtdExternalId {
        return new DtdExternalId(
            publicId,
            publicIdType,
            systemId,
            systemIdType,
        );
    }

    public static createSystem(
        systemId: string,
        systemIdType: XmlAttributeType,
    ): DtdExternalId {
        return new DtdExternalId(null, null, systemId, systemIdType);
    }

    public toString(): string {
        let buffer = '';
        if (this.publicId !== null) {
            buffer += XmlToken.doctypePublicId;
            buffer += XmlToken.whitespace;
            buffer += this.publicIdType!;
            buffer += this.publicId;
            buffer += this.publicIdType!;
        } else {
            buffer += XmlToken.doctypeSystemId;
        }
        buffer += XmlToken.whitespace;
        buffer += this.systemIdType;
        buffer += this.systemId;
        buffer += this.systemIdType;
        return buffer;
    }

    public equals(other: any): boolean {
        if (this === other) {
            return true;
        }
        if (!(other instanceof DtdExternalId)) {
            return false;
        }
        return (
            this.publicId === other.publicId && this.systemId === other.systemId
        );
    }
}
