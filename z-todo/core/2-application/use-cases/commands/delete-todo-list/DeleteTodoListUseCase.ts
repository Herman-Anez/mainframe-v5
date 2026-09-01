import { UseCase } from '../../../shared/UseCase';
import { DeleteTodoListInput } from './DeleteTodoListInput';

/**
 * Éxito no devuelve payload — un DELETE que anduvo no tiene nada que contar.
 * El binder HTTP responde 204. `OutputBoundary<void>`.
 */
export interface DeleteTodoListUseCase extends UseCase<DeleteTodoListInput, void> {}
