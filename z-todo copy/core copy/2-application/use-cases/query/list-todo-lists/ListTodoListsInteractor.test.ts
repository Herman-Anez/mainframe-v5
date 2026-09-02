import test from 'node:test';
import assert from 'node:assert/strict';
import { ListTodoListsInteractor } from './ListTodoListsInteractor';
import { ListTodoListsOutput } from './ListTodoListsOutput';
import { TodoList } from '../../../../1-domain/entities/TodoList';
import { InMemoryTodoListRepository } from '../../../../4-infrastructure/persistence/InMemoryTodoListRepository';
import { capture } from '../../../shared/testing/capturePresenter';

test('ListTodoListsInteractor devuelve un array vacío si no hay listas', async () => {
  const repository = new InMemoryTodoListRepository();
  const interactor = new ListTodoListsInteractor(repository);

  const { presenter, state } = capture<ListTodoListsOutput>();
  await interactor.execute({}, presenter);

  assert.equal(state.error, undefined);
  assert.deepEqual(state.success?.lists, []);
});

test('ListTodoListsInteractor devuelve todas las listas con su completionPercentage', async () => {
  const repository = new InMemoryTodoListRepository();

  const listA = TodoList.create('Compras');
  const item = listA.addItem('Comprar leche');
  listA.completeItem(item.id.value);
  listA.clearEvents();
  await repository.save(listA);

  const listB = TodoList.create('Pendientes');
  listB.clearEvents();
  await repository.save(listB);

  const interactor = new ListTodoListsInteractor(repository);
  const { presenter, state } = capture<ListTodoListsOutput>();
  await interactor.execute({}, presenter);

  assert.equal(state.error, undefined);
  assert.equal(state.success?.lists.length, 2);

  const foundA = state.success?.lists.find(l => l.id === listA.id.value);
  assert.equal(foundA?.completionPercentage, 100);
  assert.equal(foundA?.isFullyCompleted, true);

  const foundB = state.success?.lists.find(l => l.id === listB.id.value);
  assert.equal(foundB?.completionPercentage, 0);
  assert.equal(foundB?.isFullyCompleted, false);
});
