import { DomainEvent } from './DomainEvent';

export class TodoListDeleted implements DomainEvent {
  readonly eventName = 'TodoListDeleted';
  readonly occurredOn: Date;

  constructor(
    readonly todoListId: string,
    readonly name: string,
  ) {
    this.occurredOn = new Date();
  }
}
