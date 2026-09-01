import { OutputBoundary } from '../../../2-application/shared/OutputBoundary';
import { GetTodoListOutput } from '../../../2-application/use-cases/query/get-todo-list/GetTodoListOutput';

export class GetTodoListPresenter implements OutputBoundary<GetTodoListOutput> {
    presentSuccess(output: GetTodoListOutput): void {
        console.log({ data: output });
    }

    presentError(error: Error): void {
        console.log({ error: error.message });
    }
}
