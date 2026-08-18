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
import { TodoListController } from "./api/controllers/TodoListController";
import { CreateTodoListPresenter } from "./api/presenters/CreateTodoListPresenter";
import { TodoListId } from "../1-domain/value-objects/TodoListId";

// Infraestructura
const repository = new InMemoryTodoListRepository();
const eventBus = new InMemoryEventBus();

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

// Casos de uso (interactores)
const createTodoList = new CreateTodoListInteractor(repository, eventBus);
const addTodoItem = new AddTodoItemInteractor(repository, eventBus);
const completeTodoItem = new CompleteTodoItemInteractor(repository, eventBus);
const getTodoList = new GetTodoListInteractor(repository);
const renameTodoItem = new RenameTodoItemInteractor(repository, eventBus);
const changeTodoItemDescription = new ChangeTodoItemDescriptionInteractor(repository, eventBus);
const changeTodoItemPriority = new ChangeTodoItemPriorityInteractor(repository, eventBus);
const deleteTodoList = new DeleteTodoListInteractor(repository);
const listTodoLists = new ListTodoListsInteractor(repository);

// Controlador
const controller = new TodoListController(
    createTodoList,
    addTodoItem,
    completeTodoItem,
    getTodoList,
    renameTodoItem,
    changeTodoItemDescription,
    changeTodoItemPriority,
    deleteTodoList,
    listTodoLists,
);

async function run(): Promise<void> {
    // controller.create() usa su propio presenter interno y no lo expone,
    // así que llamamos al interactor directo para poder leer el id creado.
    const createPresenter = new CreateTodoListPresenter();
    await createTodoList.execute({ name: 'Compras del súper' }, createPresenter);

    const listId = createPresenter.result?.id;
    if (!listId) {
        console.log('No se pudo crear la lista, abortando flujo.');
        return;
    }

    await controller.addItem({ listId, title: 'Comprar leche', description: '2 litros', priority: 'HIGH' });
    await controller.addItem({ listId, title: 'Comprar pan', description: '', priority: 'LOW' });

    const listAfterAdd = await repository.findById(TodoListId.from(listId));
    const itemId = listAfterAdd?.items[0]?.id.value;
    const secondItemId = listAfterAdd?.items[1]?.id.value;

    if (itemId) {
        await controller.completeItem({ listId, itemId });
    }
    if (secondItemId) {
        await controller.renameItem({ listId, itemId: secondItemId, newTitle: 'Comprar pan integral' });
        await controller.changeItemDescription({ listId, itemId: secondItemId, newDescription: '1 bolsa' });
        await controller.changeItemPriority({ listId, itemId: secondItemId, newPriority: 'HIGH' });
    }

    await controller.getList({ listId });
    await controller.listLists();

    await controller.deleteList({ listId });
    await controller.listLists();
}

run().catch((error) => console.error('[run:error]', error));
