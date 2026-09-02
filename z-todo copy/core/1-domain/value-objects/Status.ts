import { ValidationException } from '../exceptions/ValidationException';

export type StatusValue = 'TODO' | 'COMPLETED';

export class Status {
  private constructor(readonly value: StatusValue) {}

  static todo(): Status {
    return new Status('TODO');
  }

  static completed(): Status {
    return new Status('COMPLETED');
  }

  /** Reconstruye un Status a partir de un valor guardado. Lanza si el string no es un StatusValue válido. */
  static from(value: string): Status {
    switch (value) {
      case 'TODO': return Status.todo();
      case 'COMPLETED': return Status.completed();
      default:
        throw new ValidationException(`Invalid status: ${value}`);
    }
  }

  get isCompleted(): boolean {
    return this.value === 'COMPLETED';
  }

  equals(other: Status): boolean {
    return this.value === other.value;
  }
}
