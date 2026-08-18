import { RenameTodoItemUseCase } from './RenameTodoItemUseCase';
import { RenameTodoItemInput } from './RenameTodoItemInput';
import { RenameTodoItemOutputBoundary } from './RenameTodoItemOutputBoundary';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { EventBusPort } from '../../../ports/out/EventBusPort';
import { TodoListId } from '../../../../1-domain/value-objects/TodoListId';
import { TodoListNotFoundException } from '../../../../1-domain/exceptions/TodoListNotFoundException';

export class RenameTodoItemInteractor implements RenameTodoItemUseCase {
  constructor(
    private readonly repository: TodoListRepositoryPort,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: RenameTodoItemInput, output: RenameTodoItemOutputBoundary): Promise<void> {
    try {
      const list = await this.repository.findById(TodoListId.from(input.listId));
      if (!list) {
        throw new TodoListNotFoundException(input.listId);
      }
      list.renameItem(input.itemId, input.newTitle);
      await this.repository.save(list);
      this.eventBus.publish(list.domainEvents);
      list.clearEvents();

      output.presentSuccess({ success: true });
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}
