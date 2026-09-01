import { TodoItem } from '../../1-domain/entities/TodoItem';

/**
 * Proyección plana de un `TodoItem` para cruzar el borde de la aplicación
 * (respuestas de queries y de comandos que devuelven el item mutado).
 * Antes esto vivía como `TodoItemOutput` dentro de `get-todo-list/`, y el
 * `.map(...)` que lo arma estaba duplicado en `GetTodoList` y `ListTodoLists`.
 */
export interface TodoItemView {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
}

export function toTodoItemView(item: TodoItem): TodoItemView {
  return {
    id: item.id.value,
    title: item.title,
    description: item.description,
    status: item.status,
    priority: item.priority,
  };
}
