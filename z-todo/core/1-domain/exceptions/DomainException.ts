/**
 * Categoría transporte-agnóstica de un error de dominio. La capa que traduce
 * a HTTP (u otro protocolo) mapea por `code`, sin encadenar `instanceof`:
 *   NOT_FOUND  → 404
 *   CONFLICT   → 409  (violación de invariante por estado: lista llena, item ya completo)
 *   VALIDATION → 422  (dato inválido: título corto, prioridad inexistente, id vacío)
 */
export type DomainErrorCode = 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION';

export abstract class DomainException extends Error {
    abstract readonly code: DomainErrorCode;

    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}
