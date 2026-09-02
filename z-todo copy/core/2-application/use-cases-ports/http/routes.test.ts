import test from 'node:test';
import assert from 'node:assert/strict';
import { createHttpRoutes, TodoUseCases } from './routes';
import { HttpRequestData, RouteDescriptor } from './RouteDescriptor';
import { capture } from '../../shared/testing/capturePresenter';

import { InMemoryTodoListRepository } from '../../../4-infrastructure/persistence/InMemoryTodoListRepository';
import { InMemoryEventBus } from '../../../4-infrastructure/messaging/InMemoryEventBus';
import { InMemoryUnitOfWork } from '../../../4-infrastructure/unit-of-work/InMemoryUnitOfWork';

import { CreateTodoListInteractor } from '../../use-cases/commands/create-todo-list/CreateTodoListInteractor';
import { AddTodoItemInteractor } from '../../use-cases/commands/add-todo-item/AddTodoItemInteractor';
import { CompleteTodoItemInteractor } from '../../use-cases/commands/complete-todo-item/CompleteTodoItemInteractor';
import { RenameTodoItemInteractor } from '../../use-cases/commands/rename-todo-item/RenameTodoItemInteractor';
import { ChangeTodoItemDescriptionInteractor } from '../../use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionInteractor';
import { ChangeTodoItemPriorityInteractor } from '../../use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityInteractor';
import { DeleteTodoListInteractor } from '../../use-cases/commands/delete-todo-list/DeleteTodoListInteractor';
import { GetTodoListInteractor } from '../../use-cases/query/get-todo-list/GetTodoListInteractor';
import { ListTodoListsInteractor } from '../../use-cases/query/list-todo-lists/ListTodoListsInteractor';

function buildRealUseCases(): TodoUseCases {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();

  return {
    createTodoList: new CreateTodoListInteractor(repository, eventBus, unitOfWork),
    addTodoItem: new AddTodoItemInteractor(repository, eventBus, unitOfWork),
    completeTodoItem: new CompleteTodoItemInteractor(repository, eventBus, unitOfWork),
    renameTodoItem: new RenameTodoItemInteractor(repository, eventBus, unitOfWork),
    changeTodoItemDescription: new ChangeTodoItemDescriptionInteractor(repository, eventBus, unitOfWork),
    changeTodoItemPriority: new ChangeTodoItemPriorityInteractor(repository, eventBus, unitOfWork),
    deleteTodoList: new DeleteTodoListInteractor(repository, eventBus, unitOfWork),
    getTodoList: new GetTodoListInteractor(repository),
    listTodoLists: new ListTodoListsInteractor(repository),
  };
}

function findRoute(routes: RouteDescriptor[], method: string, path: string): RouteDescriptor {
  const route = routes.find((r) => r.method === method && r.path === path);
  assert.ok(route, `no existe la ruta ${method} ${path}`);
  return route!;
}

function fakeRequest(overrides: Partial<HttpRequestData> = {}): HttpRequestData {
  return { params: {}, query: {}, body: undefined, ...overrides };
}

test('createHttpRoutes expone las 9 rutas esperadas', () => {
  const routes = createHttpRoutes(buildRealUseCases());
  assert.equal(routes.length, 9);

  const signature = routes.map((r) => `${r.method} ${r.path}`).sort();
  assert.deepEqual(signature, [
    'DELETE /lists/:listId',
    'GET /lists',
    'GET /lists/:listId',
    'PATCH /lists/:listId/items/:itemId/description',
    'PATCH /lists/:listId/items/:itemId/priority',
    'PATCH /lists/:listId/items/:itemId/title',
    'POST /lists',
    'POST /lists/:listId/items',
    'POST /lists/:listId/items/:itemId/complete',
  ]);
});

