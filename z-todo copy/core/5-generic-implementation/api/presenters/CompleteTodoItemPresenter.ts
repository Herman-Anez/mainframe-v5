import { OutputBoundary } from "../../../2-application/shared/OutputBoundary";
import { CompleteTodoItemOutput } from "../../../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemOutput";

export class CompleteTodoItemPresenter implements OutputBoundary<CompleteTodoItemOutput> {
  presentSuccess(output: CompleteTodoItemOutput): void {
    console.log(output);
  }

  presentError(error: Error): void {
    console.log({ error: error.message });
  }
}
