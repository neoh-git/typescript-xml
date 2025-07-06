/**
 * A TypeScript equivalent of Dart's StringBuffer for efficient string concatenation.
 * It builds a string by appending parts to an internal array and then joining them
 * only when toString() is called.
 */
export class StringBuffer {
    private _strings: string[] = [];

    /**
     * Creates an empty StringBuffer.
     * Optionally, an initial string can be provided to start the buffer.
     * @param initialString An optional string to initialize the buffer.
     */
    constructor(initialString: string = '') {
        if (initialString.length > 0) {
            this._strings.push(initialString);
        }
    }

    /**
     * Appends a string or a value that can be converted to a string to the buffer.
     * @param value The value to append. It will be converted to a string.
     */
    write(value: any): void {
        this._strings.push(String(value));
    }

    /**
     * Appends a string or a value that can be converted to a string to the buffer,
     * followed by a newline character (`\n`).
     * @param value The value to append. It will be converted to a string.
     */
    writeln(value: any = ''): void {
        // Appending value and then newline as separate items can sometimes be slightly more efficient
        // than `this._strings.push(String(value) + '\n');` as it avoids an intermediate string concatenation.
        this._strings.push(String(value), '\n');
    }

    /**
     * Clears the buffer, effectively resetting it to an empty state.
     */
    clear(): void {
        this._strings = [];
    }

    /**
     * Returns the current length of the accumulated string.
     */
    get length(): number {
        return this.toString().length;
    }

    /**
     * Checks if the buffer is empty.
     */
    get isEmpty(): boolean {
        return this._strings.length === 0;
    }

    /**
     * Checks if the buffer is not empty.
     */
    get isNotEmpty(): boolean {
        return this._strings.length > 0;
    }

    /**
     * Returns the accumulated string. This operation joins all the parts
     * collected in the buffer.
     */
    toString(): string {
        return this._strings.join('');
    }
}