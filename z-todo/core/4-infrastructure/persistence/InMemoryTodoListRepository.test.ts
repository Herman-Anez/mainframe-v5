import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryTodoListRepository } from './InMemoryTodoListRepository';
import { TodoListRecord } from '../../2-application/shared/TodoListRecord';

function record(id = 'list-1'): TodoListRecord {
  return {
    id,
    name: 'Compras',
    items: [{ id: 'item-1', title: 'Comprar leche', description: '', status: 'TODO', priority: 'MEDIUM' }],
  };
}

test('save() guarda una copia: mutar el record pasado no cambia lo guardado', async () => {
  const repo = new InMemoryTodoListRepository();
  const r = record();
  await repo.save(r);

  r.name = 'MUTADO';
  r.items[0].status = 'COMPLETED';

  const stored = await repo.findById('list-1');
  assert.equal(stored?.name, 'Compras');
  assert.equal(stored?.items[0].status, 'TODO');
});

test('findById() devuelve una copia: mutar el resultado no afecta un segundo findById()', async () => {
  const repo = new InMemoryTodoListRepository();
  await repo.save(record());

  const first = await repo.findById('list-1');
  first!.items[0].status = 'COMPLETED';

  const second = await repo.findById('list-1');
  assert.equal(second?.items[0].status, 'TODO');
});

test('el segundo save() con el mismo id sobrescribe', async () => {
  const repo = new InMemoryTodoListRepository();
  await repo.save(record());

  const updated = record();
  updated.items.push({ id: 'item-2', title: 'Comprar pan', description: '', status: 'TODO', priority: 'LOW' });
  await repo.save(updated);

  const stored = await repo.findById('list-1');
  assert.equal(stored?.items.length, 2);
});

test('findAll() devuelve copias independientes', async () => {
  const repo = new InMemoryTodoListRepository();
  await repo.save(record('a'));
  await repo.save(record('b'));

  const all = await repo.findAll();
  assert.equal(all.length, 2);
  all[0].name = 'MUTADO';

  const reread = await repo.findAll();
  assert.ok(reread.every((r) => r.name === 'Compras'));
});

test('delete() saca la entrada; findById() pasa a devolver null', async () => {
  const repo = new InMemoryTodoListRepository();
  await repo.save(record());

  await repo.delete('list-1');
  assert.equal(await repo.findById('list-1'), null);
});
