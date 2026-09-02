import { OutputBoundary } from './OutputBoundary';

/**
 * Contrato mínimo de un caso de uso: recibe un Input, empuja el resultado
 * por un OutputBoundary. Los 9 `XxxUseCase.ts` lo extienden nominalmente
 * (`interface AddTodoItemUseCase extends UseCase<AddTodoItemInput, AddTodoItemOutput> {}`)
 * para conservar nombres legibles sin repetir la firma.
 *
 * `RouteDescriptor` (use-cases-ports/http) también consume este tipo, en vez
 * de re-declarar un `UseCaseLike` propio.
 */
export interface UseCase<TInput, TOutput> {
  execute(input: TInput, output: OutputBoundary<TOutput>): Promise<void>;
}
