import { GetTodoListUseCase } from './GetTodoListUseCase';
import { GetTodoListInput } from './GetTodoListInput';
import { GetTodoListOutputBoundary } from './GetTodoListOutputBoundary';
import { TodoListReadModelPort } from '../../../ports/out/TodoListReadModelPort';
import { TodoListNotFoundException } from '../../../../1-domain/exceptions/TodoListNotFoundException';
import { GetTodoListOutput } from './GetTodoListOutput';

export class GetTodoListInteractor implements GetTodoListUseCase {
    constructor(
        private readonly readModel: Pick<TodoListReadModelPort, 'findById'>,
    ) { }

    async execute(input: GetTodoListInput, output: GetTodoListOutputBoundary): Promise<void> {
        try {
            const list = await this.readModel.findById(input.listId);
            if (!list) {
                throw new TodoListNotFoundException(input.listId);
            }

            const todoListOutput: GetTodoListOutput = {
                id: list.id,
                name: list.name,
                completionPercentage: list.completionPercentage,
                isFullyCompleted: list.isFullyCompleted,
                items: list.items.map(item => ({ ...item })),
            };
            output.presentSuccess(todoListOutput);
        } catch (error) {
            output.presentError(error as Error);
        }
    }
}
