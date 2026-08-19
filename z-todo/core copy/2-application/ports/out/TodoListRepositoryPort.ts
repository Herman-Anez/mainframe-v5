import { TodoList } from '../../../1-domain/entities/TodoList';
import { TodoListId } from '../../../1-domain/value-objects/TodoListId';

export interface TodoListRepositoryPort {
  save(todoList: TodoList): Promise<void>;
  findById(id: TodoListId): Promise<TodoList | null>;
  findAll(): Promise<TodoList[]>;
  delete(id: TodoListId): Promise<void>;
}