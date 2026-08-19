import { EventBusPort } from '../ports/out/EventBusPort';
import { TodoListReadModelPort } from '../ports/out/TodoListReadModelPort';
import { TodoListReadModel, TodoItemReadModel } from './TodoListReadModel';
import { TodoListCreated } from '../../1-domain/events/TodoListCreated';
import { TodoListDeleted } from '../../1-domain/events/TodoListDeleted';
import { TodoItemAdded } from '../../1-domain/events/TodoItemAdded';
import { TodoItemCompleted } from '../../1-domain/events/TodoItemCompleted';
import { TodoItemRenamed } from '../../1-domain/events/TodoItemRenamed';
import { TodoItemDescriptionChanged } from '../../1-domain/events/TodoItemDescriptionChanged';
import { TodoItemPriorityChanged } from '../../1-domain/events/TodoItemPriorityChanged';
import { TodoListDomainService } from '../../1-domain/services/TodoListDomainService';

/**
 * Mantiene el read model actualizado escuchando los mismos domain events
 * que ya publican los interactores de comando. Es el único escritor del
 * lado de lectura: las queries solo hacen findById/findAll.
 */
export class TodoListProjector {
  constructor(private readonly readModel: TodoListReadModelPort) {}

  subscribeTo(eventBus: EventBusPort): void {
    eventBus.subscribe('TodoListCreated', (event) => this.onTodoListCreated(event as TodoListCreated));
    eventBus.subscribe('TodoListDeleted', (event) => this.onTodoListDeleted(event as TodoListDeleted));
    eventBus.subscribe('TodoItemAdded', (event) => this.onTodoItemAdded(event as TodoItemAdded));
    eventBus.subscribe('TodoItemCompleted', (event) => this.onTodoItemCompleted(event as TodoItemCompleted));
    eventBus.subscribe('TodoItemRenamed', (event) => this.onTodoItemRenamed(event as TodoItemRenamed));
    eventBus.subscribe('TodoItemDescriptionChanged', (event) => this.onTodoItemDescriptionChanged(event as TodoItemDescriptionChanged));
    eventBus.subscribe('TodoItemPriorityChanged', (event) => this.onTodoItemPriorityChanged(event as TodoItemPriorityChanged));
  }

  async onTodoListCreated(event: TodoListCreated): Promise<void> {
    await this.readModel.upsert({
      id: event.todoListId,
      name: event.name,
      completionPercentage: 0,
      isFullyCompleted: false,
      items: [],
    });
  }

  async onTodoListDeleted(event: TodoListDeleted): Promise<void> {
    await this.readModel.remove(event.todoListId);
  }

  async onTodoItemAdded(event: TodoItemAdded): Promise<void> {
    const list = await this.readModel.findById(event.todoListId);
    if (!list) return;
    list.items.push({
      id: event.todoItemId,
      title: event.title,
      description: event.description,
      status: 'TODO',
      priority: event.priority,
    });
    await this.save(list);
  }

  async onTodoItemCompleted(event: TodoItemCompleted): Promise<void> {
    await this.updateItem(event.todoListId, event.todoItemId, (item) => {
      item.status = 'COMPLETED';
    });
  }

  async onTodoItemRenamed(event: TodoItemRenamed): Promise<void> {
    await this.updateItem(event.todoListId, event.todoItemId, (item) => {
      item.title = event.newTitle;
    });
  }

  async onTodoItemDescriptionChanged(event: TodoItemDescriptionChanged): Promise<void> {
    await this.updateItem(event.todoListId, event.todoItemId, (item) => {
      item.description = event.newDescription;
    });
  }

  async onTodoItemPriorityChanged(event: TodoItemPriorityChanged): Promise<void> {
    await this.updateItem(event.todoListId, event.todoItemId, (item) => {
      item.priority = event.newPriority;
    });
  }

  private async updateItem(
    listId: string,
    itemId: string,
    mutate: (item: TodoItemReadModel) => void,
  ): Promise<void> {
    const list = await this.readModel.findById(listId);
    if (!list) return;
    const item = list.items.find((i) => i.id === itemId);
    if (!item) return;
    mutate(item);
    await this.save(list);
  }

  private async save(list: TodoListReadModel): Promise<void> {
    list.completionPercentage = TodoListDomainService.calculateCompletionPercentage(list.items);
    list.isFullyCompleted = TodoListDomainService.isFullyCompleted(list.items);
    await this.readModel.upsert(list);
  }
}
