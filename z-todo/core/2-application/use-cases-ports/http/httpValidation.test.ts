import test from 'node:test';
import assert from 'node:assert/strict';
import { requireString, RequestValidationError } from './httpValidation';

test('requireString devuelve el valor cuando está presente', () => {
  assert.equal(requireString({ title: 'Comprar pan' }, 'title'), 'Comprar pan');
});

test('requireString lanza RequestValidationError si falta la clave', () => {
  assert.throws(() => requireString({}, 'title'), (e: Error) => {
    assert.ok(e instanceof RequestValidationError);
    assert.deepEqual((e as RequestValidationError).fields, ['title']);
    return true;
  });
});

test('requireString lanza si el valor no es string (número, null, etc)', () => {
  assert.throws(() => requireString({ title: 5 }, 'title'), RequestValidationError);
  assert.throws(() => requireString({ title: null }, 'title'), RequestValidationError);
  assert.throws(() => requireString({ title: '   ' }, 'title'), RequestValidationError);
});
