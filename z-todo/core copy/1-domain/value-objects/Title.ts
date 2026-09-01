export class Title {
    private constructor(readonly value: string) { }

    static create(value: string): Title {
        const trimmed = value?.trim();
        if (!trimmed || trimmed.length < 3) {
            throw new Error('Title must have at least 3 characters');
        }
        if (trimmed.length > 100) {
            throw new Error('Title cannot exceed 100 characters');
        }
        return new Title(trimmed);
    }
}