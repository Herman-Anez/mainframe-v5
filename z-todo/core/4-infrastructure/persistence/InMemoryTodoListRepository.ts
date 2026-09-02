import { TodoListRepositoryPort } from '../../2-application/ports/out/TodoListRepositoryPort';
import { TodoListRecord } from '../../2-application/shared/TodoListRecord';

/**
 * Almacén en memoria de `TodoListRecord` (datos planos). No importa nada de
 * `1-domain`: no sabe qué es un agregado, solo guarda y devuelve records.
 * `structuredClone` en save/read aísla el store de cualquier referencia que
 * tenga quien lo usa — igual que una base de datos real.
 */
export class InMemoryTodoListRepository implements TodoListRepositoryPort {
    private readonly store = new Map<string, TodoListRecord>();

    async save(record: TodoListRecord): Promise<void> {
        this.store.set(record.id, structuredClone(record));
    }

    async findById(id: string): Promise<TodoListRecord | null> {
        const record = this.store.get(id);
        return record ? structuredClone(record) : null;
    }

    async findAll(): Promise<TodoListRecord[]> {
        return Array.from(this.store.values(), (record) => structuredClone(record));
    }

    async delete(id: string): Promise<void> {
        this.store.delete(id);
    }
}
