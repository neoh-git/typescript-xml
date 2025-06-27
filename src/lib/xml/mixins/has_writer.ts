export interface IHasWriter {
    writeTo(buffer: string[], options: unknown): void;
    writeToAsync(buffer: string[], options: unknown): Promise<void>;
}
