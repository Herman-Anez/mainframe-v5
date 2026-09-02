import test from 'node:test';
import assert from 'node:assert/strict';
import { RenameTodoItemInteractor } from './RenameTodoItemInteractor';
import { RenameTodoItemOutput } from './RenameTodoItemOutput';
import { TodoList } from '../../../../1-domain/entities/TodoList';
import { InMemoryTodoListRepository } from '../../../../4-infrastructure/persistence/InMemoryTodoListRepository';
import { InMemoryEventBus } from '../../../../4-infrastructure/messaging/InMemoryEventBus';
import { InMemoryUnitOfWork } from '../../../../4-infrastructure/unit-of-work/InMemoryUnitOfWork';
import { capture } from '../../../shared/testing/capturePresenter';
import { TodoListMapper } from '../../../shared/TodoListMapper';

async function seedListWithItem(repository: InMemoryTodoListRepository) {
  const list = TodoList.create('Compras');
  const item = list.addItem('Comprar leche');
  await repository.save(TodoListMapper.toRecord(list));
  return { list, itemId: item.id.value };
}

test('RenameTodoItemInteractor renombra el item y publica TodoItemRenamed', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new RenameTodoItemInteractor(repository, eventBus, unitOfWork);
  const { list, itemId } = await seedListWithItem(repository);

  let publishedEventName: string | undefined;
  eventBus.subscribe('TodoItemRenamed', (event) => {
    publishedEventName = event.eventName;
  });

  const { presenter, state } = capture<RenameTodoItemOutput>();
  await interactor.execute({ listId: list.id.value, itemId, newTitle: 'Comprar leche deslactosada' }, presenter);

  assert.equal(state.error, undefined);
  assert.equal(state.success?.item.title, 'Comprar leche deslactosada');
  assert.equal(publishedEventName, 'TodoItemRenamed');

  const saved = await repository.findById(list.id.value);
  assert.equal(saved?.items[0].title, 'Comprar leche deslactosada');
});

test('RenameTodoItemInteractor reporta TodoListNotFoundException si la lista no existe', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new RenameTodoItemInteractor(repository, eventBus, unitOfWork);

  const { presenter, state } = capture<RenameTodoItemOutput>();
  await interactor.execute({ listId: 'no-existe', itemId: 'no-existe', newTitle: 'Nuevo título' }, presenter);

  assert.equal(state.success, undefined);
  assert.equal(state.error?.constructor.name, 'TodoListNotFoundException');
});

test('RenameTodoItemInteractor reporta TodoItemNotFoundException si el item no existe', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new RenameTodoItemInteractor(repository, eventBus, unitOfWork);
  const { list } = await seedListWithItem(repository);

  const { presenter, state } = capture<RenameTodoItemOutput>();
  await interactor.execute({ listId: list.id.value, itemId: 'no-existe', newTitle: 'Nuevo título' }, presenter);

  assert.equal(state.success, undefined);
  assert.equal(state.error?.constructor.name, 'TodoItemNotFoundException');
});
