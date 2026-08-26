import { Provider } from '@angular/core';
import { InMemoryTodoListRepository } from '@core-infrastructure/persistence/InMemoryTodoListRepository';
import { InMemoryEventBus } from '@core-infrastructure/messaging/InMemoryEventBus';
import { InMemoryUnitOfWork } from '@core-infrastructure/unit-of-work/InMemoryUnitOfWork';

import { CreateTodoListInteractor } from '@core-application/use-cases/commands/create-todo-list/CreateTodoListInteractor';
import { DeleteTodoListInteractor } from '@core-application/use-cases/commands/delete-todo-list/DeleteTodoListInteractor';
import { AddTodoItemInteractor } from '@core-application/use-cases/commands/add-todo-item/AddTodoItemInteractor';
import { CompleteTodoItemInteractor } from '@core-application/use-cases/commands/complete-todo-item/CompleteTodoItemInteractor';
import { RenameTodoItemInteractor } from '@core-application/use-cases/commands/rename-todo-item/RenameTodoItemInteractor';
import { ChangeTodoItemDescriptionInteractor } from '@core-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionInteractor';
import { ChangeTodoItemPriorityInteractor } from '@core-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityInteractor';
import { GetTodoListInteractor } from '@core-application/use-cases/query/get-todo-list/GetTodoListInteractor';
import { ListTodoListsInteractor } from '@core-application/use-cases/query/list-todo-lists/ListTodoListsInteractor';

import { TodoListRepositoryPort } from '@core-application/ports/out/TodoListRepositoryPort';
import { EventBusPort } from '@core-application/ports/out/EventBusPort';
import { UnitOfWorkPort } from '@core-application/ports/out/UnitOfWorkPort';

import {
  TODO_LIST_REPOSITORY,
  EVENT_BUS,
  UNIT_OF_WORK,
  CREATE_TODO_LIST_USE_CASE,
  DELETE_TODO_LIST_USE_CASE,
  ADD_TODO_ITEM_USE_CASE,
  COMPLETE_TODO_ITEM_USE_CASE,
  RENAME_TODO_ITEM_USE_CASE,
  CHANGE_TODO_ITEM_DESCRIPTION_USE_CASE,
  CHANGE_TODO_ITEM_PRIORITY_USE_CASE,
  GET_TODO_LIST_USE_CASE,
  LIST_TODO_LISTS_USE_CASE,
} from './tokens';

/**
 * Angular-DI equivalent of 4-generic-implementation/main.ts's composition root:
 * shares one instance of each in-memory infra adapter across every interactor.
 */
export function provideTodoComposition(): Provider[] {
  return [
    { provide: TODO_LIST_REPOSITORY, useFactory: () => new InMemoryTodoListRepository() },
    { provide: EVENT_BUS, useFactory: () => new InMemoryEventBus() },
    { provide: UNIT_OF_WORK, useFactory: () => new InMemoryUnitOfWork() },

    {
      provide: CREATE_TODO_LIST_USE_CASE,
      useFactory: (repo: TodoListRepositoryPort, bus: EventBusPort, uow: UnitOfWorkPort) =>
        new CreateTodoListInteractor(repo, bus, uow),
      deps: [TODO_LIST_REPOSITORY, EVENT_BUS, UNIT_OF_WORK],
    },
    {
      provide: DELETE_TODO_LIST_USE_CASE,
      useFactory: (repo: TodoListRepositoryPort, bus: EventBusPort, uow: UnitOfWorkPort) =>
        new DeleteTodoListInteractor(repo, bus, uow),
      deps: [TODO_LIST_REPOSITORY, EVENT_BUS, UNIT_OF_WORK],
    },
    {
      provide: ADD_TODO_ITEM_USE_CASE,
      useFactory: (repo: TodoListRepositoryPort, bus: EventBusPort, uow: UnitOfWorkPort) =>
        new AddTodoItemInteractor(repo, bus, uow),
      deps: [TODO_LIST_REPOSITORY, EVENT_BUS, UNIT_OF_WORK],
    },
    {
      provide: COMPLETE_TODO_ITEM_USE_CASE,
      useFactory: (repo: TodoListRepositoryPort, bus: EventBusPort, uow: UnitOfWorkPort) =>
        new CompleteTodoItemInteractor(repo, bus, uow),
      deps: [TODO_LIST_REPOSITORY, EVENT_BUS, UNIT_OF_WORK],
    },
    {
      provide: RENAME_TODO_ITEM_USE_CASE,
      useFactory: (repo: TodoListRepositoryPort, bus: EventBusPort, uow: UnitOfWorkPort) =>
        new RenameTodoItemInteractor(repo, bus, uow),
      deps: [TODO_LIST_REPOSITORY, EVENT_BUS, UNIT_OF_WORK],
    },
    {
      provide: CHANGE_TODO_ITEM_DESCRIPTION_USE_CASE,
      useFactory: (repo: TodoListRepositoryPort, bus: EventBusPort, uow: UnitOfWorkPort) =>
        new ChangeTodoItemDescriptionInteractor(repo, bus, uow),
      deps: [TODO_LIST_REPOSITORY, EVENT_BUS, UNIT_OF_WORK],
    },
    {
      provide: CHANGE_TODO_ITEM_PRIORITY_USE_CASE,
      useFactory: (repo: TodoListRepositoryPort, bus: EventBusPort, uow: UnitOfWorkPort) =>
        new ChangeTodoItemPriorityInteractor(repo, bus, uow),
      deps: [TODO_LIST_REPOSITORY, EVENT_BUS, UNIT_OF_WORK],
    },

    {
      provide: GET_TODO_LIST_USE_CASE,
      useFactory: (repo: TodoListRepositoryPort) => new GetTodoListInteractor(repo),
      deps: [TODO_LIST_REPOSITORY],
    },
    {
      provide: LIST_TODO_LISTS_USE_CASE,
      useFactory: (repo: TodoListRepositoryPort) => new ListTodoListsInteractor(repo),
      deps: [TODO_LIST_REPOSITORY],
    },
  ];
}
