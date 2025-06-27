export interface IHasVisitor {
    accept(visitor: unknown): void;
}
