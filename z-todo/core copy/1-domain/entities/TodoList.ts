import { TodoListId } from '../value-objects/TodoListId';
import { Title } from '../value-objects/Title';
import { TodoItem } from './TodoItem';
import { DomainEvent } from '../events/DomainEvent';
import { TodoListCreated } from '../events/TodoListCreated';
import { TodoItemAdded } from '../events/TodoItemAdded';
import { TodoItemCompleted } from '../events/TodoItemCompleted';
import { TodoItemRenamed } from '../events/TodoItemRenamed';
import { TodoItemDescriptionChanged } from '../events/TodoItemDescriptionChanged';
import { TodoItemPriorityChanged } from '../events/TodoItemPriorityChanged';
import { TodoItemNotFoundException } from '../exceptions/TodoItemNotFoundException';

export class TodoList {
  private _items: TodoItem[] = [];
  private _domainEvents: DomainEvent[] = [];

  private constructor(
    readonly id: TodoListId,
    private _name: Title,
  ) {}

  static create(name: string): TodoList {
    const list = new TodoList(TodoListId.create(), Title.create(name));
    list.addDomainEvent(new TodoListCreated(list.id.value, list.name));
    return list;
  }

  static fromPersistence(id: string, name: string, items: TodoItem[]): TodoList {
    const list = new TodoList(TodoListId.from(id), Title.create(name));
    list._items = items;
    return list;
  }

  get name(): string { return this._name.value; }
  get items(): readonly TodoItem[] { return this._items; }

  get domainEvents(): readonly DomainEvent[] { return this._domainEvents; }
  clearEvents(): void { this._domainEvents = []; }
  private addDomainEvent(event: DomainEvent): void { this._domainEvents.push(event); }

  addItem(title: string, description: string = '', priority: string = 'MEDIUM'): TodoItem {
    if (this._items.length >= 10) {
      throw new Error('TodoList cannot have more than 10 items');
    }
    const item = TodoItem.create(title, description, priority);
    this._items.push(item);
    this.addDomainEvent(new TodoItemAdded(this.id.value, item.id.value, item.title, item.description, item.priority));
    return item;
  }

  completeItem(itemId: string): void {
    const item = this.findItemOrThrow(itemId);
    item.complete();
    this.addDomainEvent(new TodoItemCompleted(this.id.value, itemId));
  }

  renameItem(itemId: string, newTitle: string): void {
    const item = this.findItemOrThrow(itemId);
    item.rename(newTitle);
    this.addDomainEvent(new TodoItemRenamed(this.id.value, itemId, item.title));
  }

  changeItemDescription(itemId: string, newDescription: string): void {
    const item = this.findItemOrThrow(itemId);
    item.changeDescription(newDescription);
    this.addDomainEvent(new TodoItemDescriptionChanged(this.id.value, itemId, item.description));
  }

  changeItemPriority(itemId: string, newPriority: string): void {
    const item = this.findItemOrThrow(itemId);
    item.changePriority(newPriority);
    this.addDomainEvent(new TodoItemPriorityChanged(this.id.value, itemId, item.priority));
  }

  private findItemOrThrow(itemId: string): TodoItem {
    const item = this._items.find(i => i.id.value === itemId);
    if (!item) {
      throw new TodoItemNotFoundException(itemId, this.id.value);
    }
    return item;
  }
}