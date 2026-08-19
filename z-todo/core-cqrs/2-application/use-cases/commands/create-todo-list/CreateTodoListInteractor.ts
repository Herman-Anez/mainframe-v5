import { CreateTodoListUseCase } from './CreateTodoListUseCase';
import { CreateTodoListInput } from './CreateTodoListInput';
import { CreateTodoListOutputBoundary } from './CreateTodoListOutputBoundary';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { EventBusPort } from '../../../ports/out/EventBusPort';
import { UnitOfWorkPort } from '../../../ports/out/UnitOfWorkPort';
import { TodoList } from '../../../../1-domain/entities/TodoList';
import { persistAndPublish } from '../../../shared/persistAndPublish';

export class CreateTodoListInteractor implements CreateTodoListUseCase {
  constructor(
    private readonly repository: TodoListRepositoryPort,
    private readonly eventBus: EventBusPort,
    private readonly unitOfWork: UnitOfWorkPort,
  ) {}

  async execute(input: CreateTodoListInput, output: CreateTodoListOutputBoundary): Promise<void> {
    try {
      const list = TodoList.create(input.name);
      await persistAndPublish(list, this.repository, this.eventBus, this.unitOfWork);

      const response = {
        id: list.id.value,
        name: list.name,
      };
      output.presentSuccess(response);
    } catch (error) {
      output.presentError(error as Error);
    }
  }
}