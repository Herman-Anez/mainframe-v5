import { TodoListRecord } from '../../shared/TodoListRecord';

/**
 * El repositorio es un almacén de `TodoListRecord` (datos planos), no una
 * colección de agregados. La conversión record↔dominio la hace la capa de
 * aplicación (`TodoListMapper`), no la implementación de persistencia — así
 * `4-infrastructure/persistence/` no importa `1-domain` en absoluto.
 */
export interface TodoListRepositoryPort {
  save(record: TodoListRecord): Promise<void>;
  findById(id: string): Promise<TodoListRecord | null>;
  findAll(): Promise<TodoListRecord[]>;
  delete(id: string): Promise<void>;
}
