import { ChangeTodoItemDescriptionInput } from './ChangeTodoItemDescriptionInput';
import { ChangeTodoItemDescriptionOutputBoundary } from './ChangeTodoItemDescriptionOutputBoundary';

export interface ChangeTodoItemDescriptionUseCase {
  execute(input: ChangeTodoItemDescriptionInput, output: ChangeTodoItemDescriptionOutputBoundary): Promise<void>;
}
