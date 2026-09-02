import { OutputBoundary } from "../../../2-application/shared/OutputBoundary";
import { AddTodoItemOutput } from "../../../2-application/use-cases/commands/add-todo-item/AddTodoItemOutput";

export class AddTodoItemPresenter implements OutputBoundary<AddTodoItemOutput> {
  presentSuccess(output: AddTodoItemOutput): void {
    console.log(output);
  }

  presentError(error: Error): void {
    console.log({ error: error.message });
  }
}
