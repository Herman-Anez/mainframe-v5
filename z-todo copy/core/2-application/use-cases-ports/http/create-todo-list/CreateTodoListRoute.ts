import { RouteDescriptor, HttpRequestData } from '../RouteDescriptor';
import { ROUTE_METHOD_PATH } from '../routeMetadata';
import { defaultErrorStatus } from '../httpErrorStatus';
import { bodyAsRecord } from '../httpBody';
import { requireString } from '../httpValidation';
import { CreateTodoListUseCase } from '../../../use-cases/commands/create-todo-list/CreateTodoListUseCase';
import { CreateTodoListInput } from '../../../use-cases/commands/create-todo-list/CreateTodoListInput';
import { CreateTodoListOutput } from '../../../use-cases/commands/create-todo-list/CreateTodoListOutput';

export function createCreateTodoListRoute(useCase: CreateTodoListUseCase): RouteDescriptor<CreateTodoListInput, CreateTodoListOutput> {
  return {
    ...ROUTE_METHOD_PATH.createTodoList,
    buildInput: (req: HttpRequestData) => ({ name: requireString(bodyAsRecord(req.body), 'name') }),
    useCase,
    successStatus: 201,
    errorStatus: defaultErrorStatus,
  };
}
