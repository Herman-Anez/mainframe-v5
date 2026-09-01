import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryTodoListRepository } from './InMemoryTodoListRepository';
import { TodoList } from '../../1-domain/entities/TodoList';

test('mutar el agregado después de save() NO cambia lo guardado', async () => {
  const repo = new InMemoryTodoListRepository();
  const list = TodoList.create('Compras');
  await repo.save(list);

  // se sigue trabajando el objeto original, sin volver a guardar
  list.addItem('Comprar leche');

  const stored = await repo.findById(list.id);
  assert.equal(stored?.items.length, 0, 'el store quedó en la foto del save(), sin el item nuevo');
});

test('dos findById() devuelven instancias independientes', async () => {
  const repo = new InMemoryTodoListRepository();
  const list = TodoList.create('Compras');
  const item = list.addItem('Comprar leche');
  await repo.save(list);

  const a = await repo.findById(list.id);
  const b = await repo.findById(list.id);

  assert.notEqual(a, b, 'no es el mismo objeto');
  a!.completeItem(item.id.value);
  assert.equal(a!.items[0].status, 'COMPLETED');
  assert.equal(b!.items[0].status, 'TODO', 'mutar una copia no afecta a la otra');
});

test('el segundo save() sí actualiza el store', async () => {
  const repo = new InMemoryTodoListRepository();
  const list = TodoList.create('Compras');
  await repo.save(list);

  list.addItem('Comprar leche');
  await repo.save(list); // ahora sí

  const stored = await repo.findById(list.id);
  assert.equal(stored?.items.length, 1);
});

test('findAll() también devuelve agregados reconstruidos e independientes', async () => {
  const repo = new InMemoryTodoListRepository();
  const list = TodoList.create('Compras');
  await repo.save(list);

  const [fromAll] = await repo.findAll();
  fromAll.addItem('Comprar leche');

  const stored = await repo.findById(list.id);
  assert.equal(stored?.items.length, 0);
});
