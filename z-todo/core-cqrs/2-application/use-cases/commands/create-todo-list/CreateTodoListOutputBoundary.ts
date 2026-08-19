import { CreateTodoListOutput } from './CreateTodoListOutput';

export interface CreateTodoListOutputBoundary {
  presentSuccess(output: CreateTodoListOutput): void;
  presentError(error: Error): void;
}