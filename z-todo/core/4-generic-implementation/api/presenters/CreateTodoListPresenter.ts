import { CreateTodoListOutput } from "../../../2-application/use-cases/commands/create-todo-list/CreateTodoListOutput";
import { CreateTodoListOutputBoundary } from "../../../2-application/use-cases/commands/create-todo-list/CreateTodoListOutputBoundary";


export class CreateTodoListPresenter implements CreateTodoListOutputBoundary {
    result: CreateTodoListOutput | undefined;

    constructor() { }

    presentSuccess(output: CreateTodoListOutput): void {
        this.result = output;
        console.log(output);
    }

    presentError(error: Error): void {
        console.log({ error: error.message });
    }
}