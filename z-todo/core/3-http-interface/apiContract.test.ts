import test from 'node:test';
import assert from 'node:assert/strict';
import { ApiContract, buildPath } from './apiContract';
import { createHttpRoutes, TodoUseCases } from './routes';

const EXPECTED_KEYS = [
  'createTodoList',
  'listTodoLists',
  'getTodoList',
  'deleteTodoList',
  'addTodoItem',
  'completeTodoItem',
  'renameTodoItem',
  'changeTodoItemDescription',
  'changeTodoItemPriority',
].sort();

test('ApiContract tiene exactamente las 9 keys de TodoUseCases, ni una más ni una menos', () => {
  assert.deepEqual(Object.keys(ApiContract).sort(), EXPECTED_KEYS);
});

test('ApiContract coincide método/path con lo que createHttpRoutes arma para el servidor', () => {
  // Nunca se instancian casos de uso reales acá — solo nos importa la forma
  // de los RouteDescriptor, así que "any" alcanza como fake de TodoUseCases
  // para este chequeo de coherencia (no se llama a nada de esto).
  const fakeUseCases = new Proxy({}, { get: () => undefined }) as unknown as TodoUseCases;
  const routes = createHttpRoutes(fakeUseCases);

  for (const key of Object.keys(ApiContract) as (keyof typeof ApiContract)[]) {
    const contractEntry = ApiContract[key];
    const matchingRoute = routes.find((r) => r.method === contractEntry.method && r.path === contractEntry.path);
    assert.ok(matchingRoute, `ApiContract.${key} (${contractEntry.method} ${contractEntry.path}) no tiene ruta real correspondiente`);
  }
});

test('ApiContract expone paths y métodos correctos para un par de endpoints de referencia', () => {
  assert.deepEqual(ApiContract.createTodoList, { method: 'POST', path: '/lists' });
  assert.deepEqual(ApiContract.getTodoList, { method: 'GET', path: '/lists/:listId' });
  assert.deepEqual(ApiContract.changeTodoItemPriority, {
    method: 'PATCH',
    path: '/lists/:listId/items/:itemId/priority',
  });
});

test('buildPath sustituye un solo param', () => {
  assert.equal(buildPath('/lists/:listId', { listId: 'abc-123' }), '/lists/abc-123');
});

test('buildPath sustituye múltiples params', () => {
  assert.equal(
    buildPath('/lists/:listId/items/:itemId/priority', { listId: 'a', itemId: 'b' }),
    '/lists/a/items/b/priority',
  );
});

test('buildPath escapa valores especiales en la URL', () => {
  assert.equal(buildPath('/lists/:listId', { listId: 'a/b c' }), '/lists/a%2Fb%20c');
});

test('buildPath lanza si falta un param requerido por el path', () => {
  assert.throws(() => buildPath('/lists/:listId/items/:itemId', { listId: 'a' }), /falta el parámetro "itemId"/);
});

test('buildPath no toca paths sin params', () => {
  assert.equal(buildPath('/lists'), '/lists');
});
