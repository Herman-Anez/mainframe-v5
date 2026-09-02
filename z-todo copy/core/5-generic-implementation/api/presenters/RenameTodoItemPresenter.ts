import { OutputBoundary } from "../../../2-application/shared/OutputBoundary";
import { RenameTodoItemOutput } from "../../../2-application/use-cases/commands/rename-todo-item/RenameTodoItemOutput";

export class RenameTodoItemPresenter implements OutputBoundary<RenameTodoItemOutput> {
  presentSuccess(output: RenameTodoItemOutput): void {
    console.log(output);
  }

  presentError(error: Error): void {
    console.log({ error: error.message });
  }
}
