import { ChangeTodoItemPriorityOutput } from './ChangeTodoItemPriorityOutput';

export interface ChangeTodoItemPriorityOutputBoundary {
  presentSuccess(output: ChangeTodoItemPriorityOutput): void;
  presentError(error: Error): void;
}
