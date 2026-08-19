import { CompleteTodoItemOutput } from "../../../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemOutput";
import { CompleteTodoItemOutputBoundary } from "../../../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemOutputBoundary";

export class CompleteTodoItemPresenter implements CompleteTodoItemOutputBoundary {
  constructor() {}

  presentSuccess(output: CompleteTodoItemOutput): void {
    console.log(output);
  }

  presentError(error: Error): void {
    console.log({ error: error.message });
  }
}