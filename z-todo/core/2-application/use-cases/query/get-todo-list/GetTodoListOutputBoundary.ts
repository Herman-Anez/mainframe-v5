import { GetTodoListOutput } from './GetTodoListOutput';

export interface GetTodoListOutputBoundary {
  presentSuccess(output: GetTodoListOutput): void;
  presentError(error: Error): void;
}