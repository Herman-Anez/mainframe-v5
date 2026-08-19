export type StatusValue = 'TODO' | 'COMPLETED';

export class Status {
  private constructor(readonly value: StatusValue) {}

  static todo(): Status {
    return new Status('TODO');
  }

  static completed(): Status {
    return new Status('COMPLETED');
  }

  get isCompleted(): boolean {
    return this.value === 'COMPLETED';
  }

  equals(other: Status): boolean {
    return this.value === other.value;
  }
}