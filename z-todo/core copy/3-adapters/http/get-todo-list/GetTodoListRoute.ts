import { RouteDescriptor, HttpRequestData } from '../RouteDescriptor';
import { ROUTE_METHOD_PATH } from '../routeMetadata';
import { defaultErrorStatus } from '../httpErrorStatus';
import { GetTodoListUseCase } from '../../../2-application/use-cases/query/get-todo-list/GetTodoListUseCase';
import { GetTodoListInput } from '../../../2-application/use-cases/query/get-todo-list/GetTodoListInput';
import { GetTodoListOutput } from '../../../2-application/use-cases/query/get-todo-list/GetTodoListOutput';

export function createGetTodoListRoute(useCase: GetTodoListUseCase): RouteDescriptor<GetTodoListInput, GetTodoListOutput> {
  return {
    ...ROUTE_METHOD_PATH.getTodoList,
    buildInput: (req: HttpRequestData) => ({ listId: req.params.listId }),
    useCase,
    successStatus: 200,
    errorStatus: defaultErrorStatus,
  };
}
