import { UseCase } from '../../../shared/UseCase';
import { GetTodoListInput } from './GetTodoListInput';
import { GetTodoListOutput } from './GetTodoListOutput';

export interface GetTodoListUseCase extends UseCase<GetTodoListInput, GetTodoListOutput> {}
