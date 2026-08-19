import { ListTodoListsInput } from './ListTodoListsInput';
import { ListTodoListsOutputBoundary } from './ListTodoListsOutputBoundary';

export interface ListTodoListsUseCase {
  execute(input: ListTodoListsInput, output: ListTodoListsOutputBoundary): Promise<void>;
}
