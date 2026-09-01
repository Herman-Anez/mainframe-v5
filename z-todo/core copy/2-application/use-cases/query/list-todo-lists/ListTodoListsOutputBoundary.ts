import { ListTodoListsOutput } from './ListTodoListsOutput';

export interface ListTodoListsOutputBoundary {
  presentSuccess(output: ListTodoListsOutput): void;
  presentError(error: Error): void;
}
