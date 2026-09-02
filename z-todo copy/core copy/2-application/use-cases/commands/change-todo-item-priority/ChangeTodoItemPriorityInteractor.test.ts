import test from 'node:test';
import assert from 'node:assert/strict';
import { ChangeTodoItemPriorityInteractor } from './ChangeTodoItemPriorityInteractor';
import { ChangeTodoItemPriorityOutput } from './ChangeTodoItemPriorityOutput';
import { TodoList } from '../../../../1-domain/entities/TodoList';
import { InMemoryTodoListRepository } from '../../../../4-infrastructure/persistence/InMemoryTodoListRepository';
import { InMemoryEventBus } from '../../../../4-infrastructure/messaging/InMemoryEventBus';
import { InMemoryUnitOfWork } from '../../../../4-infrastructure/unit-of-work/InMemoryUnitOfWork';
import { capture } from '../../../shared/testing/capturePresenter';

async function seedListWithItem(repository: InMemoryTodoListRepository) {
  const list = TodoList.create('Compras');
  const item = list.addItem('Comprar leche', '', 'LOW');
  list.clearEvents();
  await repository.save(list);
  return { list, itemId: item.id.value };
}

test('ChangeTodoItemPriorityInteractor cambia la prioridad y publica TodoItemPriorityChanged', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new ChangeTodoItemPriorityInteractor(repository, eventBus, unitOfWork);
  const { list, itemId } = await seedListWithItem(repository);

  let publishedEventName: string | undefined;
  eventBus.subscribe('TodoItemPriorityChanged', (event) => {
    publishedEventName = event.eventName;
  });

  const { presenter, state } = capture<ChangeTodoItemPriorityOutput>();
  await interactor.execute({ listId: list.id.value, itemId, newPriority: 'HIGH' }, presenter);

  assert.equal(state.error, undefined);
  assert.equal(state.success?.success, true);
  assert.equal(publishedEventName, 'TodoItemPriorityChanged');

  const saved = await repository.findById(list.id);
  assert.equal(saved?.items[0].priority, 'HIGH');
});

test('ChangeTodoItemPriorityInteractor reporta TodoListNotFoundException si la lista no existe', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new ChangeTodoItemPriorityInteractor(repository, eventBus, unitOfWork);

  const { presenter, state } = capture<ChangeTodoItemPriorityOutput>();
  await interactor.execute({ listId: 'no-existe', itemId: 'no-existe', newPriority: 'HIGH' }, presenter);

  assert.equal(state.success, undefined);
  assert.equal(state.error?.constructor.name, 'TodoListNotFoundException');
});

test('ChangeTodoItemPriorityInteractor reporta TodoItemNotFoundException si el item no existe', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new ChangeTodoItemPriorityInteractor(repository, eventBus, unitOfWork);
  const { list } = await seedListWithItem(repository);

  const { presenter, state } = capture<ChangeTodoItemPriorityOutput>();
  await interactor.execute({ listId: list.id.value, itemId: 'no-existe', newPriority: 'HIGH' }, presenter);

  assert.equal(state.success, undefined);
  assert.equal(state.error?.constructor.name, 'TodoItemNotFoundException');
});

test('ChangeTodoItemPriorityInteractor reporta error si la prioridad es inválida', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new ChangeTodoItemPriorityInteractor(repository, eventBus, unitOfWork);
  const { list, itemId } = await seedListWithItem(repository);

  const { presenter, state } = capture<ChangeTodoItemPriorityOutput>();
  await interactor.execute({ listId: list.id.value, itemId, newPriority: 'URGENTE' }, presenter);

  assert.equal(state.success, undefined);
  assert.match(state.error?.message ?? '', /Invalid priority/);
});
