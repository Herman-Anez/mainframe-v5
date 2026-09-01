import { ChangeTodoItemPriorityUseCase } from './ChangeTodoItemPriorityUseCase';
import { ChangeTodoItemPriorityInput } from './ChangeTodoItemPriorityInput';
import { ChangeTodoItemPriorityOutput } from './ChangeTodoItemPriorityOutput';
import { OutputBoundary } from '../../../shared/OutputBoundary';
import { toTodoItemView } from '../../../shared/TodoItemView';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { EventBusPort } from '../../../ports/out/EventBusPort';
import { UnitOfWorkPort } from '../../../ports/out/UnitOfWorkPort';
import { TodoListId } from '../../../../1-domain/value-objects/TodoListId';
import { TodoListNotFoundException } from '../../../../1-domain/exceptions/TodoListNotFoundException';
import { persistAndPublish } from '../../../shared/persistAndPublish';

export class ChangeTodoItemPriorityInteractor implements ChangeTodoItemPriorityUseCase {
  constructor(
    private readonly repository: TodoListRepositoryPort,
    private readonly eventBus: EventBusPort,
    private readonly unitOfWork: UnitOfWorkPort,
  ) {}

  async execute(input: ChangeTodoItemPriorityInput, output: OutputBoundary<ChangeTodoItemPriorityOutput>): Promise<void> {
    try {
      const list = await this.repository.findById(TodoListId.from(input.listId));
      if (!list) {
        throw new TodoListNotFoundException(input.listId);
      }
      const item = list.changeItemPriority(input.itemId, input.newPriority);
      await persistAndPublish(list, this.repository, this.eventBus, this.unitOfWork);

      output.presentSuccess({ item: toTodoItemView(item) });
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}
