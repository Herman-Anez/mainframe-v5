export type PriorityValue = 'LOW' | 'MEDIUM' | 'HIGH';

export class Priority {
  private constructor(readonly value: PriorityValue) {}

  static low(): Priority {
    return new Priority('LOW');
  }

  static medium(): Priority {
    return new Priority('MEDIUM');
  }

  static high(): Priority {
    return new Priority('HIGH');
  }

  static from(value: string): Priority {
    switch (value.toUpperCase()) {
      case 'LOW': return Priority.low();
      case 'MEDIUM': return Priority.medium();
      case 'HIGH': return Priority.high();
      default:
        throw new Error(`Invalid priority: ${value}`);
    }
  }

  equals(other: Priority): boolean {
    return this.value === other.value;
  }
}