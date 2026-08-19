import { DomainEvent } from './DomainEvent';

export class TodoListCreated implements DomainEvent {
  readonly eventName = 'TodoListCreated';
  readonly occurredOn: Date;

  constructor(
    readonly todoListId: string,
    readonly name: string,
  ) {
    this.occurredOn = new Date();
  }
}