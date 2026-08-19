import { randomUUID } from 'crypto';

export class TodoItemId {
    private constructor(readonly value: string) { }

    static create(): TodoItemId {
        return new TodoItemId(randomUUID());
    }

    static from(value: string): TodoItemId {
        if (!value || value.trim().length === 0) {
            throw new Error('TodoItemId cannot be empty');
        }
        return new TodoItemId(value);
    }

    equals(other: TodoItemId): boolean {
        return this.value === other.value;
    }
}