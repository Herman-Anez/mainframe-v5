import { ChangeTodoItemDescriptionOutput } from "../../../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionOutput";
import { ChangeTodoItemDescriptionOutputBoundary } from "../../../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionOutputBoundary";

export class ChangeTodoItemDescriptionPresenter implements ChangeTodoItemDescriptionOutputBoundary {
  constructor() {}

  presentSuccess(output: ChangeTodoItemDescriptionOutput): void {
    console.log(output);
  }

  presentError(error: Error): void {
    console.log({ error: error.message });
  }
}
