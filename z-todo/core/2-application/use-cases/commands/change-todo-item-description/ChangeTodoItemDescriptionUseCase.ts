import { UseCase } from '../../../shared/UseCase';
import { ChangeTodoItemDescriptionInput } from './ChangeTodoItemDescriptionInput';
import { ChangeTodoItemDescriptionOutput } from './ChangeTodoItemDescriptionOutput';

export interface ChangeTodoItemDescriptionUseCase
  extends UseCase<ChangeTodoItemDescriptionInput, ChangeTodoItemDescriptionOutput> {}
