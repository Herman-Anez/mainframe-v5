import { TodoList } from '../../1-domain/entities/TodoList';
import { TodoItem } from '../../1-domain/entities/TodoItem';
import { TodoListRecord } from './TodoListRecord';

/**
 * Traductor entre el agregado de dominio y su forma plana de persistencia.
 *
 *   toRecord: TodoList  → TodoListRecord   (dominio → datos, para guardar)
 *   toDomain: TodoListRecord → TodoList    (datos → dominio, al leer)
 *
 * `toRecord` produce un objeto nuevo (una foto); `toDomain` produce un
 * agregado nuevo cada vez. Ninguna referencia se comparte con lo guardado.
 */
export const TodoListMapper = {
  toRecord(list: TodoList): TodoListRecord {
    return {
      id: list.id.value,
      name: list.name,
      items: list.items.map((item) => ({
        id: item.id.value,
        title: item.title,
        description: item.description,
        status: item.status,
        priority: item.priority,
      })),
    };
  },

  toDomain(record: TodoListRecord): TodoList {
    const items = record.items.map((r) =>
      TodoItem.restore({
        id: r.id,
        title: r.title,
        description: r.description,
        status: r.status,
        priority: r.priority,
      }),
    );
    return TodoList.restore({ id: record.id, name: record.name, items });
  },
};
