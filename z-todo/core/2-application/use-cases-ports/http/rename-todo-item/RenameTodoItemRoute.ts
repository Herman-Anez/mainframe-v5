import { RouteDescriptor, HttpRequestData } from '../RouteDescriptor';
import { ROUTE_METHOD_PATH } from '../routeMetadata';
import { defaultErrorStatus } from '../httpErrorStatus';
import { bodyAsRecord } from '../httpBody';
import { requireString } from '../httpValidation';
import { RenameTodoItemUseCase } from '../../../use-cases/commands/rename-todo-item/RenameTodoItemUseCase';
import { RenameTodoItemInput } from '../../../use-cases/commands/rename-todo-item/RenameTodoItemInput';
import { RenameTodoItemOutput } from '../../../use-cases/commands/rename-todo-item/RenameTodoItemOutput';

export function createRenameTodoItemRoute(useCase: RenameTodoItemUseCase): RouteDescriptor<RenameTodoItemInput, RenameTodoItemOutput> {
  return {
    ...ROUTE_METHOD_PATH.renameTodoItem,
    buildInput: (req: HttpRequestData) => ({
      listId: req.params.listId,
      itemId: req.params.itemId,
      newTitle: requireString(bodyAsRecord(req.body), 'newTitle'),
    }),
    useCase,
    successStatus: 200,
    errorStatus: defaultErrorStatus,
  };
}
