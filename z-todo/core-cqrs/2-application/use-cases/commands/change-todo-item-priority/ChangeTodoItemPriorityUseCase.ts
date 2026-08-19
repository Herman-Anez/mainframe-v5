import { ChangeTodoItemPriorityInput } from './ChangeTodoItemPriorityInput';
import { ChangeTodoItemPriorityOutputBoundary } from './ChangeTodoItemPriorityOutputBoundary';

export interface ChangeTodoItemPriorityUseCase {
  execute(input: ChangeTodoItemPriorityInput, output: ChangeTodoItemPriorityOutputBoundary): Promise<void>;
}
