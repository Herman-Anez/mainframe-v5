import { DeleteTodoListOutput } from './DeleteTodoListOutput';

export interface DeleteTodoListOutputBoundary {
  presentSuccess(output: DeleteTodoListOutput): void;
  presentError(error: Error): void;
}
