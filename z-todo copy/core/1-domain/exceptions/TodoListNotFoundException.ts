import { DomainException, DomainErrorCode } from './DomainException';

export class TodoListNotFoundException extends DomainException {
  readonly code: DomainErrorCode = 'NOT_FOUND';

  constructor(id: string) {
    super(`TodoList with id ${id} was not found`);
  }
}
