
import { CreateTodoListPresenter } from '../presenters/CreateTodoListPresenter';
import { AddTodoItemPresenter } from '../presenters/AddTodoItemPresenter';
import { CompleteTodoItemPresenter } from '../presenters/CompleteTodoItemPresenter';
import { GetTodoListPresenter } from '../presenters/GetTodoListPresenter';
import { RenameTodoItemPresenter } from '../presenters/RenameTodoItemPresenter';
import { ChangeTodoItemDescriptionPresenter } from '../presenters/ChangeTodoItemDescriptionPresenter';
import { ChangeTodoItemPriorityPresenter } from '../presenters/ChangeTodoItemPriorityPresenter';
import { DeleteTodoListPresenter } from '../presenters/DeleteTodoListPresenter';
import { ListTodoListsPresenter } from '../presenters/ListTodoListsPresenter';
import { AddTodoItemUseCase } from '../../../2-application/use-cases/commands/add-todo-item/AddTodoItemUseCase';
import { CompleteTodoItemUseCase } from '../../../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemUseCase';
import { CreateTodoListUseCase } from '../../../2-application/use-cases/commands/create-todo-list/CreateTodoListUseCase';
import { GetTodoListUseCase } from '../../../2-application/use-cases/query/get-todo-list/GetTodoListUseCase';
import { RenameTodoItemUseCase } from '../../../2-application/use-cases/commands/rename-todo-item/RenameTodoItemUseCase';
import { ChangeTodoItemDescriptionUseCase } from '../../../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionUseCase';
import { ChangeTodoItemPriorityUseCase } from '../../../2-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityUseCase';
import { DeleteTodoListUseCase } from '../../../2-application/use-cases/commands/delete-todo-list/DeleteTodoListUseCase';
import { ListTodoListsUseCase } from '../../../2-application/use-cases/query/list-todo-lists/ListTodoListsUseCase';
import { CreateTodoListRequest } from '../dtos/CreateTodoListRequest';
import { AddTodoItemInput } from '../../../2-application/use-cases/commands/add-todo-item/AddTodoItemInput';
import { CompleteTodoItemInput } from '../../../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemInput';
import { GetTodoListInput } from '../../../2-application/use-cases/query/get-todo-list/GetTodoListInput';
import { RenameTodoItemInput } from '../../../2-application/use-cases/commands/rename-todo-item/RenameTodoItemInput';
import { ChangeTodoItemDescriptionInput } from '../../../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionInput';
import { ChangeTodoItemPriorityInput } from '../../../2-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityInput';
import { DeleteTodoListInput } from '../../../2-application/use-cases/commands/delete-todo-list/DeleteTodoListInput';

export class TodoListController {
    constructor(
        private readonly createTodoListUseCase: CreateTodoListUseCase,
        private readonly addTodoItemUseCase: AddTodoItemUseCase,
        private readonly completeTodoItemUseCase: CompleteTodoItemUseCase,
        private readonly getTodoListUseCase: GetTodoListUseCase,
        private readonly renameTodoItemUseCase: RenameTodoItemUseCase,
        private readonly changeTodoItemDescriptionUseCase: ChangeTodoItemDescriptionUseCase,
        private readonly changeTodoItemPriorityUseCase: ChangeTodoItemPriorityUseCase,
        private readonly deleteTodoListUseCase: DeleteTodoListUseCase,
        private readonly listTodoListsUseCase: ListTodoListsUseCase,
    ) { }

    async create(req: CreateTodoListRequest): Promise<void> {
        const input = { name: req.name };
        const presenter = new CreateTodoListPresenter();
        await this.createTodoListUseCase.execute(input, presenter);
    }

    async addItem(req: AddTodoItemInput): Promise<void> {
        const presenter = new AddTodoItemPresenter();
        await this.addTodoItemUseCase.execute(req, presenter);
    }

    async completeItem(req: CompleteTodoItemInput): Promise<void> {
        const presenter = new CompleteTodoItemPresenter();
        await this.completeTodoItemUseCase.execute(req, presenter);
    }

    async getList(req: GetTodoListInput): Promise<void> {
        const presenter = new GetTodoListPresenter();
        await this.getTodoListUseCase.execute(req, presenter);
    }

    async renameItem(req: RenameTodoItemInput): Promise<void> {
        const presenter = new RenameTodoItemPresenter();
        await this.renameTodoItemUseCase.execute(req, presenter);
    }

    async changeItemDescription(req: ChangeTodoItemDescriptionInput): Promise<void> {
        const presenter = new ChangeTodoItemDescriptionPresenter();
        await this.changeTodoItemDescriptionUseCase.execute(req, presenter);
    }

    async changeItemPriority(req: ChangeTodoItemPriorityInput): Promise<void> {
        const presenter = new ChangeTodoItemPriorityPresenter();
        await this.changeTodoItemPriorityUseCase.execute(req, presenter);
    }

    async deleteList(req: DeleteTodoListInput): Promise<void> {
        const presenter = new DeleteTodoListPresenter();
        await this.deleteTodoListUseCase.execute(req, presenter);
    }

    async listLists(): Promise<void> {
        const presenter = new ListTodoListsPresenter();
        await this.listTodoListsUseCase.execute({}, presenter);
    }
}