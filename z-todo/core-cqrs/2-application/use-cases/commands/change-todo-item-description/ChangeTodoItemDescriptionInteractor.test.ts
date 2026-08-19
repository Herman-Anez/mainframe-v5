import test from 'node:test';
import assert from 'node:assert/strict';
import { ChangeTodoItemDescriptionInteractor } from './ChangeTodoItemDescriptionInteractor';
import { ChangeTodoItemDescriptionOutput } from './ChangeTodoItemDescriptionOutput';
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

test('ChangeTodoItemDescriptionInteractor cambia la descripción y publica TodoItemDescriptionChanged', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new ChangeTodoItemDescriptionInteractor(repository, eventBus, unitOfWork);
  const { list, itemId } = await seedListWithItem(repository);

  let publishedEventName: string | undefined;
  eventBus.subscribe('TodoItemDescriptionChanged', (event) => {
    publishedEventName = event.eventName;
  });

  const { presenter, state } = capture<ChangeTodoItemDescriptionOutput>();
  await interactor.execute({ listId: list.id.value, itemId, newDescription: '2 litros' }, presenter);

  assert.equal(state.error, undefined);
  assert.equal(state.success?.success, true);
  assert.equal(publishedEventName, 'TodoItemDescriptionChanged');

  const saved = await repository.findById(list.id);
  assert.equal(saved?.items[0].description, '2 litros');
});

test('ChangeTodoItemDescriptionInteractor reporta TodoListNotFoundException si la lista no existe', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new ChangeTodoItemDescriptionInteractor(repository, eventBus, unitOfWork);

  const { presenter, state } = capture<ChangeTodoItemDescriptionOutput>();
  await interactor.execute({ listId: 'no-existe', itemId: 'no-existe', newDescription: 'x' }, presenter);

  assert.equal(state.success, undefined);
  assert.equal(state.error?.constructor.name, 'TodoListNotFoundException');
});

test('ChangeTodoItemDescriptionInteractor reporta TodoItemNotFoundException si el item no existe', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new ChangeTodoItemDescriptionInteractor(repository, eventBus, unitOfWork);
  const { list } = await seedListWithItem(repository);

  const { presenter, state } = capture<ChangeTodoItemDescriptionOutput>();
  await interactor.execute({ listId: list.id.value, itemId: 'no-existe', newDescription: 'x' }, presenter);

  assert.equal(state.success, undefined);
  assert.equal(state.error?.constructor.name, 'TodoItemNotFoundException');
});
