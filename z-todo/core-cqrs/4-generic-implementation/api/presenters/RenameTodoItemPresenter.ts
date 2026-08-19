import { RenameTodoItemOutput } from "../../../2-application/use-cases/commands/rename-todo-item/RenameTodoItemOutput";
import { RenameTodoItemOutputBoundary } from "../../../2-application/use-cases/commands/rename-todo-item/RenameTodoItemOutputBoundary";

export class RenameTodoItemPresenter implements RenameTodoItemOutputBoundary {
  constructor() {}

  presentSuccess(output: RenameTodoItemOutput): void {
    console.log(output);
  }

  presentError(error: Error): void {
    console.log({ error: error.message });
  }
}
