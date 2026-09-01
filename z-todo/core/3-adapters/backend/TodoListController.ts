import { TodoUseCases } from '../../2-application/use-cases/TodoUseCases';
import { TodoListControllerPort } from '../../2-application/use-cases-ports/backend/TodoListControllerPort';
import { CreateTodoListRequest } from '../../2-application/use-cases-ports/backend/dtos/CreateTodoListRequest';
import { AddTodoItemRequest } from '../../2-application/use-cases-ports/backend/dtos/AddTodoItemRequest';
import { CreateTodoListOutputBoundary } from '../../2-application/use-cases/commands/create-todo-list/CreateTodoListOutputBoundary';
import { AddTodoItemOutputBoundary } from '../../2-application/use-cases/commands/add-todo-item/AddTodoItemOutputBoundary';
import { CompleteTodoItemInput } from '../../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemInput';
import { CompleteTodoItemOutputBoundary } from '../../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemOutputBoundary';
import { GetTodoListInput } from '../../2-application/use-cases/query/get-todo-list/GetTodoListInput';
import { GetTodoListOutputBoundary } from '../../2-application/use-cases/query/get-todo-list/GetTodoListOutputBoundary';
import { RenameTodoItemInput } from '../../2-application/use-cases/commands/rename-todo-item/RenameTodoItemInput';
import { RenameTodoItemOutputBoundary } from '../../2-application/use-cases/commands/rename-todo-item/RenameTodoItemOutputBoundary';
import { ChangeTodoItemDescriptionInput } from '../../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionInput';
import { ChangeTodoItemDescriptionOutputBoundary } from '../../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionOutputBoundary';
import { ChangeTodoItemPriorityInput } from '../../2-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityInput';
import { ChangeTodoItemPriorityOutputBoundary } from '../../2-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityOutputBoundary';
import { DeleteTodoListInput } from '../../2-application/use-cases/commands/delete-todo-list/DeleteTodoListInput';
import { DeleteTodoListOutputBoundary } from '../../2-application/use-cases/commands/delete-todo-list/DeleteTodoListOutputBoundary';
import { ListTodoListsOutputBoundary } from '../../2-application/use-cases/query/list-todo-lists/ListTodoListsOutputBoundary';

/**
 * Implementación de TodoListControllerPort: agrupa los 9 casos de uso y
 * expone un método por cada uno. No instancia presenters — los recibe como
 * parámetro, así no depende de console.log, HTTP, ni nada concreto. Quien
 * lo llama (consola, un binder HTTP, un test) decide qué presenter usar.
 */
export class TodoListController implements TodoListControllerPort {
    constructor(private readonly useCases: TodoUseCases) { }

    async create(req: CreateTodoListRequest, output: CreateTodoListOutputBoundary): Promise<void> {
        await this.useCases.createTodoList.execute({ name: req.name }, output);
    }

    async addItem(listId: string, req: AddTodoItemRequest, output: AddTodoItemOutputBoundary): Promise<void> {
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

    async completeItem(req: CompleteTodoItemInput, output: CompleteTodoItemOutputBoundary): Promise<void> {
        await this.useCases.completeTodoItem.execute(req, output);
    }

    async getList(req: GetTodoListInput, output: GetTodoListOutputBoundary): Promise<void> {
        await this.useCases.getTodoList.execute(req, output);
    }

    async renameItem(req: RenameTodoItemInput, output: RenameTodoItemOutputBoundary): Promise<void> {
        await this.useCases.renameTodoItem.execute(req, output);
    }

    async changeItemDescription(req: ChangeTodoItemDescriptionInput, output: ChangeTodoItemDescriptionOutputBoundary): Promise<void> {
        await this.useCases.changeTodoItemDescription.execute(req, output);
    }

    async changeItemPriority(req: ChangeTodoItemPriorityInput, output: ChangeTodoItemPriorityOutputBoundary): Promise<void> {
        await this.useCases.changeTodoItemPriority.execute(req, output);
    }

    async deleteList(req: DeleteTodoListInput, output: DeleteTodoListOutputBoundary): Promise<void> {
        await this.useCases.deleteTodoList.execute(req, output);
    }

    async listLists(output: ListTodoListsOutputBoundary): Promise<void> {
        await this.useCases.listTodoLists.execute({}, output);
    }
}
