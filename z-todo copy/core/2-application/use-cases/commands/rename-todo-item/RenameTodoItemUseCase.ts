import { UseCase } from '../../../shared/UseCase';
import { RenameTodoItemInput } from './RenameTodoItemInput';
import { RenameTodoItemOutput } from './RenameTodoItemOutput';

export interface RenameTodoItemUseCase extends UseCase<RenameTodoItemInput, RenameTodoItemOutput> {}
