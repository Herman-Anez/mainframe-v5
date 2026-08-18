import { CreateTodoListUseCase } from './CreateTodoListUseCase';
import { CreateTodoListInput } from './CreateTodoListInput';
import { CreateTodoListOutputBoundary } from './CreateTodoListOutputBoundary';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { EventBusPort } from '../../../ports/out/EventBusPort';
import { TodoList } from '../../../../1-domain/entities/TodoList';

export class CreateTodoListInteractor implements CreateTodoListUseCase {
  constructor(
    private readonly repository: TodoListRepositoryPort,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: CreateTodoListInput, output: CreateTodoListOutputBoundary): Promise<void> {
    try {
      const list = TodoList.create(input.name);
      await this.repository.save(list);
      this.eventBus.publish(list.domainEvents);
      list.clearEvents();

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