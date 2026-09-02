import { RouteDescriptor } from './RouteDescriptor';
import { TodoUseCases } from '../../use-cases/TodoUseCases';
import { createCreateTodoListRoute } from './create-todo-list/CreateTodoListRoute';
import { createListTodoListsRoute } from './list-todo-lists/ListTodoListsRoute';
import { createGetTodoListRoute } from './get-todo-list/GetTodoListRoute';
import { createDeleteTodoListRoute } from './delete-todo-list/DeleteTodoListRoute';
import { createAddTodoItemRoute } from './add-todo-item/AddTodoItemRoute';
import { createCompleteTodoItemRoute } from './complete-todo-item/CompleteTodoItemRoute';
import { createRenameTodoItemRoute } from './rename-todo-item/RenameTodoItemRoute';
import { createChangeTodoItemDescriptionRoute } from './change-todo-item-description/ChangeTodoItemDescriptionRoute';
import { createChangeTodoItemPriorityRoute } from './change-todo-item-priority/ChangeTodoItemPriorityRoute';

export type { TodoUseCases };

/**
 * Traduce los 9 casos de uso a rutas HTTP agnósticas. No sabe ni le importa
 * qué framework las va a servir — eso es trabajo del binder (no incluido acá).
 * Cada ruta vive en su propia carpeta, junto a su caso de uso; acá solo se
 * juntan las 9.
 */
export function createHttpRoutes(useCases: TodoUseCases): RouteDescriptor[] {
  return [
    createCreateTodoListRoute(useCases.createTodoList),
    createListTodoListsRoute(useCases.listTodoLists),
    createGetTodoListRoute(useCases.getTodoList),
    createDeleteTodoListRoute(useCases.deleteTodoList),
    createAddTodoItemRoute(useCases.addTodoItem),
    createCompleteTodoItemRoute(useCases.completeTodoItem),
    createRenameTodoItemRoute(useCases.renameTodoItem),
    createChangeTodoItemDescriptionRoute(useCases.changeTodoItemDescription),
    createChangeTodoItemPriorityRoute(useCases.changeTodoItemPriority),
  ];
}
