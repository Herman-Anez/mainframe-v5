import { DomainException, DomainErrorCode } from './DomainException';

/**
 * Dato inválido en un value object (título, descripción, prioridad, id).
 * Una sola clase con `code = 'VALIDATION'` — el mensaje concreto lo pone
 * cada VO. Se mapea a 422.
 */
export class ValidationException extends DomainException {
  readonly code: DomainErrorCode = 'VALIDATION';

  constructor(message: string) {
    super(message);
  }
}
