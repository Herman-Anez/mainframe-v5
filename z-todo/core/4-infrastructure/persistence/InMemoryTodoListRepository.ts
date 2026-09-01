import { TodoList } from '../../1-domain/entities/TodoList';
import { TodoListId } from '../../1-domain/value-objects/TodoListId';
import { TodoListRepositoryPort } from '../../2-application/ports/out/TodoListRepositoryPort';
import { TodoListRecord } from './TodoListRecord';
import { TodoListMapper } from './TodoListMapper';

/**
 * Guarda `TodoListRecord` (datos planos), NO el agregado vivo. `save` toma una
 * foto con el mapper; `findById`/`findAll` reconstruyen un agregado nuevo. Así
 * el store queda aislado de lo que el resto del código haga con sus objetos,
 * igual que una base de datos real.
 */
export class InMemoryTodoListRepository implements TodoListRepositoryPort {
    private readonly store = new Map<string, TodoListRecord>();

    async save(todoList: TodoList): Promise<void> {
        this.store.set(todoList.id.value, TodoListMapper.toRecord(todoList));
    }

    async findById(id: TodoListId): Promise<TodoList | null> {
        const record = this.store.get(id.value);
        return record ? TodoListMapper.toDomain(record) : null;
    }

    async findAll(): Promise<TodoList[]> {
        return Array.from(this.store.values(), (record) => TodoListMapper.toDomain(record));
    }

    async delete(id: TodoListId): Promise<void> {
        this.store.delete(id.value);
    }
}
