import { RouteDescriptor, HttpRequestData } from '../RouteDescriptor';
import { ROUTE_METHOD_PATH } from '../routeMetadata';
import { defaultErrorStatus } from '../httpErrorStatus';
import { bodyAsRecord, stringField } from '../httpBody';
import { CreateTodoListUseCase } from '../../2-application/use-cases/commands/create-todo-list/CreateTodoListUseCase';
import { CreateTodoListInput } from '../../2-application/use-cases/commands/create-todo-list/CreateTodoListInput';
import { CreateTodoListOutput } from '../../2-application/use-cases/commands/create-todo-list/CreateTodoListOutput';

export function createCreateTodoListRoute(useCase: CreateTodoListUseCase): RouteDescriptor<CreateTodoListInput, CreateTodoListOutput> {
  return {
    ...ROUTE_METHOD_PATH.createTodoList,
    buildInput: (req: HttpRequestData) => ({ name: stringField(bodyAsRecord(req.body), 'name') }),
    useCase,
    successStatus: 201,
    errorStatus: defaultErrorStatus,
  };
}
