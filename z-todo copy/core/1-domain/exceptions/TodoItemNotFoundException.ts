import { DomainException, DomainErrorCode } from './DomainException';

export class TodoItemNotFoundException extends DomainException {
  readonly code: DomainErrorCode = 'NOT_FOUND';

  constructor(itemId: string, listId?: string) {
    super(`TodoItem with id ${itemId} not found${listId ? ` in list ${listId}` : ''}`);
  }
}
