
import { GetTodoListOutput } from '../../../2-application/use-cases/query/get-todo-list/GetTodoListOutput';
import { GetTodoListOutputBoundary } from '../../../2-application/use-cases/query/get-todo-list/GetTodoListOutputBoundary';


export class GetTodoListPresenter implements GetTodoListOutputBoundary {
    constructor() { }

    presentSuccess(output: GetTodoListOutput): void {
        console.log({ data: output });
    }

    presentError(error: Error): void {
        console.log({ error: error.message });
    }
}