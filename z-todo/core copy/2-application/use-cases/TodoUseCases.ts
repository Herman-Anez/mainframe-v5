import { CreateTodoListUseCase } from './commands/create-todo-list/CreateTodoListUseCase';
import { AddTodoItemUseCase } from './commands/add-todo-item/AddTodoItemUseCase';
import { CompleteTodoItemUseCase } from './commands/complete-todo-item/CompleteTodoItemUseCase';
import { RenameTodoItemUseCase } from './commands/rename-todo-item/RenameTodoItemUseCase';
import { ChangeTodoItemDescriptionUseCase } from './commands/change-todo-item-description/ChangeTodoItemDescriptionUseCase';
import { ChangeTodoItemPriorityUseCase } from './commands/change-todo-item-priority/ChangeTodoItemPriorityUseCase';
import { DeleteTodoListUseCase } from './commands/delete-todo-list/DeleteTodoListUseCase';
import { GetTodoListUseCase } from './query/get-todo-list/GetTodoListUseCase';
import { ListTodoListsUseCase } from './query/list-todo-lists/ListTodoListsUseCase';

/**
 * Único bundle de los 9 casos de uso del módulo. Fuente de verdad
 * compartida entre TodoListController (3-adapters/backend) y las rutas
 * HTTP (3-adapters/http/routes.ts) — antes cada uno tenía su propia copia
 * de esta misma lista de 9 campos.
 */
export interface TodoUseCases {
  createTodoList: CreateTodoListUseCase;
  addTodoItem: AddTodoItemUseCase;
  completeTodoItem: CompleteTodoItemUseCase;
  renameTodoItem: RenameTodoItemUseCase;
  changeTodoItemDescription: ChangeTodoItemDescriptionUseCase;
  changeTodoItemPriority: ChangeTodoItemPriorityUseCase;
  deleteTodoList: DeleteTodoListUseCase;
  getTodoList: GetTodoListUseCase;
  listTodoLists: ListTodoListsUseCase;
}
