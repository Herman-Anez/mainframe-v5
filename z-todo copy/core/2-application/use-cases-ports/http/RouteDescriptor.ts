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

import { UseCase } from '../../shared/UseCase';

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
 * Un endpoint, descripto como datos puros. No es código que corre nada por
 * sí solo — es la receta que un binder interpreta.
 */
export interface RouteDescriptor<TInput = unknown, TOutput = unknown> {
  method: HttpMethod;
  path: string;
  /**
   * Arma el Input del caso de uso a partir de params/query/body del request.
   * Puede lanzar `RequestValidationError` (ver `httpValidation.ts`) si falta
   * un campo obligatorio o viene con el tipo equivocado — el binder debe
   * envolver `buildInput` + `useCase.execute` en un try y rutear el error
   * por `errorStatus`.
   */
  buildInput: (request: HttpRequestData) => TInput;
  useCase: UseCase<TInput, TOutput>;
  /** Código HTTP a devolver cuando el caso de uso termina con éxito. */
  successStatus: number;
  /** Traduce una excepción (de dominio, de validación de request, o cualquiera) a un código HTTP. */
  errorStatus: (error: Error) => number;
}
