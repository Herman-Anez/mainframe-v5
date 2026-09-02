import { DomainException, DomainErrorCode } from './DomainException';

export class TodoItemAlreadyCompletedException extends DomainException {
  readonly code: DomainErrorCode = 'CONFLICT';

  constructor() {
    super('TodoItem is already completed');
  }
}
