import { ChangeTodoItemDescriptionUseCase } from './ChangeTodoItemDescriptionUseCase';
import { ChangeTodoItemDescriptionInput } from './ChangeTodoItemDescriptionInput';
import { ChangeTodoItemDescriptionOutputBoundary } from './ChangeTodoItemDescriptionOutputBoundary';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { EventBusPort } from '../../../ports/out/EventBusPort';
import { UnitOfWorkPort } from '../../../ports/out/UnitOfWorkPort';
import { TodoListId } from '../../../../1-domain/value-objects/TodoListId';
import { TodoListNotFoundException } from '../../../../1-domain/exceptions/TodoListNotFoundException';
import { persistAndPublish } from '../../../shared/persistAndPublish';

export class ChangeTodoItemDescriptionInteractor implements ChangeTodoItemDescriptionUseCase {
  constructor(
    private readonly repository: TodoListRepositoryPort,
    private readonly eventBus: EventBusPort,
    private readonly unitOfWork: UnitOfWorkPort,
  ) {}

  async execute(input: ChangeTodoItemDescriptionInput, output: ChangeTodoItemDescriptionOutputBoundary): Promise<void> {
    try {
      const list = await this.repository.findById(TodoListId.from(input.listId));
      if (!list) {
        throw new TodoListNotFoundException(input.listId);
      }
      list.changeItemDescription(input.itemId, input.newDescription);
      await persistAndPublish(list, this.repository, this.eventBus, this.unitOfWork);

      output.presentSuccess({ success: true });
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}
