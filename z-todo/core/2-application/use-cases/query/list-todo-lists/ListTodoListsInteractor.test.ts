import test from 'node:test';
import assert from 'node:assert/strict';
import { ListTodoListsInteractor } from './ListTodoListsInteractor';
import { ListTodoListsOutput } from './ListTodoListsOutput';
import { InMemoryTodoListReadModelRepository } from '../../../../3-infrastructure/persistence/InMemoryTodoListReadModelRepository';
import { capture } from '../../../shared/testing/capturePresenter';

test('ListTodoListsInteractor devuelve un array vacío si no hay listas', async () => {
  const readModel = new InMemoryTodoListReadModelRepository();
  const interactor = new ListTodoListsInteractor(readModel);

  const { presenter, state } = capture<ListTodoListsOutput>();
  await interactor.execute({}, presenter);

  assert.equal(state.error, undefined);
  assert.deepEqual(state.success?.lists, []);
});

test('ListTodoListsInteractor devuelve todas las listas ya proyectadas', async () => {
  const readModel = new InMemoryTodoListReadModelRepository();
  await readModel.upsert({
    id: 'list-a',
    name: 'Compras',
    completionPercentage: 100,
    isFullyCompleted: true,
    items: [{ id: 'item-1', title: 'Comprar leche', description: '', status: 'COMPLETED', priority: 'MEDIUM' }],
  });
  await readModel.upsert({
    id: 'list-b',
    name: 'Pendientes',
    completionPercentage: 0,
    isFullyCompleted: false,
    items: [],
  });

  const interactor = new ListTodoListsInteractor(readModel);
  const { presenter, state } = capture<ListTodoListsOutput>();
  await interactor.execute({}, presenter);

  assert.equal(state.error, undefined);
  assert.equal(state.success?.lists.length, 2);

  const foundA = state.success?.lists.find(l => l.id === 'list-a');
  assert.equal(foundA?.completionPercentage, 100);
  assert.equal(foundA?.isFullyCompleted, true);

  const foundB = state.success?.lists.find(l => l.id === 'list-b');
  assert.equal(foundB?.completionPercentage, 0);
  assert.equal(foundB?.isFullyCompleted, false);
});
