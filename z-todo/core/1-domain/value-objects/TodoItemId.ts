import { randomUUID } from 'crypto';
import { ValidationException } from '../exceptions/ValidationException';

export class TodoItemId {
    private constructor(readonly value: string) { }

    static create(): TodoItemId {
        return new TodoItemId(randomUUID());
    }

    static from(value: string): TodoItemId {
        if (!value || value.trim().length === 0) {
            throw new ValidationException('TodoItemId cannot be empty');
        }
        return new TodoItemId(value);
    }

    equals(other: TodoItemId): boolean {
        return this.value === other.value;
    }
}