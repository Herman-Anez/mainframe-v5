import { RouteDescriptor, HttpRequestData } from '../RouteDescriptor';
import { ROUTE_METHOD_PATH } from '../routeMetadata';
import { defaultErrorStatus } from '../httpErrorStatus';
import { bodyAsRecord, stringField } from '../httpBody';
import { AddTodoItemUseCase } from '../../2-application/use-cases/commands/add-todo-item/AddTodoItemUseCase';
import { AddTodoItemInput } from '../../2-application/use-cases/commands/add-todo-item/AddTodoItemInput';
import { AddTodoItemOutput } from '../../2-application/use-cases/commands/add-todo-item/AddTodoItemOutput';

export function createAddTodoItemRoute(useCase: AddTodoItemUseCase): RouteDescriptor<AddTodoItemInput, AddTodoItemOutput> {
  return {
    ...ROUTE_METHOD_PATH.addTodoItem,
    buildInput: (req: HttpRequestData) => {
      const body = bodyAsRecord(req.body);
      return {
        listId: req.params.listId,
        title: stringField(body, 'title'),
        description: stringField(body, 'description'),
        priority: stringField(body, 'priority', 'MEDIUM'),
      };
    },
    useCase,
    successStatus: 201,
    errorStatus: defaultErrorStatus,
  };
}
