import { DeleteTodoListUseCase } from './DeleteTodoListUseCase';
import { DeleteTodoListInput } from './DeleteTodoListInput';
import { DeleteTodoListOutputBoundary } from './DeleteTodoListOutputBoundary';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { EventBusPort } from '../../../ports/out/EventBusPort';
import { UnitOfWorkPort } from '../../../ports/out/UnitOfWorkPort';
import { TodoListId } from '../../../../1-domain/value-objects/TodoListId';
import { TodoListNotFoundException } from '../../../../1-domain/exceptions/TodoListNotFoundException';
import { TodoListDeleted } from '../../../../1-domain/events/TodoListDeleted';

export class DeleteTodoListInteractor implements DeleteTodoListUseCase {
  constructor(
    private readonly repository: TodoListRepositoryPort,
    private readonly eventBus: EventBusPort,
    private readonly unitOfWork: UnitOfWorkPort,
  ) {}

  async execute(input: DeleteTodoListInput, output: DeleteTodoListOutputBoundary): Promise<void> {
    try {
      const id = TodoListId.from(input.listId);
      const list = await this.repository.findById(id);
      if (!list) {
        throw new TodoListNotFoundException(input.listId);
      }
      await this.unitOfWork.begin();
      try {
        await this.repository.delete(id);
        await this.unitOfWork.commit();
      } catch (error) {
        await this.unitOfWork.rollback();
        throw error;
      }
      this.eventBus.publish([new TodoListDeleted(list.id.value, list.name)]);

      output.presentSuccess({ success: true });
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}
