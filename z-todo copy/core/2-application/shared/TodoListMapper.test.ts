import test from 'node:test';
import assert from 'node:assert/strict';
import { TodoListMapper } from './TodoListMapper';
import { TodoList } from '../../1-domain/entities/TodoList';

test('toRecord produce datos planos (solo strings, sin métodos)', () => {
  const list = TodoList.create('Compras');
  const item = list.addItem('Comprar leche', '2L', 'HIGH');
  list.completeItem(item.id.value);

  const record = TodoListMapper.toRecord(list);

  assert.deepEqual(record, {
    id: list.id.value,
    name: 'Compras',
    items: [
      {
        id: item.id.value,
        title: 'Comprar leche',
        description: '2L',
        status: 'COMPLETED',
        priority: 'HIGH',
      },
    ],
  });
});

test('round-trip toRecord → toDomain preserva todo, incluido COMPLETED', () => {
  const original = TodoList.create('Compras');
  const a = original.addItem('Comprar leche', '2L', 'HIGH');
  original.addItem('Comprar pan', '', 'LOW');
  original.completeItem(a.id.value);

  const rebuilt = TodoListMapper.toDomain(TodoListMapper.toRecord(original));

  assert.equal(rebuilt.id.value, original.id.value);
  assert.equal(rebuilt.name, 'Compras');
  assert.equal(rebuilt.items.length, 2);
  assert.equal(rebuilt.items[0].status, 'COMPLETED');
  assert.equal(rebuilt.items[0].priority, 'HIGH');
  assert.equal(rebuilt.items[1].status, 'TODO');
  assert.equal(rebuilt.items[1].title, 'Comprar pan');
});

test('toDomain reconstruye un agregado funcional (se le puede seguir aplicando lógica)', () => {
  const original = TodoList.create('Compras');
  const item = original.addItem('Comprar leche');
  const rebuilt = TodoListMapper.toDomain(TodoListMapper.toRecord(original));

  rebuilt.completeItem(item.id.value);
  assert.equal(rebuilt.items[0].status, 'COMPLETED');

  // y sigue haciendo cumplir las invariantes
  assert.throws(() => rebuilt.completeItem(item.id.value), { name: 'TodoItemAlreadyCompletedException' });
});

test('toDomain lanza si el record trae un status corrupto', () => {
  const record = { id: 'l1', name: 'Compras', items: [{ id: 'i1', title: 'x y z', description: '', status: 'RARO', priority: 'LOW' }] };
  assert.throws(() => TodoListMapper.toDomain(record), { name: 'ValidationException' });
});
