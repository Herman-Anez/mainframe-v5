import test from 'node:test';
import assert from 'node:assert/strict';
import { CompleteTodoItemInteractor } from './CompleteTodoItemInteractor';
import { CompleteTodoItemOutput } from './CompleteTodoItemOutput';
import { TodoList } from '../../../../1-domain/entities/TodoList';
import { InMemoryTodoListRepository } from '../../../../3-infrastructure/persistence/InMemoryTodoListRepository';
import { InMemoryEventBus } from '../../../../3-infrastructure/messaging/InMemoryEventBus';
import { InMemoryUnitOfWork } from '../../../../3-infrastructure/unit-of-work/InMemoryUnitOfWork';
import { capture } from '../../../shared/testing/capturePresenter';

async function seedListWithItem(repository: InMemoryTodoListRepository) {
  const list = TodoList.create('Compras');
  const item = list.addItem('Comprar leche');
  list.clearEvents();
  await repository.save(list);
  return { list, itemId: item.id.value };
}

test('CompleteTodoItemInteractor marca el item completo y publica TodoItemCompleted', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new CompleteTodoItemInteractor(repository, eventBus, unitOfWork);
  const { list, itemId } = await seedListWithItem(repository);

  let publishedEventName: string | undefined;
  eventBus.subscribe('TodoItemCompleted', (event) => {
    publishedEventName = event.eventName;
  });

  const { presenter, state } = capture<CompleteTodoItemOutput>();
  await interactor.execute({ listId: list.id.value, itemId }, presenter);

  assert.equal(state.error, undefined);
  assert.equal(state.success?.success, true);
  assert.equal(publishedEventName, 'TodoItemCompleted');

  const saved = await repository.findById(list.id);
  assert.equal(saved?.items[0].status, 'COMPLETED');
});

test('CompleteTodoItemInteractor reporta TodoItemNotFoundException si el item no existe', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new CompleteTodoItemInteractor(repository, eventBus, unitOfWork);
  const { list } = await seedListWithItem(repository);

  const { presenter, state } = capture<CompleteTodoItemOutput>();
  await interactor.execute({ listId: list.id.value, itemId: 'no-existe' }, presenter);

  assert.equal(state.success, undefined);
  assert.equal(state.error?.constructor.name, 'TodoItemNotFoundException');
});

test('CompleteTodoItemInteractor reporta error al completar dos veces el mismo item', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new CompleteTodoItemInteractor(repository, eventBus, unitOfWork);
  const { list, itemId } = await seedListWithItem(repository);

  await interactor.execute({ listId: list.id.value, itemId }, capture<CompleteTodoItemOutput>().presenter);

  const { presenter, state } = capture<CompleteTodoItemOutput>();
  await interactor.execute({ listId: list.id.value, itemId }, presenter);

  assert.equal(state.success, undefined);
  assert.match(state.error?.message ?? '', /already completed/);
});
