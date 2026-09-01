import test from 'node:test';
import assert from 'node:assert/strict';
import { GetTodoListInteractor } from './GetTodoListInteractor';
import { GetTodoListOutput } from './GetTodoListOutput';
import { TodoList } from '../../../../1-domain/entities/TodoList';
import { InMemoryTodoListRepository } from '../../../../4-infrastructure/persistence/InMemoryTodoListRepository';
import { capture } from '../../../shared/testing/capturePresenter';

test('GetTodoListInteractor devuelve la lista con completionPercentage e isFullyCompleted', async () => {
  const repository = new InMemoryTodoListRepository();
  const list = TodoList.create('Compras');
  const first = list.addItem('Comprar leche');
  list.addItem('Comprar pan');
  list.completeItem(first.id.value);
  list.clearEvents();
  await repository.save(list);

  const interactor = new GetTodoListInteractor(repository);
  const { presenter, state } = capture<GetTodoListOutput>();
  await interactor.execute({ listId: list.id.value }, presenter);

  assert.equal(state.error, undefined);
  assert.equal(state.success?.items.length, 2);
  assert.equal(state.success?.completionPercentage, 50);
  assert.equal(state.success?.isFullyCompleted, false);
});

test('GetTodoListInteractor reporta TodoListNotFoundException si la lista no existe', async () => {
  const repository = new InMemoryTodoListRepository();
  const interactor = new GetTodoListInteractor(repository);

  const { presenter, state } = capture<GetTodoListOutput>();
  await interactor.execute({ listId: 'no-existe' }, presenter);

  assert.equal(state.success, undefined);
  assert.equal(state.error?.constructor.name, 'TodoListNotFoundException');
});
