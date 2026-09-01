import { AddTodoItemUseCase } from './AddTodoItemUseCase';
import { AddTodoItemInput } from './AddTodoItemInput';
import { AddTodoItemOutput } from './AddTodoItemOutput';
import { OutputBoundary } from '../../../shared/OutputBoundary';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { EventBusPort } from '../../../ports/out/EventBusPort';
import { UnitOfWorkPort } from '../../../ports/out/UnitOfWorkPort';
import { TodoListId } from '../../../../1-domain/value-objects/TodoListId';
import { TodoListNotFoundException } from '../../../../1-domain/exceptions/TodoListNotFoundException';
import { persistAndPublish } from '../../../shared/persistAndPublish';

export class AddTodoItemInteractor implements AddTodoItemUseCase {
  constructor(
    private readonly repository: TodoListRepositoryPort,
    private readonly eventBus: EventBusPort,
    private readonly unitOfWork: UnitOfWorkPort,
  ) {}

  async execute(input: AddTodoItemInput, output: OutputBoundary<AddTodoItemOutput>): Promise<void> {
    try {
      const list = await this.repository.findById(TodoListId.from(input.listId));
      if (!list) {
        throw new TodoListNotFoundException(input.listId);
      }
      const item = list.addItem(input.title, input.description, input.priority);
      await persistAndPublish(list, this.repository, this.eventBus, this.unitOfWork);

      output.presentSuccess({ itemId: item.id.value });
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}
