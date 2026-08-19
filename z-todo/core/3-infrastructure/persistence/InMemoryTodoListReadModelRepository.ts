import { TodoListReadModelPort } from '../../2-application/ports/out/TodoListReadModelPort';
import { TodoListReadModel } from '../../2-application/read-model/TodoListReadModel';

export class InMemoryTodoListReadModelRepository implements TodoListReadModelPort {
    private readonly store = new Map<string, TodoListReadModel>();

    async findById(id: string): Promise<TodoListReadModel | null> {
        return this.store.get(id) ?? null;
    }

    async findAll(): Promise<TodoListReadModel[]> {
        return Array.from(this.store.values());
    }

    async upsert(list: TodoListReadModel): Promise<void> {
        this.store.set(list.id, list);
    }

    async remove(id: string): Promise<void> {
        this.store.delete(id);
    }
}
