import { RouteDescriptor, HttpRequestData } from '../RouteDescriptor';
import { ROUTE_METHOD_PATH } from '../routeMetadata';
import { defaultErrorStatus } from '../httpErrorStatus';
import { DeleteTodoListUseCase } from '../../../2-application/use-cases/commands/delete-todo-list/DeleteTodoListUseCase';
import { DeleteTodoListInput } from '../../../2-application/use-cases/commands/delete-todo-list/DeleteTodoListInput';
import { DeleteTodoListOutput } from '../../../2-application/use-cases/commands/delete-todo-list/DeleteTodoListOutput';

export function createDeleteTodoListRoute(useCase: DeleteTodoListUseCase): RouteDescriptor<DeleteTodoListInput, DeleteTodoListOutput> {
  return {
    ...ROUTE_METHOD_PATH.deleteTodoList,
    buildInput: (req: HttpRequestData) => ({ listId: req.params.listId }),
    useCase,
    successStatus: 200,
    errorStatus: defaultErrorStatus,
  };
}
