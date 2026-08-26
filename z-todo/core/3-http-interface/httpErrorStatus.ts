import { TodoListNotFoundException } from '../1-domain/exceptions/TodoListNotFoundException';
import { TodoItemNotFoundException } from '../1-domain/exceptions/TodoItemNotFoundException';

/**
 * Política de mapeo error de dominio → código HTTP para este módulo.
 * Es la única pieza que sabe que "no encontrado" es un 404 — ni el dominio
 * ni la aplicación tienen idea de qué es HTTP.
 */
export function defaultErrorStatus(error: Error): number {
  if (error instanceof TodoListNotFoundException || error instanceof TodoItemNotFoundException) {
    return 404;
  }
  return 400;
}
