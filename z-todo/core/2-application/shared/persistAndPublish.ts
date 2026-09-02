import { TodoList } from '../../1-domain/entities/TodoList';
import { TodoListRepositoryPort } from '../ports/out/TodoListRepositoryPort';
import { EventBusPort } from '../ports/out/EventBusPort';
import { UnitOfWorkPort } from '../ports/out/UnitOfWorkPort';
import { TodoListMapper } from './TodoListMapper';

export async function persistAndPublish(
  list: TodoList,
  repository: TodoListRepositoryPort,
  eventBus: EventBusPort,
  unitOfWork: UnitOfWorkPort,
): Promise<void> {
  await unitOfWork.begin();
  try {
    await repository.save(TodoListMapper.toRecord(list));
    await unitOfWork.commit();
  } catch (error) {
    await unitOfWork.rollback();
    throw error;
  }
  await eventBus.publish(list.domainEvents);
  list.clearEvents();
}
