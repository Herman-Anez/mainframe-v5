import { TodoList } from '../../1-domain/entities/TodoList';
import { TodoListId } from '../../1-domain/value-objects/TodoListId';
import { TodoListRepositoryPort } from '../../2-application/ports/out/TodoListRepositoryPort';


export class InMemoryTodoListRepository implements TodoListRepositoryPort {
    private readonly store = new Map<string, TodoList>();

    async save(todoList: TodoList): Promise<void> {
        this.store.set(todoList.id.value, todoList);
    }

    async findById(id: TodoListId): Promise<TodoList | null> {
        return this.store.get(id.value) ?? null;
    }

    async findAll(): Promise<TodoList[]> {
        return Array.from(this.store.values());
    }

    async delete(id: TodoListId): Promise<void> {
        this.store.delete(id.value);
    }
}