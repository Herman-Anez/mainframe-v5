/**
 * Boundary de salida genérico — reemplaza los 9 `XxxOutputBoundary.ts`
 * idénticos que había antes (todos eran `presentSuccess(T)/presentError(Error)`).
 *
 * El interactor no sabe qué hay del otro lado (consola, HTTP, un test que
 * captura el resultado): solo llama a uno de los dos métodos.
 */
export interface OutputBoundary<TOutput> {
  presentSuccess(output: TOutput): void;
  presentError(error: Error): void;
}
