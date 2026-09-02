import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultErrorStatus } from './httpErrorStatus';
import { RequestValidationError } from './httpValidation';
import { TodoListNotFoundException } from '../../../1-domain/exceptions/TodoListNotFoundException';
import { TodoItemNotFoundException } from '../../../1-domain/exceptions/TodoItemNotFoundException';
import { TodoListFullException } from '../../../1-domain/exceptions/TodoListFullException';
import { TodoItemAlreadyCompletedException } from '../../../1-domain/exceptions/TodoItemAlreadyCompletedException';
import { ValidationException } from '../../../1-domain/exceptions/ValidationException';

test('NOT_FOUND → 404', () => {
  assert.equal(defaultErrorStatus(new TodoListNotFoundException('x')), 404);
  assert.equal(defaultErrorStatus(new TodoItemNotFoundException('x', 'y')), 404);
});

test('CONFLICT → 409', () => {
  assert.equal(defaultErrorStatus(new TodoListFullException(10)), 409);
  assert.equal(defaultErrorStatus(new TodoItemAlreadyCompletedException()), 409);
});

test('VALIDATION de dominio → 422', () => {
  assert.equal(defaultErrorStatus(new ValidationException('Invalid priority: URGENTE')), 422);
});

test('RequestValidationError (transporte) → 400', () => {
  assert.equal(defaultErrorStatus(new RequestValidationError(['title'])), 400);
});

test('error no previsto (no DomainException) → 500', () => {
  assert.equal(defaultErrorStatus(new Error('boom')), 500);
  assert.equal(defaultErrorStatus(new TypeError('cannot read x of undefined')), 500);
});
