import { DomainEvent } from './DomainEvent';

export class TodoItemPriorityChanged implements DomainEvent {
  readonly eventName = 'TodoItemPriorityChanged';
  readonly occurredOn: Date;

  constructor(
    readonly todoListId: string,
    readonly todoItemId: string,
    readonly newPriority: string,
  ) {
    this.occurredOn = new Date();
  }
}
