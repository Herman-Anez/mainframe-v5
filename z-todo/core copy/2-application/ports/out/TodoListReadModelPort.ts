import { TodoListReadModel } from '../../read-model/TodoListReadModel';

export interface TodoListReadModelPort {
  findById(id: string): Promise<TodoListReadModel | null>;
  findAll(): Promise<TodoListReadModel[]>;
  upsert(list: TodoListReadModel): Promise<void>;
  remove(id: string): Promise<void>;
}
