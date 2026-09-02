import { RouteDescriptor, HttpRequestData } from '../RouteDescriptor';
import { ROUTE_METHOD_PATH } from '../routeMetadata';
import { defaultErrorStatus } from '../httpErrorStatus';
import { DeleteTodoListUseCase } from '../../../use-cases/commands/delete-todo-list/DeleteTodoListUseCase';
import { DeleteTodoListInput } from '../../../use-cases/commands/delete-todo-list/DeleteTodoListInput';

export function createDeleteTodoListRoute(useCase: DeleteTodoListUseCase): RouteDescriptor<DeleteTodoListInput, void> {
  return {
    ...ROUTE_METHOD_PATH.deleteTodoList,
    buildInput: (req: HttpRequestData) => ({ listId: req.params.listId }),
    useCase,
    successStatus: 204,
    errorStatus: defaultErrorStatus,
  };
}
