import { OutputBoundary } from "../../../2-application/shared/OutputBoundary";
import { ChangeTodoItemDescriptionOutput } from "../../../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionOutput";

export class ChangeTodoItemDescriptionPresenter implements OutputBoundary<ChangeTodoItemDescriptionOutput> {
  presentSuccess(output: ChangeTodoItemDescriptionOutput): void {
    console.log(output);
  }

  presentError(error: Error): void {
    console.log({ error: error.message });
  }
}
