import { UseCase } from '../../../shared/UseCase';
import { AddTodoItemInput } from './AddTodoItemInput';
import { AddTodoItemOutput } from './AddTodoItemOutput';

export interface AddTodoItemUseCase extends UseCase<AddTodoItemInput, AddTodoItemOutput> {}
