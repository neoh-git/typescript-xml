export interface XmlValueBase {
    /** 
     * Returns the value of the node, or `null`.
     *
     * The returned value depends on the type of the node:
     * - attributes return their attribute value;
     * - text, CDATA, and comment nodes return their textual content; and
     * - processing and declaration nodes return their contents.
     * All other nodes return `undefined`.
     */
    value?: string;
}
