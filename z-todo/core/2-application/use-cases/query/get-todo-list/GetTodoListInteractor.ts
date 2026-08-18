import { GetTodoListUseCase } from './GetTodoListUseCase';
import { GetTodoListInput } from './GetTodoListInput';
import { GetTodoListOutputBoundary } from './GetTodoListOutputBoundary';
import { TodoListRepositoryPort } from '../../../ports/out/TodoListRepositoryPort';
import { TodoListId } from '../../../../1-domain/value-objects/TodoListId';
import { TodoListNotFoundException } from '../../../../1-domain/exceptions/TodoListNotFoundException';
import { GetTodoListOutput } from './GetTodoListOutput';
import { TodoListDomainService } from '../../../../1-domain/services/TodoListDomainService';

export class GetTodoListInteractor implements GetTodoListUseCase {
    constructor(private readonly repository: TodoListRepositoryPort) { }

    async execute(input: GetTodoListInput, output: GetTodoListOutputBoundary): Promise<void> {
        try {
            const list = await this.repository.findById(TodoListId.from(input.listId));
            if (!list) {
                throw new TodoListNotFoundException(input.listId);
            }
            const completionPercentage = TodoListDomainService.calculateCompletionPercentage(list);
            const isFullyCompleted = TodoListDomainService.isFullyCompleted(list);
            const todoListOutput: GetTodoListOutput = {
                id: list.id.value,
                name: list.name,
                completionPercentage,
                isFullyCompleted,
                items: list.items.map(item => ({
                    id: item.id.value,
                    title: item.title,
                    description: item.description,
                    status: item.status,
                    priority: item.priority,
                })),
            };
            output.presentSuccess(todoListOutput);
        } catch (error) {
            output.presentError(error as Error);
        }
    }
}