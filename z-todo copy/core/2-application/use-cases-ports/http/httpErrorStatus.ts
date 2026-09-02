import { DomainException } from '../../../1-domain/exceptions/DomainException';
import { RequestValidationError } from './httpValidation';

/**
 * Política de mapeo error → código HTTP para este módulo. Es la única pieza
 * que sabe de códigos HTTP — ni el dominio ni la aplicación tienen idea de
 * qué es HTTP.
 *
 *   RequestValidationError        → 400  (el request llegó mal formado)
 *   DomainException 'NOT_FOUND'   → 404
 *   DomainException 'CONFLICT'    → 409  (invariante violada por estado)
 *   DomainException 'VALIDATION'  → 422  (dato de negocio inválido)
 *   cualquier otra cosa           → 500  (bug no previsto; NO es culpa del cliente)
 */
export function defaultErrorStatus(error: Error): number {
  if (error instanceof RequestValidationError) {
    return 400;
  }
  if (error instanceof DomainException) {
    switch (error.code) {
      case 'NOT_FOUND': return 404;
      case 'CONFLICT': return 409;
      case 'VALIDATION': return 422;
    }
  }
  return 500;
}