test('flujo completo simulando requests HTTP, sin ningún servidor real de por medio', async () => {
  const routes = createHttpRoutes(buildRealUseCases());

  // POST /lists
  const createRoute = findRoute(routes, 'POST', '/lists');
  const createInput = createRoute.buildInput(fakeRequest({ body: { name: 'Compras del súper' } }));
  const created = capture<{ id: string; name: string }>();
  await createRoute.useCase.execute(createInput, created.presenter);
  assert.equal(created.state.error, undefined);
  assert.equal(createRoute.successStatus, 201);
  const listId = created.state.success!.id;

  // POST /lists/:listId/items
  const addItemRoute = findRoute(routes, 'POST', '/lists/:listId/items');
  const addItemInput = addItemRoute.buildInput(
    fakeRequest({ params: { listId }, body: { title: 'Comprar leche', description: '2 litros', priority: 'HIGH' } }),
  );
  const added = capture<{ itemId: string }>();
  await addItemRoute.useCase.execute(addItemInput, added.presenter);
  assert.ok(added.state.success?.itemId);

  // GET /lists/:listId
  const getRoute = findRoute(routes, 'GET', '/lists/:listId');
  const getInput = getRoute.buildInput(fakeRequest({ params: { listId } }));
  const fetched = capture<{ items: { id: string; title: string; description: string; priority: string }[] }>();
  await getRoute.useCase.execute(getInput, fetched.presenter);
  assert.equal(fetched.state.success?.items.length, 1);
  assert.equal(fetched.state.success?.items[0].description, '2 litros');
  assert.equal(fetched.state.success?.items[0].priority, 'HIGH');
  const itemId = fetched.state.success!.items[0].id;

  // PATCH /lists/:listId/items/:itemId/title
  const renameRoute = findRoute(routes, 'PATCH', '/lists/:listId/items/:itemId/title');
  const renameInput = renameRoute.buildInput(
    fakeRequest({ params: { listId, itemId }, body: { newTitle: 'Comprar leche deslactosada' } }),
  );
  const renamed = capture<{ item: { title: string } }>();
  await renameRoute.useCase.execute(renameInput, renamed.presenter);
  assert.equal(renamed.state.success?.item.title, 'Comprar leche deslactosada');

  // POST /lists/:listId/items/:itemId/complete
  const completeRoute = findRoute(routes, 'POST', '/lists/:listId/items/:itemId/complete');
  const completeInput = completeRoute.buildInput(fakeRequest({ params: { listId, itemId } }));
  const completed = capture<{ item: { status: string } }>();
  await completeRoute.useCase.execute(completeInput, completed.presenter);
  assert.equal(completed.state.success?.item.status, 'COMPLETED');

  // DELETE /lists/:listId
  const deleteRoute = findRoute(routes, 'DELETE', '/lists/:listId');
  const deleteInput = deleteRoute.buildInput(fakeRequest({ params: { listId } }));
  const deleted = capture<void>();
  await deleteRoute.useCase.execute(deleteInput, deleted.presenter);
  assert.equal(deleted.state.settled, 'success');
  assert.equal(deleteRoute.successStatus, 204);

  // GET /lists/:listId de nuevo, ahora tiene que fallar con 404
  const getAfterDelete = capture<unknown>();
  await getRoute.useCase.execute(getInput, getAfterDelete.presenter);
  assert.equal(getAfterDelete.state.success, undefined);
  assert.equal(getRoute.errorStatus(getAfterDelete.state.error!), 404);
});

test('errorStatus: NOT_FOUND→404, VALIDATION de dominio→422, request malformado→400', async () => {
  const routes = createHttpRoutes(buildRealUseCases());
  const getRoute = findRoute(routes, 'GET', '/lists/:listId');

  // Lista inexistente → TodoListNotFoundException (code NOT_FOUND) → 404
  const notFound = capture<unknown>();
  await getRoute.useCase.execute(getRoute.buildInput(fakeRequest({ params: { listId: 'no-existe' } })), notFound.presenter);
  assert.equal(getRoute.errorStatus(notFound.state.error!), 404);

  const createRoute = findRoute(routes, 'POST', '/lists');

  // Nombre demasiado corto → ValidationException de dominio (code VALIDATION) → 422
  const invalidName = capture<unknown>();
  await createRoute.useCase.execute(createRoute.buildInput(fakeRequest({ body: { name: 'ab' } })), invalidName.presenter);
  assert.equal(invalidName.state.success, undefined);
  assert.equal(createRoute.errorStatus(invalidName.state.error!), 422);

  // Body sin `name` → RequestValidationError en buildInput → 400
  assert.throws(
    () => createRoute.buildInput(fakeRequest({ body: {} })),
    (err: Error) => {
      assert.equal(err.name, 'RequestValidationError');
      assert.equal(createRoute.errorStatus(err), 400);
      return true;
    },
  );
});
