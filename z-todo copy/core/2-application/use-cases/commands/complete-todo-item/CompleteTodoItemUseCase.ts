import { UseCase } from '../../../shared/UseCase';
import { CompleteTodoItemInput } from './CompleteTodoItemInput';
import { CompleteTodoItemOutput } from './CompleteTodoItemOutput';

export interface CompleteTodoItemUseCase extends UseCase<CompleteTodoItemInput, CompleteTodoItemOutput> {}
