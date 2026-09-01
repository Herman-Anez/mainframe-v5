import { RenameTodoItemInput } from './RenameTodoItemInput';
import { RenameTodoItemOutputBoundary } from './RenameTodoItemOutputBoundary';

export interface RenameTodoItemUseCase {
  execute(input: RenameTodoItemInput, output: RenameTodoItemOutputBoundary): Promise<void>;
}
