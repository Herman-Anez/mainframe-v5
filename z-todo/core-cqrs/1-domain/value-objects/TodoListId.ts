import { randomUUID } from 'crypto';

export class TodoListId {
    private constructor(readonly value: string) { }

    static create(): TodoListId {
        return new TodoListId(randomUUID());
    }

    static from(value: string): TodoListId {
        if (!value || value.trim().length === 0) {
            throw new Error('TodoListId cannot be empty');
        }
        return new TodoListId(value);
    }

    equals(other: TodoListId): boolean {
        return this.value === other.value;
    }
}