import { GetTodoListInput } from './GetTodoListInput';
import { GetTodoListOutputBoundary } from './GetTodoListOutputBoundary';

export interface GetTodoListUseCase {
  execute(input: GetTodoListInput, output: GetTodoListOutputBoundary): Promise<void>;
}