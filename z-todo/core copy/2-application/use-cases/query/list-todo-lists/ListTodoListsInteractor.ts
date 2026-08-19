import { ListTodoListsUseCase } from './ListTodoListsUseCase';
import { ListTodoListsInput } from './ListTodoListsInput';
import { ListTodoListsOutputBoundary } from './ListTodoListsOutputBoundary';
import { TodoListReadModelPort } from '../../../ports/out/TodoListReadModelPort';
import { GetTodoListOutput } from '../get-todo-list/GetTodoListOutput';

export class ListTodoListsInteractor implements ListTodoListsUseCase {
  constructor(
    private readonly readModel: Pick<TodoListReadModelPort, 'findAll'>,
  ) {}

  async execute(_input: ListTodoListsInput, output: ListTodoListsOutputBoundary): Promise<void> {
    try {
      const lists = await this.readModel.findAll();
      const result: GetTodoListOutput[] = lists.map(list => ({
        id: list.id,
        name: list.name,
        completionPercentage: list.completionPercentage,
        isFullyCompleted: list.isFullyCompleted,
        items: list.items.map(item => ({ ...item })),
      }));

      output.presentSuccess({ lists: result });
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}
