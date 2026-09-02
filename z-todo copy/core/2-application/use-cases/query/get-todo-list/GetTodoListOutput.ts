import { TodoItemView } from '../../../shared/TodoItemView';

export interface GetTodoListOutput {
  id: string;
  name: string;
  completionPercentage: number;
  isFullyCompleted: boolean;
  items: TodoItemView[];
}
