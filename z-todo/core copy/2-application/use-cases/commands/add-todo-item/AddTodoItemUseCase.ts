import { AddTodoItemInput } from './AddTodoItemInput';
import { AddTodoItemOutputBoundary } from './AddTodoItemOutputBoundary';

export interface AddTodoItemUseCase {
  execute(input: AddTodoItemInput, output: AddTodoItemOutputBoundary): Promise<void>;
}