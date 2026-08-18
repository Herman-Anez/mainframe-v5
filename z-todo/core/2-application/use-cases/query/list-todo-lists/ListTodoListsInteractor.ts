import { ListTodoListsUseCase } from './ListTodoListsUseCase';
import { ListTodoListsInput } from './ListTodoListsInput';
import { ListTodoListsOutputBoundary } from './ListTodoListsOutputBoundary';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { GetTodoListOutput } from '../get-todo-list/GetTodoListOutput';
import { TodoListDomainService } from '../../../../1-domain/services/TodoListDomainService';

export class ListTodoListsInteractor implements ListTodoListsUseCase {
  constructor(private readonly repository: TodoListRepositoryPort) {}

  async execute(_input: ListTodoListsInput, output: ListTodoListsOutputBoundary): Promise<void> {
    try {
      const lists = await this.repository.findAll();
      const result: GetTodoListOutput[] = lists.map(list => ({
        id: list.id.value,
        name: list.name,
        completionPercentage: TodoListDomainService.calculateCompletionPercentage(list),
        isFullyCompleted: TodoListDomainService.isFullyCompleted(list),
        items: list.items.map(item => ({
          id: item.id.value,
          title: item.title,
          description: item.description,
          status: item.status,
          priority: item.priority,
        })),
      }));

      output.presentSuccess({ lists: result });
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}
