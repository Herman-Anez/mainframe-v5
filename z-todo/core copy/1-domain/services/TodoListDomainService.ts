export interface CompletableItem {
  readonly status: string;
}

export class TodoListDomainService {
  static calculateCompletionPercentage(items: readonly CompletableItem[]): number {
    if (items.length === 0) return 0;
    const completed = items.filter(item => item.status === 'COMPLETED').length;
    return (completed / items.length) * 100;
  }

  static isFullyCompleted(items: readonly CompletableItem[]): boolean {
    return this.calculateCompletionPercentage(items) === 100;
  }
}
