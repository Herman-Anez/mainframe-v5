/**
 * Piezas 100% agnósticas a cualquier framework HTTP (Express, Fastify, Nest,
 * un handler de Lambda, lo que sea). Nada acá importa una sola línea de
 * ningún framework — describen QUÉ endpoint existe y CÓMO se arma su Input
 * a partir de un request, no CÓMO se lee ese request en un framework real.
 *
 * El "binder" (fuera de este archivo, a propósito) es la única pieza que
 * sabe qué framework se está usando: lee este array de RouteDescriptor y lo
 * conecta a las rutas reales de Express/Fastify/etc.
 */

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/**
 * Forma agnóstica de "lo que trae un request HTTP" — cualquier framework
 * puede producir este shape con un mapeo trivial (req.params, req.body, req.query).
 */
export interface HttpRequestData {
  params: Record<string, string>;
  query: Record<string, string>;
  body: unknown;
}

/**
 * Mismo shape que los *OutputBoundary.ts de 2-application (presentSuccess/
 * presentError) — definido de nuevo acá, sin importar ninguno de los 9
 * concretos, porque esta capa no debería depender de cuáles existen.
 */
export interface OutputBoundaryLike<TOutput> {
  presentSuccess(output: TOutput): void;
  presentError(error: Error): void;
}

/**
 * Lo mínimo que necesitamos de un caso de uso: poder ejecutarlo. Cualquier
 * XxxUseCase de 2-application cumple esto tal cual, sin adaptar nada.
 */
export interface UseCaseLike<TInput, TOutput> {
  execute(input: TInput, output: OutputBoundaryLike<TOutput>): Promise<void>;
}

/**
 * Un endpoint, descripto como datos puros. No es código que corre nada por
 * sí solo — es la receta que un binder interpreta.
 */
export interface RouteDescriptor<TInput = unknown, TOutput = unknown> {
  method: HttpMethod;
  path: string;
  /** Arma el Input del caso de uso a partir de params/query/body del request. */
  buildInput: (request: HttpRequestData) => TInput;
  useCase: UseCaseLike<TInput, TOutput>;
  /** Código HTTP a devolver cuando el caso de uso termina con éxito. */
  successStatus: number;
  /** Traduce una excepción (de dominio o no) a un código HTTP. */
  errorStatus: (error: Error) => number;
}
