import { CompleteTodoItemOutput } from './CompleteTodoItemOutput';

export interface CompleteTodoItemOutputBoundary {
  presentSuccess(output: CompleteTodoItemOutput): void;
  presentError(error: Error): void;
}