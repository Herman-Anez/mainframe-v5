import { DeleteTodoListOutput } from "../../../2-application/use-cases/commands/delete-todo-list/DeleteTodoListOutput";
import { DeleteTodoListOutputBoundary } from "../../../2-application/use-cases/commands/delete-todo-list/DeleteTodoListOutputBoundary";

export class DeleteTodoListPresenter implements DeleteTodoListOutputBoundary {
  constructor() {}

  presentSuccess(output: DeleteTodoListOutput): void {
    console.log(output);
  }

  presentError(error: Error): void {
    console.log({ error: error.message });
  }
}
