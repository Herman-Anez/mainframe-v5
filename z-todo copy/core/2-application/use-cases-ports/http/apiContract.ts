import { HttpMethod } from './RouteDescriptor';
import { ROUTE_METHOD_PATH, RouteKey } from './routeMetadata';

import { CreateTodoListInput } from '../../use-cases/commands/create-todo-list/CreateTodoListInput';
import { CreateTodoListOutput } from '../../use-cases/commands/create-todo-list/CreateTodoListOutput';
import { AddTodoItemInput } from '../../use-cases/commands/add-todo-item/AddTodoItemInput';
import { AddTodoItemOutput } from '../../use-cases/commands/add-todo-item/AddTodoItemOutput';
import { CompleteTodoItemInput } from '../../use-cases/commands/complete-todo-item/CompleteTodoItemInput';
import { CompleteTodoItemOutput } from '../../use-cases/commands/complete-todo-item/CompleteTodoItemOutput';
import { RenameTodoItemInput } from '../../use-cases/commands/rename-todo-item/RenameTodoItemInput';
import { RenameTodoItemOutput } from '../../use-cases/commands/rename-todo-item/RenameTodoItemOutput';
import { ChangeTodoItemDescriptionInput } from '../../use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionInput';
import { ChangeTodoItemDescriptionOutput } from '../../use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionOutput';
import { ChangeTodoItemPriorityInput } from '../../use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityInput';
import { ChangeTodoItemPriorityOutput } from '../../use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityOutput';
import { DeleteTodoListInput } from '../../use-cases/commands/delete-todo-list/DeleteTodoListInput';
import { GetTodoListInput } from '../../use-cases/query/get-todo-list/GetTodoListInput';
import { GetTodoListOutput } from '../../use-cases/query/get-todo-list/GetTodoListOutput';
import { ListTodoListsInput } from '../../use-cases/query/list-todo-lists/ListTodoListsInput';
import { ListTodoListsOutput } from '../../use-cases/query/list-todo-lists/ListTodoListsOutput';

/**
 * El contrato que le importa a un FRONTEND, no a un servidor. Nadie acá
 * instancia un caso de uso — un frontend no tiene interactores, tiene un
 * `fetch`. Esto solo le da lo que necesita para armar ese `fetch` bien:
 * a qué URL, con qué método, y con qué forma de datos de ida y de vuelta.
 *
 * Cero imports de Angular, React, Express, ni nada — puro TypeScript.
 */

/**
 * Mapa SOLO DE TIPOS — se borra por completo al compilar a JS, no existe
 * en runtime. Es lo que le da a un cliente HTTP el tipado de Input/Output
 * por cada endpoint, sin duplicar los shapes ya definidos en 2-application.
 */
export interface ApiContractTypes {
  createTodoList: { input: CreateTodoListInput; output: CreateTodoListOutput };
  listTodoLists: { input: ListTodoListsInput; output: ListTodoListsOutput };
  getTodoList: { input: GetTodoListInput; output: GetTodoListOutput };
  deleteTodoList: { input: DeleteTodoListInput; output: void };
  addTodoItem: { input: AddTodoItemInput; output: AddTodoItemOutput };
  completeTodoItem: { input: CompleteTodoItemInput; output: CompleteTodoItemOutput };
  renameTodoItem: { input: RenameTodoItemInput; output: RenameTodoItemOutput };
  changeTodoItemDescription: { input: ChangeTodoItemDescriptionInput; output: ChangeTodoItemDescriptionOutput };
  changeTodoItemPriority: { input: ChangeTodoItemPriorityInput; output: ChangeTodoItemPriorityOutput };
}

/** El objeto runtime real: método + path por endpoint, tomados de la única fuente de verdad. */
export const ApiContract: Record<RouteKey, { method: HttpMethod; path: string }> = ROUTE_METHOD_PATH;

/**
 * Sustituye tokens `:nombre` de un path por valores reales.
 * buildPath('/lists/:listId/items/:itemId', { listId: 'a', itemId: 'b' })
 *   → '/lists/a/items/b'
 * Lanza si falta algún param que el path necesita — mejor fallar acá que
 * mandar una URL con un ':listId' literal en el medio.
 */
export function buildPath(path: string, params: Record<string, string> = {}): string {
  return path.replace(/:([A-Za-z0-9_]+)/g, (match, paramName: string) => {
    const value = params[paramName];
    if (value === undefined) {
      throw new Error(`buildPath: falta el parámetro "${paramName}" para el path "${path}"`);
    }
    return encodeURIComponent(value);
  });
}
