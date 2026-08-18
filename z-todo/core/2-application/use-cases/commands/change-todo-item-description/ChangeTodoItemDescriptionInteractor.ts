import { ChangeTodoItemDescriptionUseCase } from './ChangeTodoItemDescriptionUseCase';
import { ChangeTodoItemDescriptionInput } from './ChangeTodoItemDescriptionInput';
import { ChangeTodoItemDescriptionOutputBoundary } from './ChangeTodoItemDescriptionOutputBoundary';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { EventBusPort } from '../../../ports/out/EventBusPort';
import { TodoListId } from '../../../../1-domain/value-objects/TodoListId';
import { TodoListNotFoundException } from '../../../../1-domain/exceptions/TodoListNotFoundException';

export class ChangeTodoItemDescriptionInteractor implements ChangeTodoItemDescriptionUseCase {
  constructor(
    private readonly repository: TodoListRepositoryPort,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: ChangeTodoItemDescriptionInput, output: ChangeTodoItemDescriptionOutputBoundary): Promise<void> {
    try {
      const list = await this.repository.findById(TodoListId.from(input.listId));
      if (!list) {
        throw new TodoListNotFoundException(input.listId);
      }
      list.changeItemDescription(input.itemId, input.newDescription);
      await this.repository.save(list);
      this.eventBus.publish(list.domainEvents);
      list.clearEvents();

      output.presentSuccess({ success: true });
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}
