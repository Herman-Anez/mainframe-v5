import { DomainEvent } from './DomainEvent';

export class TodoItemRenamed implements DomainEvent {
  readonly eventName = 'TodoItemRenamed';
  readonly occurredOn: Date;

  constructor(
    readonly todoListId: string,
    readonly todoItemId: string,
    readonly newTitle: string,
  ) {
    this.occurredOn = new Date();
  }
}
