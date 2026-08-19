export class Description {
    private constructor(readonly value: string) { }

    static create(value: string = ''): Description {
        const trimmed = value?.trim() ?? '';
        if (trimmed.length > 500) {
            throw new Error('Description cannot exceed 500 characters');
        }
        return new Description(trimmed);
    }
}