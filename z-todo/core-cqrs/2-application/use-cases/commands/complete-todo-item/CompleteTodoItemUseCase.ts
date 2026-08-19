import { CompleteTodoItemInput } from './CompleteTodoItemInput';
import { CompleteTodoItemOutputBoundary } from './CompleteTodoItemOutputBoundary';

export interface CompleteTodoItemUseCase {
  execute(input: CompleteTodoItemInput, output: CompleteTodoItemOutputBoundary): Promise<void>;
}