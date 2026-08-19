import { DomainException } from './DomainException';

export class TodoItemNotFoundException extends DomainException {
  constructor(itemId: string, listId?: string) {
    super(`TodoItem with id ${itemId} not found${listId ? ` in list ${listId}` : ''}`);
  }
}