export interface TodoItemReadModel {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
}

export interface TodoListReadModel {
  id: string;
  name: string;
  completionPercentage: number;
  isFullyCompleted: boolean;
  items: TodoItemReadModel[];
}
