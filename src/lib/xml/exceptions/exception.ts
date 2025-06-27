/**
 * Abstract exception class.
 */
export abstract class XmlException extends Error {
    /**
     * A message describing the XML error.
     * @readonly
     */
    override readonly message: string;

    /**
     * Creates a new XmlException with an error [message].
     * @param message A message describing the XML error.
     */
    constructor(message: string) {
        // Call the base Error constructor with the message
        super(message);

        // Set the prototype explicitly. This is important for custom errors
        // to ensure 'instanceof' works correctly when transpiled to ES5/ES6.
        // (new.target is for ES6+; Object.setPrototypeOf for older environments if needed)
        Object.setPrototypeOf(this, new.target.prototype);

        // Assign the message to our readonly property
        this.message = message;

        // Set the name of the error, useful for debugging
        this.name = 'XmlException';
    }
}