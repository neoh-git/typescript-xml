// First, define a helper type for the mixin pattern
type Constructor<T = {}> = new (...args: any[]) => T;

// Define an interface for the properties expected from Dart's FormatException
// In TypeScript, Error already has 'message', but Dart's FormatException adds 'source' and 'offset'.
interface IFormatExceptionContract extends Error {
    source?: string;
    offset?: number;
}

// You might need to import Token from a package like @petitparser/core
// import { Token } from '@petitparser/core';

// If @petitparser/core is not available in TypeScript, you'd need to
// implement Token.lineAndColumnOf yourself or provide a mock:
const Token = {
    /**
     * Calculates the line and column number of an offset in a string buffer.
     * This is a simplified reimplementation for demonstration if petitparser is not available.
     * In a real project, you'd import this from the petitparser library if it exists.
     */
    lineAndColumnOf: (buffer?: string, position?: number): [number, number] => {
        let line = 1;
        let column = 1;
        for (let i = 0; i < (position || 0); i++) {
            if (buffer && buffer[i] === '\n') {
                line++;
                column = 1;
            } else {
                column++;
            }
        }
        return [line, column];
    },
};

/**
 * Mixin for exceptions that follow the [FormatException] of Dart.
 * This function mixin adds parsing-related error details to any class
 * that implements the required abstract properties (`buffer`, `position`).
 */
export function XmlFormatExceptionMixin<TBase extends Constructor<IFormatExceptionContract>>(Base: TBase) {
    // The returned class extends the Base class and adds the mixin's functionality.
    return class extends Base {
        /**
         * The input buffer which caused the error, or `null` if not available.
         * This must be implemented by the class that applies this mixin.
         */
        buffer?: string;

        /**
         * The offset in [buffer] where the error was detected, or `null` if no
         * location information is available.
         * This must be implemented by the class that applies this mixin.
         */
        position?: number;

        /**
         * Internal cache of line and column of the error.
         * `null` initially to represent the 'late' aspect.
         */
        _cachedLineAndColumn: [number, number] | null = null;

        /**
         * Internal getter that computes and caches the line and column.
         * Simulates Dart's `late final`.
         */
        get _lineAndColumn(): [number, number] {
            if (this._cachedLineAndColumn === null) {
                if (this.buffer !== null && this.position !== null) {
                    this._cachedLineAndColumn = Token.lineAndColumnOf(this.buffer, this.position);
                } else {
                    this._cachedLineAndColumn = [0, 0];
                }
            }
            return this._cachedLineAndColumn;
        }

        /**
         * The line number where the parser error was detected, or `0` if no
         * location information is available.
         * @readonly
         */
        get line(): number {
            return this._lineAndColumn[0];
        }

        /**
         * The column number where the parser error was detected, or `0` if no
         * location information is available.
         * @readonly
         */
        get column(): number {
            return this._lineAndColumn[1];
        }

        /**
         * @internal
         * A string representation of the error location (e.g., " at 1:10").
         */
        get locationString(): string {
            return this.buffer === null || this.position === null ? '' : ` at ${this.line}:${this.column}`;
        }

        /**
         * @override
         * Implements [FormatException.source]. Returns the input buffer.
         */
        override get source(): string | undefined {
            return this.buffer;
        }

        /**
         * @override
         * Implements [FormatException.offset]. Returns the error position.
         */
        override get offset(): number | undefined {
            return this.position;
        }
    };
}