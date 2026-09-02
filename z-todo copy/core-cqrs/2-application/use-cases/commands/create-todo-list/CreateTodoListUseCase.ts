import { CreateTodoListInput } from './CreateTodoListInput';
import { CreateTodoListOutputBoundary } from './CreateTodoListOutputBoundary';

export interface CreateTodoListUseCase {
  execute(input: CreateTodoListInput, output: CreateTodoListOutputBoundary): Promise<void>;
}