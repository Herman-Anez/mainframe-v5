import { DomainEvent } from './DomainEvent';

export class TodoItemDescriptionChanged implements DomainEvent {
  readonly eventName = 'TodoItemDescriptionChanged';
  readonly occurredOn: Date;

  constructor(
    readonly todoListId: string,
    readonly todoItemId: string,
    readonly newDescription: string,
  ) {
    this.occurredOn = new Date();
  }
}
