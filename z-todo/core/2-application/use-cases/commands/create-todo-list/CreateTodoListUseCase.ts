import { UseCase } from '../../../shared/UseCase';
import { CreateTodoListInput } from './CreateTodoListInput';
import { CreateTodoListOutput } from './CreateTodoListOutput';

export interface CreateTodoListUseCase extends UseCase<CreateTodoListInput, CreateTodoListOutput> {}
