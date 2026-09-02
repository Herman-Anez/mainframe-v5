import { AddTodoItemOutput } from './AddTodoItemOutput';

export interface AddTodoItemOutputBoundary {
  presentSuccess(output: AddTodoItemOutput): void;
  presentError(error: Error): void;
}