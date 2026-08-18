import { DeleteTodoListUseCase } from './DeleteTodoListUseCase';
import { DeleteTodoListInput } from './DeleteTodoListInput';
import { DeleteTodoListOutputBoundary } from './DeleteTodoListOutputBoundary';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { TodoListId } from '../../../../1-domain/value-objects/TodoListId';
import { TodoListNotFoundException } from '../../../../1-domain/exceptions/TodoListNotFoundException';

export class DeleteTodoListInteractor implements DeleteTodoListUseCase {
  constructor(private readonly repository: TodoListRepositoryPort) {}

  async execute(input: DeleteTodoListInput, output: DeleteTodoListOutputBoundary): Promise<void> {
    try {
      const id = TodoListId.from(input.listId);
      const list = await this.repository.findById(id);
      if (!list) {
        throw new TodoListNotFoundException(input.listId);
      }
      await this.repository.delete(id);

      output.presentSuccess({ success: true });
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}
