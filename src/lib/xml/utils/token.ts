// Shared tokens for XML reading and writing.
export class XmlToken {
    static readonly doubleQuote = '"';
    static readonly singleQuote = "'";
    static readonly equals = '=';
    static readonly namespace = ':';
    static readonly whitespace = ' ';
    static readonly openComment = '<!--';
    static readonly closeComment = '-->';
    static readonly openCDATA = '<![CDATA[';
    static readonly closeCDATA = ']]>';
    static readonly openElement = '<';
    static readonly closeElement = '>';
    static readonly openEndElement = '</';
    static readonly closeEndElement = '/>';
    static readonly openDeclaration = '<?xml';
    static readonly closeDeclaration = '?>';
    static readonly openDoctype = '<!DOCTYPE';
    static readonly closeDoctype = '>';
    static readonly openDoctypeIntSubset = '[';
    static readonly closeDoctypeIntSubset = ']';
    static readonly doctypeSystemId = 'SYSTEM';
    static readonly doctypePublicId = 'PUBLIC';
    static readonly doctypeElementDecl = '<!ELEMENT';
    static readonly doctypeAttlistDecl = '<!ATTLIST';
    static readonly doctypeEntityDecl = '<!ENTITY';
    static readonly doctypeNotationDecl = '<!NOTATION';
    static readonly doctypeDeclEnd = '>';
    static readonly doctypeReferenceStart = '%';
    static readonly doctypeReferenceEnd = ';';
    static readonly openProcessing = '<?';
    static readonly closeProcessing = '?>';
    static readonly entityStart = '&';
    static readonly entityEnd = ';';

    // https://en.wikipedia.org/wiki/QName
    static readonly nameStartChars =
        ':A-Z_a-z' +
        '\u00c0-\u00d6' +
        '\u00d8-\u00f6' +
        '\u00f8-\u02ff' +
        '\u0370-\u037d' +
        '\u037f-\u1fff' +
        '\u200c-\u200d' +
        '\u2070-\u218f' +
        '\u2c00-\u2fef' +
        '\u3001-\ud7ff' +
        '\uf900-\ufdcf' +
        '\ufdf0-\ufffd' +
        '\u{10000}-\u{effff}';
    static readonly nameChars =
        XmlToken.nameStartChars +
        '-.0-9' +
        '\u00b7' +
        '\u0300-\u036f' +
        '\u203f-\u2040';
}