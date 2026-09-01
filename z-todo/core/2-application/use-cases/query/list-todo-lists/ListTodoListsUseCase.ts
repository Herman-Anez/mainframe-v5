import { UseCase } from '../../../shared/UseCase';
import { ListTodoListsInput } from './ListTodoListsInput';
import { ListTodoListsOutput } from './ListTodoListsOutput';

export interface ListTodoListsUseCase extends UseCase<ListTodoListsInput, ListTodoListsOutput> {}
