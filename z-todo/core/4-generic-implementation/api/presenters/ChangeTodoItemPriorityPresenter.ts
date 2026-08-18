import { ChangeTodoItemPriorityOutput } from "../../../2-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityOutput";
import { ChangeTodoItemPriorityOutputBoundary } from "../../../2-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityOutputBoundary";

export class ChangeTodoItemPriorityPresenter implements ChangeTodoItemPriorityOutputBoundary {
  constructor() {}

  presentSuccess(output: ChangeTodoItemPriorityOutput): void {
    console.log(output);
  }

  presentError(error: Error): void {
    console.log({ error: error.message });
  }
}
