import { RenameTodoItemOutput } from './RenameTodoItemOutput';

export interface RenameTodoItemOutputBoundary {
  presentSuccess(output: RenameTodoItemOutput): void;
  presentError(error: Error): void;
}
