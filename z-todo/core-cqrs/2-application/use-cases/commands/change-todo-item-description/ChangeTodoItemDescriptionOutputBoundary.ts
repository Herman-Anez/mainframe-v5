import { ChangeTodoItemDescriptionOutput } from './ChangeTodoItemDescriptionOutput';

export interface ChangeTodoItemDescriptionOutputBoundary {
  presentSuccess(output: ChangeTodoItemDescriptionOutput): void;
  presentError(error: Error): void;
}
