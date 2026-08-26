import { RouteDescriptor, HttpRequestData } from '../RouteDescriptor';
import { ROUTE_METHOD_PATH } from '../routeMetadata';
import { defaultErrorStatus } from '../httpErrorStatus';
import { bodyAsRecord, stringField } from '../httpBody';
import { ChangeTodoItemDescriptionUseCase } from '../../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionUseCase';
import { ChangeTodoItemDescriptionInput } from '../../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionInput';
import { ChangeTodoItemDescriptionOutput } from '../../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionOutput';

export function createChangeTodoItemDescriptionRoute(
  useCase: ChangeTodoItemDescriptionUseCase,
): RouteDescriptor<ChangeTodoItemDescriptionInput, ChangeTodoItemDescriptionOutput> {
  return {
    ...ROUTE_METHOD_PATH.changeTodoItemDescription,
    buildInput: (req: HttpRequestData) => ({
      listId: req.params.listId,
      itemId: req.params.itemId,
      newDescription: stringField(bodyAsRecord(req.body), 'newDescription'),
    }),
    useCase,
    successStatus: 200,
    errorStatus: defaultErrorStatus,
  };
}
