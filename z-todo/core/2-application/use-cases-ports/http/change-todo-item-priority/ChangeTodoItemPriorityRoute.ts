import { RouteDescriptor, HttpRequestData } from '../RouteDescriptor';
import { ROUTE_METHOD_PATH } from '../routeMetadata';
import { defaultErrorStatus } from '../httpErrorStatus';
import { bodyAsRecord, stringField } from '../httpBody';
import { ChangeTodoItemPriorityUseCase } from '../../../use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityUseCase';
import { ChangeTodoItemPriorityInput } from '../../../use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityInput';
import { ChangeTodoItemPriorityOutput } from '../../../use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityOutput';

export function createChangeTodoItemPriorityRoute(
  useCase: ChangeTodoItemPriorityUseCase,
): RouteDescriptor<ChangeTodoItemPriorityInput, ChangeTodoItemPriorityOutput> {
  return {
    ...ROUTE_METHOD_PATH.changeTodoItemPriority,
    buildInput: (req: HttpRequestData) => ({
      listId: req.params.listId,
      itemId: req.params.itemId,
      newPriority: stringField(bodyAsRecord(req.body), 'newPriority'),
    }),
    useCase,
    successStatus: 200,
    errorStatus: defaultErrorStatus,
  };
}
