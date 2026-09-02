import { UseCase } from '../../../shared/UseCase';
import { ChangeTodoItemPriorityInput } from './ChangeTodoItemPriorityInput';
import { ChangeTodoItemPriorityOutput } from './ChangeTodoItemPriorityOutput';

export interface ChangeTodoItemPriorityUseCase
  extends UseCase<ChangeTodoItemPriorityInput, ChangeTodoItemPriorityOutput> {}
