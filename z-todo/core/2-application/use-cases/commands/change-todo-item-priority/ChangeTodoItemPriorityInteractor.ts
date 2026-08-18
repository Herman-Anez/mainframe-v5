import { ChangeTodoItemPriorityUseCase } from './ChangeTodoItemPriorityUseCase';
import { ChangeTodoItemPriorityInput } from './ChangeTodoItemPriorityInput';
import { ChangeTodoItemPriorityOutputBoundary } from './ChangeTodoItemPriorityOutputBoundary';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { EventBusPort } from '../../../ports/out/EventBusPort';
import { TodoListId } from '../../../../1-domain/value-objects/TodoListId';
import { TodoListNotFoundException } from '../../../../1-domain/exceptions/TodoListNotFoundException';

export class ChangeTodoItemPriorityInteractor implements ChangeTodoItemPriorityUseCase {
  constructor(
    private readonly repository: TodoListRepositoryPort,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: ChangeTodoItemPriorityInput, output: ChangeTodoItemPriorityOutputBoundary): Promise<void> {
    try {
      const list = await this.repository.findById(TodoListId.from(input.listId));
      if (!list) {
        throw new TodoListNotFoundException(input.listId);
      }
      list.changeItemPriority(input.itemId, input.newPriority);
      await this.repository.save(list);
      this.eventBus.publish(list.domainEvents);
      list.clearEvents();

      output.presentSuccess({ success: true });
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}
