import test from 'node:test';
import assert from 'node:assert/strict';
import { DeleteTodoListInteractor } from './DeleteTodoListInteractor';
import { DeleteTodoListOutput } from './DeleteTodoListOutput';
import { TodoList } from '../../../../1-domain/entities/TodoList';
import { InMemoryTodoListRepository } from '../../../../3-infrastructure/persistence/InMemoryTodoListRepository';
import { InMemoryEventBus } from '../../../../3-infrastructure/messaging/InMemoryEventBus';
import { InMemoryUnitOfWork } from '../../../../3-infrastructure/unit-of-work/InMemoryUnitOfWork';
import { capture } from '../../../shared/testing/capturePresenter';

test('DeleteTodoListInteractor borra la lista y publica TodoListDeleted', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new DeleteTodoListInteractor(repository, eventBus, unitOfWork);

  const list = TodoList.create('Compras');
  list.clearEvents();
  await repository.save(list);

  let publishedEventName: string | undefined;
  eventBus.subscribe('TodoListDeleted', (event) => {
    publishedEventName = event.eventName;
  });

  const { presenter, state } = capture<DeleteTodoListOutput>();
  await interactor.execute({ listId: list.id.value }, presenter);

  assert.equal(state.error, undefined);
  assert.equal(state.success?.success, true);
  assert.equal(publishedEventName, 'TodoListDeleted');
  assert.equal(await repository.findById(list.id), null);
});

test('DeleteTodoListInteractor reporta TodoListNotFoundException si la lista no existe', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new DeleteTodoListInteractor(repository, eventBus, unitOfWork);

  const { presenter, state } = capture<DeleteTodoListOutput>();
  await interactor.execute({ listId: 'no-existe' }, presenter);

  assert.equal(state.success, undefined);
  assert.equal(state.error?.constructor.name, 'TodoListNotFoundException');
});
