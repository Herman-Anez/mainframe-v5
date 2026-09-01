import { TodoUseCases } from '../../2-application/use-cases/TodoUseCases';
import { TodoListControllerPort } from '../../2-application/use-cases-ports/backend/TodoListControllerPort';
import { OutputBoundary } from '../../2-application/shared/OutputBoundary';
import { CreateTodoListRequest } from '../../2-application/use-cases-ports/backend/dtos/CreateTodoListRequest';
import { AddTodoItemRequest } from '../../2-application/use-cases-ports/backend/dtos/AddTodoItemRequest';
import { CreateTodoListOutput } from '../../2-application/use-cases/commands/create-todo-list/CreateTodoListOutput';
import { AddTodoItemOutput } from '../../2-application/use-cases/commands/add-todo-item/AddTodoItemOutput';
import { CompleteTodoItemInput } from '../../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemInput';
import { CompleteTodoItemOutput } from '../../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemOutput';
import { GetTodoListInput } from '../../2-application/use-cases/query/get-todo-list/GetTodoListInput';
import { GetTodoListOutput } from '../../2-application/use-cases/query/get-todo-list/GetTodoListOutput';
import { RenameTodoItemInput } from '../../2-application/use-cases/commands/rename-todo-item/RenameTodoItemInput';
import { RenameTodoItemOutput } from '../../2-application/use-cases/commands/rename-todo-item/RenameTodoItemOutput';
import { ChangeTodoItemDescriptionInput } from '../../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionInput';
import { ChangeTodoItemDescriptionOutput } from '../../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionOutput';
import { ChangeTodoItemPriorityInput } from '../../2-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityInput';
import { ChangeTodoItemPriorityOutput } from '../../2-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityOutput';
import { DeleteTodoListInput } from '../../2-application/use-cases/commands/delete-todo-list/DeleteTodoListInput';
import { ListTodoListsOutput } from '../../2-application/use-cases/query/list-todo-lists/ListTodoListsOutput';

/**
 * Implementación de TodoListControllerPort: agrupa los 9 casos de uso y
 * expone un método por cada uno. No instancia presenters — los recibe como
 * parámetro, así no depende de console.log, HTTP, ni nada concreto. Quien
 * lo llama (consola, un binder HTTP, un test) decide qué presenter usar.
 */
export class TodoListController implements TodoListControllerPort {
    constructor(private readonly useCases: TodoUseCases) { }

    async create(req: CreateTodoListRequest, output: OutputBoundary<CreateTodoListOutput>): Promise<void> {
        await this.useCases.createTodoList.execute({ name: req.name }, output);
    }

    async addItem(listId: string, req: AddTodoItemRequest, output: OutputBoundary<AddTodoItemOutput>): Promise<void> {
        await this.useCases.addTodoItem.execute(
            {
                listId,
                title: req.title,
                description: req.description ?? '',
                priority: req.priority ?? 'MEDIUM',
            },
            output,
        );
    }

    async completeItem(req: CompleteTodoItemInput, output: OutputBoundary<CompleteTodoItemOutput>): Promise<void> {
        await this.useCases.completeTodoItem.execute(req, output);
    }

    async getList(req: GetTodoListInput, output: OutputBoundary<GetTodoListOutput>): Promise<void> {
        await this.useCases.getTodoList.execute(req, output);
    }

    async renameItem(req: RenameTodoItemInput, output: OutputBoundary<RenameTodoItemOutput>): Promise<void> {
        await this.useCases.renameTodoItem.execute(req, output);
    }

    async changeItemDescription(req: ChangeTodoItemDescriptionInput, output: OutputBoundary<ChangeTodoItemDescriptionOutput>): Promise<void> {
        await this.useCases.changeTodoItemDescription.execute(req, output);
    }

    async changeItemPriority(req: ChangeTodoItemPriorityInput, output: OutputBoundary<ChangeTodoItemPriorityOutput>): Promise<void> {
        await this.useCases.changeTodoItemPriority.execute(req, output);
    }

    async deleteList(req: DeleteTodoListInput, output: OutputBoundary<void>): Promise<void> {
        await this.useCases.deleteTodoList.execute(req, output);
    }

    async listLists(output: OutputBoundary<ListTodoListsOutput>): Promise<void> {
        await this.useCases.listTodoLists.execute({}, output);
    }
}
