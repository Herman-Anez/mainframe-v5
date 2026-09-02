import { randomUUID } from 'crypto';
import { ValidationException } from '../exceptions/ValidationException';

export class TodoListId {
    private constructor(readonly value: string) { }

    static create(): TodoListId {
        return new TodoListId(randomUUID());
    }

    static from(value: string): TodoListId {
        if (!value || value.trim().length === 0) {
            throw new ValidationException('TodoListId cannot be empty');
        }
        return new TodoListId(value);
    }

    equals(other: TodoListId): boolean {
        return this.value === other.value;
    }
}