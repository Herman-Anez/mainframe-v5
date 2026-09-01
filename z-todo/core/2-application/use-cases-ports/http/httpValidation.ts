/**
 * Validación de forma del request en el borde HTTP — lo que `httpBody.ts`
 * (fallback silencioso) NO hace. Un campo obligatorio que falta o viene con
 * el tipo equivocado corta acá con `RequestValidationError`, que el binder
 * mapea a 400 (ver `httpErrorStatus.ts`). Es error de transporte, no de
 * dominio: no hereda de `DomainException`.
 */

export class RequestValidationError extends Error {
  readonly fields: string[];

  constructor(fields: string[]) {
    super(`Campos inválidos o faltantes en el request: ${fields.join(', ')}`);
    this.name = 'RequestValidationError';
    this.fields = fields;
  }
}

/** Lee un string obligatorio del body. Lanza si falta o no es string no vacío. */
export function requireString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new RequestValidationError([key]);
  }
  return value;
}
