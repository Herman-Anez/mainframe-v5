export interface TodoItemOutput {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
}

export interface GetTodoListOutput {
  id: string;
  name: string;
  items: TodoItemOutput[];
}