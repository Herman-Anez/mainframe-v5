import { ChangeTodoItemDescriptionUseCase } from './ChangeTodoItemDescriptionUseCase';
import { ChangeTodoItemDescriptionInput } from './ChangeTodoItemDescriptionInput';
import { ChangeTodoItemDescriptionOutput } from './ChangeTodoItemDescriptionOutput';
import { OutputBoundary } from '../../../shared/OutputBoundary';
import { toTodoItemView } from '../../../shared/TodoItemView';
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

  async execute(input: ChangeTodoItemDescriptionInput, output: OutputBoundary<ChangeTodoItemDescriptionOutput>): Promise<void> {
    try {
      const list = await this.repository.findById(TodoListId.from(input.listId));
      if (!list) {
        throw new TodoListNotFoundException(input.listId);
      }
      const item = list.changeItemDescription(input.itemId, input.newDescription);
      await persistAndPublish(list, this.repository, this.eventBus, this.unitOfWork);

      output.presentSuccess({ item: toTodoItemView(item) });
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}
