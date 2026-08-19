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
import { InMemoryTodoListReadModelRepository } from "../3-infrastructure/persistence/InMemoryTodoListReadModelRepository";
import { InMemoryUnitOfWork } from "../3-infrastructure/unit-of-work/InMemoryUnitOfWork";
import { TodoListProjector } from "../2-application/read-model/TodoListProjector";
import { TodoListController } from "./api/controllers/TodoListController";
import { CreateTodoListPresenter } from "./api/presenters/CreateTodoListPresenter";

// Infraestructura — lado de escritura
const repository = new InMemoryTodoListRepository();
const eventBus = new InMemoryEventBus();
const unitOfWork = new InMemoryUnitOfWork();

// Infraestructura — lado de lectura (read model, CQRS)
const readModelRepository = new InMemoryTodoListReadModelRepository();
const projector = new TodoListProjector(readModelRepository);
projector.subscribeTo(eventBus);

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
const createTodoList = new CreateTodoListInteractor(repository, eventBus, unitOfWork);
const addTodoItem = new AddTodoItemInteractor(repository, eventBus, unitOfWork);
const completeTodoItem = new CompleteTodoItemInteractor(repository, eventBus, unitOfWork);
const getTodoList = new GetTodoListInteractor(readModelRepository);
const renameTodoItem = new RenameTodoItemInteractor(repository, eventBus, unitOfWork);
const changeTodoItemDescription = new ChangeTodoItemDescriptionInteractor(repository, eventBus, unitOfWork);
const changeTodoItemPriority = new ChangeTodoItemPriorityInteractor(repository, eventBus, unitOfWork);
const deleteTodoList = new DeleteTodoListInteractor(repository, eventBus, unitOfWork);
const listTodoLists = new ListTodoListsInteractor(readModelRepository);

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

    const listAfterAdd = await readModelRepository.findById(listId);
    const itemId = listAfterAdd?.items[0]?.id;
    const secondItemId = listAfterAdd?.items[1]?.id;

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
