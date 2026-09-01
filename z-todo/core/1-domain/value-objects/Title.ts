import { ValidationException } from '../exceptions/ValidationException';

export class Title {
    static readonly MIN_LENGTH = 3;
    static readonly MAX_LENGTH = 100;

    private constructor(readonly value: string) { }

    static create(value: string): Title {
        const trimmed = value?.trim();
        if (!trimmed || trimmed.length < Title.MIN_LENGTH) {
            throw new ValidationException('Title must have at least 3 characters');
        }
        if (trimmed.length > Title.MAX_LENGTH) {
            throw new ValidationException('Title cannot exceed 100 characters');
        }
        return new Title(trimmed);
    }
}
