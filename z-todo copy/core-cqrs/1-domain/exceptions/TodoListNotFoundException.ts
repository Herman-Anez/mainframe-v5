import { DomainException } from './DomainException';

export class TodoListNotFoundException extends DomainException {
  constructor(id: string) {
    super(`TodoList with id ${id} was not found`);
  }
}