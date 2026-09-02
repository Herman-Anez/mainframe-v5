import { ListTodoListsUseCase } from './ListTodoListsUseCase';
import { ListTodoListsInput } from './ListTodoListsInput';
import { ListTodoListsOutput } from './ListTodoListsOutput';
import { OutputBoundary } from '../../../shared/OutputBoundary';
import { toTodoItemView } from '../../../shared/TodoItemView';
import { TodoListMapper } from '../../../shared/TodoListMapper';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { GetTodoListOutput } from '../get-todo-list/GetTodoListOutput';
import { TodoListDomainService } from '../../../../1-domain/services/TodoListDomainService';

export class ListTodoListsInteractor implements ListTodoListsUseCase {
  constructor(private readonly repository: TodoListRepositoryPort) {}

  async execute(_input: ListTodoListsInput, output: OutputBoundary<ListTodoListsOutput>): Promise<void> {
    try {
      const records = await this.repository.findAll();
      const result: GetTodoListOutput[] = records.map((record) => {
        const list = TodoListMapper.toDomain(record);
        return {
          id: list.id.value,
          name: list.name,
          completionPercentage: TodoListDomainService.calculateCompletionPercentage(list.items),
          isFullyCompleted: TodoListDomainService.isFullyCompleted(list.items),
          items: list.items.map(toTodoItemView),
        };
      });

      output.presentSuccess({ lists: result });
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}
