
// Predicate function of type [T].
export type Predicate<T> = (value: T) => boolean;

export function toPredicate<T>(
    predicate?: Predicate<T>,
    all?: boolean,
    otherwise: boolean = false
): Predicate<T> {
    if (predicate != undefined && all != undefined) {
        throw new Error('Only specify the predicate or a boolean value, not both');
    }
    if (predicate != undefined) return predicate;
    if (all != undefined) return (_node: T) => all;
    return (_node: T) => otherwise;
}
