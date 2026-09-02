import { RouteDescriptor } from '../RouteDescriptor';
import { ROUTE_METHOD_PATH } from '../routeMetadata';
import { defaultErrorStatus } from '../httpErrorStatus';
import { ListTodoListsUseCase } from '../../../use-cases/query/list-todo-lists/ListTodoListsUseCase';
import { ListTodoListsInput } from '../../../use-cases/query/list-todo-lists/ListTodoListsInput';
import { ListTodoListsOutput } from '../../../use-cases/query/list-todo-lists/ListTodoListsOutput';

export function createListTodoListsRoute(useCase: ListTodoListsUseCase): RouteDescriptor<ListTodoListsInput, ListTodoListsOutput> {
  return {
    ...ROUTE_METHOD_PATH.listTodoLists,
    buildInput: () => ({}),
    useCase,
    successStatus: 200,
    errorStatus: defaultErrorStatus,
  };
}
