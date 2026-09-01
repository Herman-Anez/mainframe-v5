import { ValidationException } from '../exceptions/ValidationException';

export class Description {
    static readonly MAX_LENGTH = 500;

    private constructor(readonly value: string) { }

    static create(value: string = ''): Description {
        const trimmed = value?.trim() ?? '';
        if (trimmed.length > Description.MAX_LENGTH) {
            throw new ValidationException('Description cannot exceed 500 characters');
        }
        return new Description(trimmed);
    }
}
