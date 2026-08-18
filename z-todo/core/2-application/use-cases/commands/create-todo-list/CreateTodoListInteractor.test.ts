import test from 'node:test';
import assert from 'node:assert/strict';
import { CreateTodoListInteractor } from './CreateTodoListInteractor';
import { CreateTodoListOutput } from './CreateTodoListOutput';
import { InMemoryTodoListRepository } from '../../../../3-infrastructure/persistence/InMemoryTodoListRepository';
import { InMemoryEventBus } from '../../../../3-infrastructure/messaging/InMemoryEventBus';
import { InMemoryUnitOfWork } from '../../../../3-infrastructure/unit-of-work/InMemoryUnitOfWork';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { capture } from '../../../shared/testing/capturePresenter';

test('CreateTodoListInteractor crea la lista, la persiste y publica TodoListCreated', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new CreateTodoListInteractor(repository, eventBus, unitOfWork);

  let publishedEventName: string | undefined;
  eventBus.subscribe('TodoListCreated', (event) => {
    publishedEventName = event.eventName;
  });

  const { presenter, state } = capture<CreateTodoListOutput>();
  await interactor.execute({ name: 'Compras' }, presenter);

  assert.equal(state.error, undefined);
  assert.equal(state.success?.name, 'Compras');
  assert.ok(state.success?.id);
  assert.equal(publishedEventName, 'TodoListCreated');

  const all = await repository.findAll();
  assert.equal(all.length, 1);
  assert.equal(all[0].id.value, state.success?.id);
});

test('CreateTodoListInteractor reporta error de dominio si el nombre es muy corto y no persiste nada', async () => {
  const repository = new InMemoryTodoListRepository();
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  const interactor = new CreateTodoListInteractor(repository, eventBus, unitOfWork);

  const { presenter, state } = capture<CreateTodoListOutput>();
  await interactor.execute({ name: 'ab' }, presenter); // Title exige >= 3 chars

  assert.equal(state.success, undefined);
  assert.match(state.error?.message ?? '', /at least 3 characters/);
  assert.equal((await repository.findAll()).length, 0);
});

test('CreateTodoListInteractor hace rollback y reporta error si falla la persistencia', async () => {
  const failingRepository: TodoListRepositoryPort = {
    save: async () => { throw new Error('DB caída'); },
    findById: async () => null,
    findAll: async () => [],
    delete: async () => {},
  };
  const eventBus = new InMemoryEventBus();
  const unitOfWork = new InMemoryUnitOfWork();
  let rolledBack = false;
  unitOfWork.rollback = async () => { rolledBack = true; };

  let publishedAnyEvent = false;
  eventBus.subscribe('TodoListCreated', () => { publishedAnyEvent = true; });

  const interactor = new CreateTodoListInteractor(failingRepository, eventBus, unitOfWork);
  const { presenter, state } = capture<CreateTodoListOutput>();
  await interactor.execute({ name: 'Compras' }, presenter);

  assert.equal(state.success, undefined);
  assert.match(state.error?.message ?? '', /DB caída/);
  assert.equal(rolledBack, true, 'debería hacer rollback si el save falla');
  assert.equal(publishedAnyEvent, false, 'no debería publicar eventos si el save falla');
});
