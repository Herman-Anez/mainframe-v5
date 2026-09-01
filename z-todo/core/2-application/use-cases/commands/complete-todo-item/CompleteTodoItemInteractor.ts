import { CompleteTodoItemUseCase } from './CompleteTodoItemUseCase';
import { CompleteTodoItemInput } from './CompleteTodoItemInput';
import { CompleteTodoItemOutput } from './CompleteTodoItemOutput';
import { OutputBoundary } from '../../../shared/OutputBoundary';
import { toTodoItemView } from '../../../shared/TodoItemView';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { EventBusPort } from '../../../ports/out/EventBusPort';
import { UnitOfWorkPort } from '../../../ports/out/UnitOfWorkPort';
import { TodoListId } from '../../../../1-domain/value-objects/TodoListId';
import { TodoListNotFoundException } from '../../../../1-domain/exceptions/TodoListNotFoundException';
import { persistAndPublish } from '../../../shared/persistAndPublish';

export class CompleteTodoItemInteractor implements CompleteTodoItemUseCase {
  constructor(
    private readonly repository: TodoListRepositoryPort,
    private readonly eventBus: EventBusPort,
    private readonly unitOfWork: UnitOfWorkPort,
  ) {}

  async execute(input: CompleteTodoItemInput, output: OutputBoundary<CompleteTodoItemOutput>): Promise<void> {
    try {
      const list = await this.repository.findById(TodoListId.from(input.listId));
      if (!list) {
        throw new TodoListNotFoundException(input.listId);
      }
      const item = list.completeItem(input.itemId);
      await persistAndPublish(list, this.repository, this.eventBus, this.unitOfWork);

      output.presentSuccess({ item: toTodoItemView(item) });
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}
