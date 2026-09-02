import { DomainEvent } from './DomainEvent';

export class TodoItemCompleted implements DomainEvent {
  readonly eventName = 'TodoItemCompleted';
  readonly occurredOn: Date;

  constructor(
    readonly todoListId: string,
    readonly todoItemId: string,
  ) {
    this.occurredOn = new Date();
  }
}