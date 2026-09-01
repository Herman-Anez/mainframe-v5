import { OutputBoundary } from "../../../2-application/shared/OutputBoundary";
import { ListTodoListsOutput } from "../../../2-application/use-cases/query/list-todo-lists/ListTodoListsOutput";

export class ListTodoListsPresenter implements OutputBoundary<ListTodoListsOutput> {
  presentSuccess(output: ListTodoListsOutput): void {
    console.log({ data: output });
  }

  presentError(error: Error): void {
    console.log({ error: error.message });
  }
}
