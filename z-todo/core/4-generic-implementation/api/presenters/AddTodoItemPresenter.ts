import { AddTodoItemOutput } from "../../../2-application/use-cases/commands/add-todo-item/AddTodoItemOutput";
import { AddTodoItemOutputBoundary } from "../../../2-application/use-cases/commands/add-todo-item/AddTodoItemOutputBoundary";


export class AddTodoItemPresenter implements AddTodoItemOutputBoundary {
  constructor() {}

  presentSuccess(output: AddTodoItemOutput): void {
    console.log();
  }

  presentError(error: Error): void {
    console.log({ error: error.message });
  }
}