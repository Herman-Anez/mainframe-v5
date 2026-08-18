import { TodoList } from '../entities/TodoList';

export class TodoListDomainService {
  static calculateCompletionPercentage(list: TodoList): number {
    if (list.items.length === 0) return 0;
    const completed = list.items.filter(item => item.isCompleted()).length;
    return (completed / list.items.length) * 100;
  }

  static isFullyCompleted(list: TodoList): boolean {
    return this.calculateCompletionPercentage(list) === 100;
  }
}