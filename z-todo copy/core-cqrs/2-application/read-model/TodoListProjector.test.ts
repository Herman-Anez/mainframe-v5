import test from 'node:test';
import assert from 'node:assert/strict';
import { TodoListProjector } from './TodoListProjector';
import { InMemoryTodoListReadModelRepository } from '../../3-infrastructure/persistence/InMemoryTodoListReadModelRepository';
import { InMemoryEventBus } from '../../3-infrastructure/messaging/InMemoryEventBus';
import { TodoList } from '../../1-domain/entities/TodoList';
import { TodoListDeleted } from '../../1-domain/events/TodoListDeleted';
import { TodoItemCompleted } from '../../1-domain/events/TodoItemCompleted';

test('TodoListProjector construye el read model a partir de los eventos reales del aggregate', async () => {
  const readModel = new InMemoryTodoListReadModelRepository();
  const eventBus = new InMemoryEventBus();
  new TodoListProjector(readModel).subscribeTo(eventBus);

  const list = TodoList.create('Compras del súper');
  const milk = list.addItem('Comprar leche', '2 litros', 'HIGH');
  const bread = list.addItem('Comprar pan', '', 'LOW');
  await eventBus.publish(list.domainEvents);
  list.clearEvents();

  const afterAdd = await readModel.findById(list.id.value);
  assert.equal(afterAdd?.name, 'Compras del súper');
  assert.equal(afterAdd?.items.length, 2);
  assert.deepEqual(afterAdd?.items[0], {
    id: milk.id.value,
    title: 'Comprar leche',
    description: '2 litros',
    status: 'TODO',
    priority: 'HIGH',
  });
  assert.equal(afterAdd?.completionPercentage, 0);

  list.completeItem(milk.id.value);
  list.renameItem(bread.id.value, 'Comprar pan integral');
  list.changeItemDescription(bread.id.value, '1 bolsa');
  list.changeItemPriority(bread.id.value, 'HIGH');
  await eventBus.publish(list.domainEvents);
  list.clearEvents();

  const afterMutations = await readModel.findById(list.id.value);
  assert.equal(afterMutations?.items.find(i => i.id === milk.id.value)?.status, 'COMPLETED');
  assert.equal(afterMutations?.items.find(i => i.id === bread.id.value)?.title, 'Comprar pan integral');
  assert.equal(afterMutations?.items.find(i => i.id === bread.id.value)?.description, '1 bolsa');
  assert.equal(afterMutations?.items.find(i => i.id === bread.id.value)?.priority, 'HIGH');
  assert.equal(afterMutations?.completionPercentage, 50);
  assert.equal(afterMutations?.isFullyCompleted, false);
});

test('TodoListProjector elimina la lista del read model cuando llega TodoListDeleted', async () => {
  const readModel = new InMemoryTodoListReadModelRepository();
  const eventBus = new InMemoryEventBus();
  new TodoListProjector(readModel).subscribeTo(eventBus);

  const list = TodoList.create('Efímera');
  await eventBus.publish(list.domainEvents);
  list.clearEvents();

  assert.ok(await readModel.findById(list.id.value));

  await eventBus.publish([new TodoListDeleted(list.id.value, list.name)]);

  assert.equal(await readModel.findById(list.id.value), null);
});

test('TodoListProjector ignora eventos de items para listas que no están proyectadas (no explota)', async () => {
  const readModel = new InMemoryTodoListReadModelRepository();
  const eventBus = new InMemoryEventBus();
  new TodoListProjector(readModel).subscribeTo(eventBus);

  await eventBus.publish([new TodoItemCompleted('lista-inexistente', 'item-inexistente')]);

  assert.equal(await readModel.findById('lista-inexistente'), null);
});
