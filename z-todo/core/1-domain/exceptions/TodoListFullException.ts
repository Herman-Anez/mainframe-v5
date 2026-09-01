import { DomainException, DomainErrorCode } from './DomainException';

export class TodoListFullException extends DomainException {
  readonly code: DomainErrorCode = 'CONFLICT';

  constructor(max: number) {
    super(`TodoList cannot have more than ${max} items`);
  }
}
