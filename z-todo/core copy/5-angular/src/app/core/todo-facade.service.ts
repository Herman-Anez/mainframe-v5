import { Inject, Injectable, signal } from '@angular/core';
import { runUseCase } from './angular-presenter';
import {
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
import { CreateTodoListUseCase } from '@core-application/use-cases/commands/create-todo-list/CreateTodoListUseCase';
import { DeleteTodoListUseCase } from '@core-application/use-cases/commands/delete-todo-list/DeleteTodoListUseCase';
import { AddTodoItemUseCase } from '@core-application/use-cases/commands/add-todo-item/AddTodoItemUseCase';
import { CompleteTodoItemUseCase } from '@core-application/use-cases/commands/complete-todo-item/CompleteTodoItemUseCase';
import { RenameTodoItemUseCase } from '@core-application/use-cases/commands/rename-todo-item/RenameTodoItemUseCase';
import { ChangeTodoItemDescriptionUseCase } from '@core-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionUseCase';
import { ChangeTodoItemPriorityUseCase } from '@core-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityUseCase';
import { GetTodoListUseCase } from '@core-application/use-cases/query/get-todo-list/GetTodoListUseCase';
import { GetTodoListOutput } from '@core-application/use-cases/query/get-todo-list/GetTodoListOutput';
import { ListTodoListsUseCase } from '@core-application/use-cases/query/list-todo-lists/ListTodoListsUseCase';
import { ListTodoListsOutput } from '@core-application/use-cases/query/list-todo-lists/ListTodoListsOutput';

@Injectable({ providedIn: 'root' })
export class TodoFacadeService {
  private readonly listsState = signal<GetTodoListOutput[]>([]);
  readonly lists = this.listsState.asReadonly();

  private readonly currentListState = signal<GetTodoListOutput | null>(null);
  readonly currentList = this.currentListState.asReadonly();

  constructor(
    @Inject(CREATE_TODO_LIST_USE_CASE) private readonly createTodoListUseCase: CreateTodoListUseCase,
    @Inject(DELETE_TODO_LIST_USE_CASE) private readonly deleteTodoListUseCase: DeleteTodoListUseCase,
    @Inject(ADD_TODO_ITEM_USE_CASE) private readonly addTodoItemUseCase: AddTodoItemUseCase,
    @Inject(COMPLETE_TODO_ITEM_USE_CASE) private readonly completeTodoItemUseCase: CompleteTodoItemUseCase,
    @Inject(RENAME_TODO_ITEM_USE_CASE) private readonly renameTodoItemUseCase: RenameTodoItemUseCase,
    @Inject(CHANGE_TODO_ITEM_DESCRIPTION_USE_CASE) private readonly changeItemDescriptionUseCase: ChangeTodoItemDescriptionUseCase,
    @Inject(CHANGE_TODO_ITEM_PRIORITY_USE_CASE) private readonly changeItemPriorityUseCase: ChangeTodoItemPriorityUseCase,
    @Inject(GET_TODO_LIST_USE_CASE) private readonly getTodoListUseCase: GetTodoListUseCase,
    @Inject(LIST_TODO_LISTS_USE_CASE) private readonly listTodoListsUseCase: ListTodoListsUseCase,
  ) {}

  async refreshLists(): Promise<void> {
    const output = await runUseCase<object, ListTodoListsOutput>(this.listTodoListsUseCase, {});
    this.listsState.set(output.lists);
  }

  async refreshCurrentList(listId: string): Promise<void> {
    const output = await runUseCase<{ listId: string }, GetTodoListOutput>(this.getTodoListUseCase, { listId });
    this.currentListState.set(output);
  }

  clearCurrentList(): void {
    this.currentListState.set(null);
  }

  async createList(name: string): Promise<void> {
    await runUseCase(this.createTodoListUseCase, { name });
    await this.refreshLists();
  }

  async deleteList(listId: string): Promise<void> {
    await runUseCase(this.deleteTodoListUseCase, { listId });
    this.currentListState.set(null);
    await this.refreshLists();
  }

  async addItem(listId: string, title: string, description: string, priority: string): Promise<void> {
    await runUseCase(this.addTodoItemUseCase, { listId, title, description, priority });
    await this.refreshCurrentList(listId);
  }

  async completeItem(listId: string, itemId: string): Promise<void> {
    await runUseCase(this.completeTodoItemUseCase, { listId, itemId });
    await this.refreshCurrentList(listId);
  }

  async renameItem(listId: string, itemId: string, newTitle: string): Promise<void> {
    await runUseCase(this.renameTodoItemUseCase, { listId, itemId, newTitle });
    await this.refreshCurrentList(listId);
  }

  async changeItemDescription(listId: string, itemId: string, newDescription: string): Promise<void> {
    await runUseCase(this.changeItemDescriptionUseCase, { listId, itemId, newDescription });
    await this.refreshCurrentList(listId);
  }

  async changeItemPriority(listId: string, itemId: string, newPriority: string): Promise<void> {
    await runUseCase(this.changeItemPriorityUseCase, { listId, itemId, newPriority });
    await this.refreshCurrentList(listId);
  }
}
