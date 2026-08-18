import { AddTodoItemUseCase } from './AddTodoItemUseCase';
import { AddTodoItemInput } from './AddTodoItemInput';
import { AddTodoItemOutputBoundary } from './AddTodoItemOutputBoundary';
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

  async execute(input: AddTodoItemInput, output: AddTodoItemOutputBoundary): Promise<void> {
    try {
      const list = await this.repository.findById(TodoListId.from(input.listId));
      if (!list) {
        throw new TodoListNotFoundException(input.listId);
      }
      list.addItem(input.title, input.description, input.priority);
      await persistAndPublish(list, this.repository, this.eventBus, this.unitOfWork);

      output.presentSuccess({ success: true });
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}