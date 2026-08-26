import { AddTodoItemInteractor } from "../2-application/use-cases/commands/add-todo-item/AddTodoItemInteractor";
import { CompleteTodoItemInteractor } from "../2-application/use-cases/commands/complete-todo-item/CompleteTodoItemInteractor";
import { CreateTodoListInteractor } from "../2-application/use-cases/commands/create-todo-list/CreateTodoListInteractor";
import { GetTodoListInteractor } from "../2-application/use-cases/query/get-todo-list/GetTodoListInteractor";
import { RenameTodoItemInteractor } from "../2-application/use-cases/commands/rename-todo-item/RenameTodoItemInteractor";
import { ChangeTodoItemDescriptionInteractor } from "../2-application/use-cases/commands/change-todo-item-description/ChangeTodoItemDescriptionInteractor";
import { ChangeTodoItemPriorityInteractor } from "../2-application/use-cases/commands/change-todo-item-priority/ChangeTodoItemPriorityInteractor";
import { DeleteTodoListInteractor } from "../2-application/use-cases/commands/delete-todo-list/DeleteTodoListInteractor";
import { ListTodoListsInteractor } from "../2-application/use-cases/query/list-todo-lists/ListTodoListsInteractor";
import { InMemoryEventBus } from "../3-infrastructure/messaging/InMemoryEventBus";
import { InMemoryTodoListRepository } from "../3-infrastructure/persistence/InMemoryTodoListRepository";
import { InMemoryUnitOfWork } from "../3-infrastructure/unit-of-work/InMemoryUnitOfWork";
import { TodoListController } from "../3-backend-interface/TodoListController";
import { TodoUseCases } from "../2-application/use-cases/TodoUseCases";
import { CreateTodoListPresenter } from "./api/presenters/CreateTodoListPresenter";
import { AddTodoItemPresenter } from "./api/presenters/AddTodoItemPresenter";
import { CompleteTodoItemPresenter } from "./api/presenters/CompleteTodoItemPresenter";
import { GetTodoListPresenter } from "./api/presenters/GetTodoListPresenter";
import { RenameTodoItemPresenter } from "./api/presenters/RenameTodoItemPresenter";
import { ChangeTodoItemDescriptionPresenter } from "./api/presenters/ChangeTodoItemDescriptionPresenter";
import { ChangeTodoItemPriorityPresenter } from "./api/presenters/ChangeTodoItemPriorityPresenter";
import { DeleteTodoListPresenter } from "./api/presenters/DeleteTodoListPresenter";
import { ListTodoListsPresenter } from "./api/presenters/ListTodoListsPresenter";
import { TodoListId } from "../1-domain/value-objects/TodoListId";

// Infraestructura
const repository = new InMemoryTodoListRepository();
const eventBus = new InMemoryEventBus();
const unitOfWork = new InMemoryUnitOfWork();

// Suscripción a eventos (manejador simple)
eventBus.subscribe('TodoListCreated', (event) => {
    console.log(`[EVENT] ${event.eventName} at ${event.occurredOn.toISOString()}`);
});
eventBus.subscribe('TodoItemAdded', (event) => {
    console.log(`[EVENT] ${event.eventName} at ${event.occurredOn.toISOString()}`);
});
eventBus.subscribe('TodoItemCompleted', (event) => {
    console.log(`[EVENT] ${event.eventName} at ${event.occurredOn.toISOString()}`);
});
eventBus.subscribe('TodoItemRenamed', (event) => {
    console.log(`[EVENT] ${event.eventName} at ${event.occurredOn.toISOString()}`);
});
eventBus.subscribe('TodoItemDescriptionChanged', (event) => {
    console.log(`[EVENT] ${event.eventName} at ${event.occurredOn.toISOString()}`);
});
eventBus.subscribe('TodoItemPriorityChanged', (event) => {
    console.log(`[EVENT] ${event.eventName} at ${event.occurredOn.toISOString()}`);
});
eventBus.subscribe('TodoListDeleted', (event) => {
    console.log(`[EVENT] ${event.eventName} at ${event.occurredOn.toISOString()}`);
});

// Casos de uso (interactores)
const useCases: TodoUseCases = {
    createTodoList: new CreateTodoListInteractor(repository, eventBus, unitOfWork),
    addTodoItem: new AddTodoItemInteractor(repository, eventBus, unitOfWork),
    completeTodoItem: new CompleteTodoItemInteractor(repository, eventBus, unitOfWork),
    renameTodoItem: new RenameTodoItemInteractor(repository, eventBus, unitOfWork),
    changeTodoItemDescription: new ChangeTodoItemDescriptionInteractor(repository, eventBus, unitOfWork),
    changeTodoItemPriority: new ChangeTodoItemPriorityInteractor(repository, eventBus, unitOfWork),
    deleteTodoList: new DeleteTodoListInteractor(repository, eventBus, unitOfWork),
    getTodoList: new GetTodoListInteractor(repository),
    listTodoLists: new ListTodoListsInteractor(repository),
};

// Controlador — interfaz genérica de backend, no sabe que existe console.log
const controller = new TodoListController(useCases);

async function run(): Promise<void> {
    const createPresenter = new CreateTodoListPresenter();
    await controller.create({ name: 'Compras del súper' }, createPresenter);

    const listId = createPresenter.result?.id;
    if (!listId) {
        console.log('No se pudo crear la lista, abortando flujo.');
        return;
    }

    await controller.addItem(listId, { title: 'Comprar leche', description: '2 litros', priority: 'HIGH' }, new AddTodoItemPresenter());
    await controller.addItem(listId, { title: 'Comprar pan', description: '', priority: 'LOW' }, new AddTodoItemPresenter());

    const listAfterAdd = await repository.findById(TodoListId.from(listId));
    const itemId = listAfterAdd?.items[0]?.id.value;
    const secondItemId = listAfterAdd?.items[1]?.id.value;

    if (itemId) {
        await controller.completeItem({ listId, itemId }, new CompleteTodoItemPresenter());
    }
    if (secondItemId) {
        await controller.renameItem({ listId, itemId: secondItemId, newTitle: 'Comprar pan integral' }, new RenameTodoItemPresenter());
        await controller.changeItemDescription({ listId, itemId: secondItemId, newDescription: '1 bolsa' }, new ChangeTodoItemDescriptionPresenter());
        await controller.changeItemPriority({ listId, itemId: secondItemId, newPriority: 'HIGH' }, new ChangeTodoItemPriorityPresenter());
    }

    await controller.getList({ listId }, new GetTodoListPresenter());
    await controller.listLists(new ListTodoListsPresenter());

    await controller.deleteList({ listId }, new DeleteTodoListPresenter());
    await controller.listLists(new ListTodoListsPresenter());
}

run().catch((error) => console.error('[run:error]', error));
