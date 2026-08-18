import { DomainEvent } from './DomainEvent';

export class TodoItemAdded implements DomainEvent {
  readonly eventName = 'TodoItemAdded';
  readonly occurredOn: Date;

  constructor(
    readonly todoListId: string,
    readonly todoItemId: string,
    readonly title: string,
  ) {
    this.occurredOn = new Date();
  }
}