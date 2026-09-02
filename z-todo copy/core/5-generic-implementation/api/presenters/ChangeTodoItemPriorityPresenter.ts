import { OutputBoundary } from "../../../2-application/shared/OutputBoundary";
import { ChangeTodoItemPriorityOutput } from "../../../2-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityOutput";

export class ChangeTodoItemPriorityPresenter implements OutputBoundary<ChangeTodoItemPriorityOutput> {
  presentSuccess(output: ChangeTodoItemPriorityOutput): void {
    console.log(output);
  }

  presentError(error: Error): void {
    console.log({ error: error.message });
  }
}
