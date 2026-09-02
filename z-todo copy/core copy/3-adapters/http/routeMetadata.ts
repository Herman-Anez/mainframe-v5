import { HttpMethod } from './RouteDescriptor';

/**
 * Única fuente de verdad para "qué método + qué path" tiene cada caso de
 * uso expuesto por HTTP. Cero imports de 2-application, cero imports de
 * ningún framework — puro dato, consumible tanto por el servidor
 * (routes.ts, para armar los RouteDescriptor reales) como por un frontend
 * (apiContract.ts, que no tiene ni necesita instancias de casos de uso).
 */
export const ROUTE_METHOD_PATH = {
  createTodoList: { method: 'POST', path: '/lists' },
  listTodoLists: { method: 'GET', path: '/lists' },
  getTodoList: { method: 'GET', path: '/lists/:listId' },
  deleteTodoList: { method: 'DELETE', path: '/lists/:listId' },
  addTodoItem: { method: 'POST', path: '/lists/:listId/items' },
  completeTodoItem: { method: 'POST', path: '/lists/:listId/items/:itemId/complete' },
  renameTodoItem: { method: 'PATCH', path: '/lists/:listId/items/:itemId/title' },
  changeTodoItemDescription: { method: 'PATCH', path: '/lists/:listId/items/:itemId/description' },
  changeTodoItemPriority: { method: 'PATCH', path: '/lists/:listId/items/:itemId/priority' },
} as const satisfies Record<string, { method: HttpMethod; path: string }>;

export type RouteKey = keyof typeof ROUTE_METHOD_PATH;
