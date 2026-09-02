import test from 'node:test';
import assert from 'node:assert/strict';
import { AddTodoItemInteractor } from './AddTodoItemInteractor';
import { AddTodoItemOutput } from './AddTodoItemOutput';
import { TodoList } from '../../../../1-domain/entities/TodoList';
import { InMemoryTodoListRepository } from '../../../../4-infrastructure/persistence/InMemoryTodoListRepository';
import { InMemoryEventBus } from '../../../../4-infrastructure/messaging/InMemoryEventBus';
import { InMemoryUnitOfWork } from '../../../../4-infrastructure/unit-of-work/InMemoryUnitOfWork';
import { capture } from '../../../shared/testing/capturePresenter';
import { TodoListMapper } from '../../../shared/TodoListMapper';

async function seedList(repository: InMemoryTodoListRepository, name = 'Compras') {
  const list = TodoList.create(name);
  await repository.save(TodoListMapper.toRecord(list));
  return list;
}

test('AddTodoItemInteractor agrega el item y publica TodoItemAdded', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new AddTodoItemInteractor(repository, eventBus, unitOfWork);
  const list = await seedList(repository);

  let publishedEventName: string | undefined;
  eventBus.subscribe('TodoItemAdded', (event) => {
    publishedEventName = event.eventName;
  });

  const { presenter, state } = capture<AddTodoItemOutput>();
  await interactor.execute(
    { listId: list.id.value, title: 'Comprar leche', description: '2L', priority: 'HIGH' },
    presenter,
  );

  assert.equal(state.error, undefined);
  assert.equal(publishedEventName, 'TodoItemAdded');

  const saved = await repository.findById(list.id.value);
  assert.equal(saved?.items.length, 1);
  assert.equal(saved?.items[0].title, 'Comprar leche');
  assert.equal(state.success?.itemId, saved?.items[0].id);
});

test('AddTodoItemInteractor reporta TodoListNotFoundException si la lista no existe', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new AddTodoItemInteractor(repository, eventBus, unitOfWork);

  const { presenter, state } = capture<AddTodoItemOutput>();
  await interactor.execute(
    { listId: 'no-existe', title: 'Comprar leche', description: '', priority: 'MEDIUM' },
    presenter,
  );

  assert.equal(state.success, undefined);
  assert.equal(state.error?.constructor.name, 'TodoListNotFoundException');
});
