import { RouteDescriptor, HttpRequestData } from '../RouteDescriptor';
import { ROUTE_METHOD_PATH } from '../routeMetadata';
import { defaultErrorStatus } from '../httpErrorStatus';
import { CompleteTodoItemUseCase } from '../../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemUseCase';
import { CompleteTodoItemInput } from '../../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemInput';
import { CompleteTodoItemOutput } from '../../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemOutput';

export function createCompleteTodoItemRoute(useCase: CompleteTodoItemUseCase): RouteDescriptor<CompleteTodoItemInput, CompleteTodoItemOutput> {
  return {
    ...ROUTE_METHOD_PATH.completeTodoItem,
    buildInput: (req: HttpRequestData) => ({ listId: req.params.listId, itemId: req.params.itemId }),
    useCase,
    successStatus: 200,
    errorStatus: defaultErrorStatus,
  };
}
