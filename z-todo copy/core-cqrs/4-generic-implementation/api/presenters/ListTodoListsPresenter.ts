import { ListTodoListsOutput } from "../../../2-application/use-cases/query/list-todo-lists/ListTodoListsOutput";
import { ListTodoListsOutputBoundary } from "../../../2-application/use-cases/query/list-todo-lists/ListTodoListsOutputBoundary";

export class ListTodoListsPresenter implements ListTodoListsOutputBoundary {
  constructor() {}

  presentSuccess(output: ListTodoListsOutput): void {
    console.log({ data: output });
  }

  presentError(error: Error): void {
    console.log({ error: error.message });
  }
}
