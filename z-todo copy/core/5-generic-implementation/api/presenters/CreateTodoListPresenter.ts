import { OutputBoundary } from "../../../2-application/shared/OutputBoundary";
import { CreateTodoListOutput } from "../../../2-application/use-cases/commands/create-todo-list/CreateTodoListOutput";

export class CreateTodoListPresenter implements OutputBoundary<CreateTodoListOutput> {
    result: CreateTodoListOutput | undefined;

    presentSuccess(output: CreateTodoListOutput): void {
        this.result = output;
        console.log(output);
    }

    presentError(error: Error): void {
        console.log({ error: error.message });
    }
}
