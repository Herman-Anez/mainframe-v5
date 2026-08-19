import test from 'node:test';
import assert from 'node:assert/strict';
import { GetTodoListInteractor } from './GetTodoListInteractor';
import { GetTodoListOutput } from './GetTodoListOutput';
import { InMemoryTodoListReadModelRepository } from '../../../../3-infrastructure/persistence/InMemoryTodoListReadModelRepository';
import { capture } from '../../../shared/testing/capturePresenter';

test('GetTodoListInteractor devuelve la lista con completionPercentage e isFullyCompleted', async () => {
  const readModel = new InMemoryTodoListReadModelRepository();
  await readModel.upsert({
    id: 'list-1',
    name: 'Compras',
    completionPercentage: 50,
    isFullyCompleted: false,
    items: [
      { id: 'item-1', title: 'Comprar leche', description: '', status: 'COMPLETED', priority: 'MEDIUM' },
      { id: 'item-2', title: 'Comprar pan', description: '', status: 'TODO', priority: 'MEDIUM' },
    ],
  });

  const interactor = new GetTodoListInteractor(readModel);
  const { presenter, state } = capture<GetTodoListOutput>();
  await interactor.execute({ listId: 'list-1' }, presenter);

  assert.equal(state.error, undefined);
  assert.equal(state.success?.items.length, 2);
  assert.equal(state.success?.completionPercentage, 50);
  assert.equal(state.success?.isFullyCompleted, false);
});

test('GetTodoListInteractor reporta TodoListNotFoundException si la lista no existe', async () => {
  const readModel = new InMemoryTodoListReadModelRepository();
  const interactor = new GetTodoListInteractor(readModel);

  const { presenter, state } = capture<GetTodoListOutput>();
  await interactor.execute({ listId: 'no-existe' }, presenter);

  assert.equal(state.success, undefined);
  assert.equal(state.error?.constructor.name, 'TodoListNotFoundException');
});
