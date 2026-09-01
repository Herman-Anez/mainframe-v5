import { CreateTodoListRequest } from './dtos/CreateTodoListRequest';
import { AddTodoItemRequest } from './dtos/AddTodoItemRequest';
import { CreateTodoListOutputBoundary } from '../../2-application/use-cases/commands/create-todo-list/CreateTodoListOutputBoundary';
import { AddTodoItemOutputBoundary } from '../../2-application/use-cases/commands/add-todo-item/AddTodoItemOutputBoundary';
import { CompleteTodoItemInput } from '../../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemInput';
import { CompleteTodoItemOutputBoundary } from '../../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemOutputBoundary';
import { GetTodoListInput } from '../../2-application/use-cases/query/get-todo-list/GetTodoListInput';
import { GetTodoListOutputBoundary } from '../../2-application/use-cases/query/get-todo-list/GetTodoListOutputBoundary';
import { RenameTodoItemInput } from '../../2-application/use-cases/commands/rename-todo-item/RenameTodoItemInput';
import { RenameTodoItemOutputBoundary } from '../../2-application/use-cases/commands/rename-todo-item/RenameTodoItemOutputBoundary';
import { ChangeTodoItemDescriptionInput } from '../../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionInput';
import { ChangeTodoItemDescriptionOutputBoundary } from '../../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionOutputBoundary';
import { ChangeTodoItemPriorityInput } from '../../2-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityInput';
import { ChangeTodoItemPriorityOutputBoundary } from '../../2-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityOutputBoundary';
import { DeleteTodoListInput } from '../../2-application/use-cases/commands/delete-todo-list/DeleteTodoListInput';
import { DeleteTodoListOutputBoundary } from '../../2-application/use-cases/commands/delete-todo-list/DeleteTodoListOutputBoundary';
import { ListTodoListsOutputBoundary } from '../../2-application/use-cases/query/list-todo-lists/ListTodoListsOutputBoundary';

/**
 * El contrato de la interfaz de backend, separado de su implementación
 * (`TodoListController.ts`) — mismo patrón que `TodoListRepositoryPort` /
 * `InMemoryTodoListRepository`. Cualquier otra implementación (un fake para
 * tests, una versión que loguee cada llamada, etc) puede `implements` esto
 * sin que quien la consuma sepa la diferencia.
 */
export interface TodoListControllerPort {
  create(req: CreateTodoListRequest, output: CreateTodoListOutputBoundary): Promise<void>;
  addItem(listId: string, req: AddTodoItemRequest, output: AddTodoItemOutputBoundary): Promise<void>;
  completeItem(req: CompleteTodoItemInput, output: CompleteTodoItemOutputBoundary): Promise<void>;
  getList(req: GetTodoListInput, output: GetTodoListOutputBoundary): Promise<void>;
  renameItem(req: RenameTodoItemInput, output: RenameTodoItemOutputBoundary): Promise<void>;
  changeItemDescription(req: ChangeTodoItemDescriptionInput, output: ChangeTodoItemDescriptionOutputBoundary): Promise<void>;
  changeItemPriority(req: ChangeTodoItemPriorityInput, output: ChangeTodoItemPriorityOutputBoundary): Promise<void>;
  deleteList(req: DeleteTodoListInput, output: DeleteTodoListOutputBoundary): Promise<void>;
  listLists(output: ListTodoListsOutputBoundary): Promise<void>;
}
