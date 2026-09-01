import { InjectionToken } from '@angular/core';
import { TodoListRepositoryPort } from '@core-application/ports/out/TodoListRepositoryPort';
import { EventBusPort } from '@core-application/ports/out/EventBusPort';
import { UnitOfWorkPort } from '@core-application/ports/out/UnitOfWorkPort';
import { CreateTodoListUseCase } from '@core-application/use-cases/commands/create-todo-list/CreateTodoListUseCase';
import { DeleteTodoListUseCase } from '@core-application/use-cases/commands/delete-todo-list/DeleteTodoListUseCase';
import { AddTodoItemUseCase } from '@core-application/use-cases/commands/add-todo-item/AddTodoItemUseCase';
import { CompleteTodoItemUseCase } from '@core-application/use-cases/commands/complete-todo-item/CompleteTodoItemUseCase';
import { RenameTodoItemUseCase } from '@core-application/use-cases/commands/rename-todo-item/RenameTodoItemUseCase';
import { ChangeTodoItemDescriptionUseCase } from '@core-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionUseCase';
import { ChangeTodoItemPriorityUseCase } from '@core-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityUseCase';
import { GetTodoListUseCase } from '@core-application/use-cases/query/get-todo-list/GetTodoListUseCase';
import { ListTodoListsUseCase } from '@core-application/use-cases/query/list-todo-lists/ListTodoListsUseCase';

export const TODO_LIST_REPOSITORY = new InjectionToken<TodoListRepositoryPort>('TODO_LIST_REPOSITORY');
export const EVENT_BUS = new InjectionToken<EventBusPort>('EVENT_BUS');
export const UNIT_OF_WORK = new InjectionToken<UnitOfWorkPort>('UNIT_OF_WORK');

export const CREATE_TODO_LIST_USE_CASE = new InjectionToken<CreateTodoListUseCase>('CREATE_TODO_LIST_USE_CASE');
export const DELETE_TODO_LIST_USE_CASE = new InjectionToken<DeleteTodoListUseCase>('DELETE_TODO_LIST_USE_CASE');
export const ADD_TODO_ITEM_USE_CASE = new InjectionToken<AddTodoItemUseCase>('ADD_TODO_ITEM_USE_CASE');
export const COMPLETE_TODO_ITEM_USE_CASE = new InjectionToken<CompleteTodoItemUseCase>('COMPLETE_TODO_ITEM_USE_CASE');
export const RENAME_TODO_ITEM_USE_CASE = new InjectionToken<RenameTodoItemUseCase>('RENAME_TODO_ITEM_USE_CASE');
export const CHANGE_TODO_ITEM_DESCRIPTION_USE_CASE = new InjectionToken<ChangeTodoItemDescriptionUseCase>('CHANGE_TODO_ITEM_DESCRIPTION_USE_CASE');
export const CHANGE_TODO_ITEM_PRIORITY_USE_CASE = new InjectionToken<ChangeTodoItemPriorityUseCase>('CHANGE_TODO_ITEM_PRIORITY_USE_CASE');
export const GET_TODO_LIST_USE_CASE = new InjectionToken<GetTodoListUseCase>('GET_TODO_LIST_USE_CASE');
export const LIST_TODO_LISTS_USE_CASE = new InjectionToken<ListTodoListsUseCase>('LIST_TODO_LISTS_USE_CASE');
