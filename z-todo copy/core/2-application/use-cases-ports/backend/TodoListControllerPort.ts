import { OutputBoundary } from '../../shared/OutputBoundary';
import { CreateTodoListRequest } from './dtos/CreateTodoListRequest';
import { AddTodoItemRequest } from './dtos/AddTodoItemRequest';
import { CreateTodoListOutput } from '../../use-cases/commands/create-todo-list/CreateTodoListOutput';
import { AddTodoItemOutput } from '../../use-cases/commands/add-todo-item/AddTodoItemOutput';
import { CompleteTodoItemInput } from '../../use-cases/commands/complete-todo-item/CompleteTodoItemInput';
import { CompleteTodoItemOutput } from '../../use-cases/commands/complete-todo-item/CompleteTodoItemOutput';
import { GetTodoListInput } from '../../use-cases/query/get-todo-list/GetTodoListInput';
import { GetTodoListOutput } from '../../use-cases/query/get-todo-list/GetTodoListOutput';
import { RenameTodoItemInput } from '../../use-cases/commands/rename-todo-item/RenameTodoItemInput';
import { RenameTodoItemOutput } from '../../use-cases/commands/rename-todo-item/RenameTodoItemOutput';
import { ChangeTodoItemDescriptionInput } from '../../use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionInput';
import { ChangeTodoItemDescriptionOutput } from '../../use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionOutput';
import { ChangeTodoItemPriorityInput } from '../../use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityInput';
import { ChangeTodoItemPriorityOutput } from '../../use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityOutput';
import { DeleteTodoListInput } from '../../use-cases/commands/delete-todo-list/DeleteTodoListInput';
import { ListTodoListsOutput } from '../../use-cases/query/list-todo-lists/ListTodoListsOutput';

/**
 * El contrato de la interfaz de backend, separado de su implementación
 * (`TodoListController.ts`) — mismo patrón que `TodoListRepositoryPort` /
 * `InMemoryTodoListRepository`. Cualquier otra implementación (un fake para
 * tests, una versión que loguee cada llamada, etc) puede `implements` esto
 * sin que quien la consuma sepa la diferencia.
 */
export interface TodoListControllerPort {
  create(req: CreateTodoListRequest, output: OutputBoundary<CreateTodoListOutput>): Promise<void>;
  addItem(listId: string, req: AddTodoItemRequest, output: OutputBoundary<AddTodoItemOutput>): Promise<void>;
  completeItem(req: CompleteTodoItemInput, output: OutputBoundary<CompleteTodoItemOutput>): Promise<void>;
  getList(req: GetTodoListInput, output: OutputBoundary<GetTodoListOutput>): Promise<void>;
  renameItem(req: RenameTodoItemInput, output: OutputBoundary<RenameTodoItemOutput>): Promise<void>;
  changeItemDescription(req: ChangeTodoItemDescriptionInput, output: OutputBoundary<ChangeTodoItemDescriptionOutput>): Promise<void>;
  changeItemPriority(req: ChangeTodoItemPriorityInput, output: OutputBoundary<ChangeTodoItemPriorityOutput>): Promise<void>;
  deleteList(req: DeleteTodoListInput, output: OutputBoundary<void>): Promise<void>;
  listLists(output: OutputBoundary<ListTodoListsOutput>): Promise<void>;
}
