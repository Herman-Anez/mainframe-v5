import { GetTodoListUseCase } from './GetTodoListUseCase';
import { GetTodoListInput } from './GetTodoListInput';
import { GetTodoListOutput } from './GetTodoListOutput';
import { OutputBoundary } from '../../../shared/OutputBoundary';
import { toTodoItemView } from '../../../shared/TodoItemView';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { TodoListId } from '../../../../1-domain/value-objects/TodoListId';
import { TodoListNotFoundException } from '../../../../1-domain/exceptions/TodoListNotFoundException';
import { TodoListDomainService } from '../../../../1-domain/services/TodoListDomainService';

export class GetTodoListInteractor implements GetTodoListUseCase {
    constructor(private readonly repository: TodoListRepositoryPort) { }

    async execute(input: GetTodoListInput, output: OutputBoundary<GetTodoListOutput>): Promise<void> {
        try {
            const list = await this.repository.findById(TodoListId.from(input.listId));
            if (!list) {
                throw new TodoListNotFoundException(input.listId);
            }

            output.presentSuccess({
                id: list.id.value,
                name: list.name,
                completionPercentage: TodoListDomainService.calculateCompletionPercentage(list.items),
                isFullyCompleted: TodoListDomainService.isFullyCompleted(list.items),
                items: list.items.map(toTodoItemView),
            });
        } catch (error) {
            output.presentError(error as Error);
        }
    }
}
