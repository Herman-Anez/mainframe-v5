import { DeleteTodoListInput } from './DeleteTodoListInput';
import { DeleteTodoListOutputBoundary } from './DeleteTodoListOutputBoundary';

export interface DeleteTodoListUseCase {
  execute(input: DeleteTodoListInput, output: DeleteTodoListOutputBoundary): Promise<void>;
}
