// ***************************Dominio**********************************

// -------------------------Value Objects---------------------------------

// src/domain/value-objects/TodoListId.ts
import { randomUUID } from 'crypto';

export class TodoListId {
    private constructor(readonly value: string) { }

    static create(): TodoListId {
        return new TodoListId(randomUUID());
    }

    static from(value: string): TodoListId {
        if (!value || value.trim().length === 0) {
            throw new Error('TodoListId cannot be empty');
        }
        return new TodoListId(value);
    }

    equals(other: TodoListId): boolean {
        return this.value === other.value;
    }
}

// src/domain/value-objects/TodoItemId.ts
// import { randomUUID } from 'crypto';
export class TodoItemId {
    private constructor(readonly value: string) { }

    static create(): TodoItemId {
        return new TodoItemId(randomUUID());
    }

    static from(value: string): TodoItemId {
        if (!value || value.trim().length === 0) {
            throw new Error('TodoItemId cannot be empty');
        }
        return new TodoItemId(value);
    }

    equals(other: TodoItemId): boolean {
        return this.value === other.value;
    }
}

// src/domain/value-objects/Title.ts
export class Title {
    private constructor(readonly value: string) { }

    static create(value: string): Title {
        const trimmed = value?.trim();
        if (!trimmed || trimmed.length < 3) {
            throw new Error('Title must have at least 3 characters');
        }
        if (trimmed.length > 100) {
            throw new Error('Title cannot exceed 100 characters');
        }
        return new Title(trimmed);
    }
}

// src/domain/value-objects/Description.ts
export class Description {
    private constructor(readonly value: string) { }

    static create(value: string = ''): Description {
        const trimmed = value?.trim() ?? '';
        if (trimmed.length > 500) {
            throw new Error('Description cannot exceed 500 characters');
        }
        return new Description(trimmed);
    }
}

// src/domain/value-objects/Status.ts
export type StatusValue = 'TODO' | 'COMPLETED';

export class Status {
    private constructor(readonly value: StatusValue) { }

    static todo(): Status {
        return new Status('TODO');
    }

    static completed(): Status {
        return new Status('COMPLETED');
    }

    get isCompleted(): boolean {
        return this.value === 'COMPLETED';
    }

    equals(other: Status): boolean {
        return this.value === other.value;
    }
}

// src/domain/value-objects/Priority.ts
export type PriorityValue = 'LOW' | 'MEDIUM' | 'HIGH';

export class Priority {
    private constructor(readonly value: PriorityValue) { }

    static low(): Priority {
        return new Priority('LOW');
    }

    static medium(): Priority {
        return new Priority('MEDIUM');
    }

    static high(): Priority {
        return new Priority('HIGH');
    }

    static from(value: string): Priority {
        switch (value.toUpperCase()) {
            case 'LOW': return Priority.low();
            case 'MEDIUM': return Priority.medium();
            case 'HIGH': return Priority.high();
            default:
                throw new Error(`Invalid priority: ${value}`);
        }
    }

    equals(other: Priority): boolean {
        return this.value === other.value;
    }
}
// -----------------------------------------------------------------------

// -------------------------Entidades y Agregados---------------------------------

// src/domain/entities/TodoItem.ts

// import { TodoItemId } from '../value-objects/TodoItemId';
// import { Title } from '../value-objects/Title';
// import { Description } from '../value-objects/Description';
// import { Status } from '../value-objects/Status';
// import { Priority } from '../value-objects/Priority';

export class TodoItem {
    private constructor(
        readonly id: TodoItemId,
        private _title: Title,
        private _description: Description,
        private _status: Status,
        private _priority: Priority,
    ) { }

    // Factory method
    static create(
        title: string,
        description: string = '',
        priority: string = 'MEDIUM',
    ): TodoItem {
        return new TodoItem(
            TodoItemId.create(),
            Title.create(title),
            Description.create(description),
            Status.todo(),
            Priority.from(priority),
        );
    }

    // Getters
    get title(): string { return this._title.value; }
    get description(): string { return this._description.value; }
    get status(): string { return this._status.value; }
    get priority(): string { return this._priority.value; }

    // Comportamientos
    complete(): void {
        if (this._status.isCompleted) {
            throw new Error('TodoItem is already completed');
        }
        this._status = Status.completed();
    }

    rename(newTitle: string): void {
        this._title = Title.create(newTitle);
    }

    changeDescription(newDescription: string): void {
        this._description = Description.create(newDescription);
    }

    changePriority(newPriority: string): void {
        this._priority = Priority.from(newPriority);
    }

    isCompleted(): boolean {
        return this._status.isCompleted;
    }
}

// src/domain/entities/TodoList.ts
// import { TodoListId } from '../value-objects/TodoListId';
// import { TodoItem } from './TodoItem';
// import { DomainEvent } from '../events/DomainEvent';
// import { TodoListCreated } from '../events/TodoListCreated';
// import { TodoItemAdded } from '../events/TodoItemAdded';
// import { TodoItemCompleted } from '../events/TodoItemCompleted';

export class TodoList {
    private _items: TodoItem[] = [];
    private _domainEvents: DomainEvent[] = [];

    private constructor(
        readonly id: TodoListId,
        private _name: string,
    ) { }

    // Factory method que crea la lista y registra evento
    static create(name: string): TodoList {
        const list = new TodoList(TodoListId.create(), name.trim());
        list.addDomainEvent(new TodoListCreated(list.id.value, list.name));
        return list;
    }

    // Reconstrucción desde persistencia (sin eventos)
    static fromPersistence(id: string, name: string, items: TodoItem[]): TodoList {
        const list = new TodoList(TodoListId.from(id), name);
        list._items = items;
        return list;
    }

    get name(): string { return this._name; }
    get items(): readonly TodoItem[] { return this._items; }

    // Gestión de eventos de dominio
    get domainEvents(): readonly DomainEvent[] { return this._domainEvents; }
    clearEvents(): void { this._domainEvents = []; }
    private addDomainEvent(event: DomainEvent): void { this._domainEvents.push(event); }

    // Comportamientos del agregado
    addItem(title: string, description: string = '', priority: string = 'MEDIUM'): TodoItem {
        // Regla de negocio: máximo 10 items por lista
        if (this._items.length >= 10) {
            throw new Error('TodoList cannot have more than 10 items');
        }
        const item = TodoItem.create(title, description, priority);
        this._items.push(item);
        this.addDomainEvent(new TodoItemAdded(this.id.value, item.id.value, item.title));
        return item;
    }

    completeItem(itemId: string): void {
        const item = this.findItemOrThrow(itemId);
        item.complete();
        this.addDomainEvent(new TodoItemCompleted(this.id.value, itemId));
    }

    renameItem(itemId: string, newTitle: string): void {
        const item = this.findItemOrThrow(itemId);
        item.rename(newTitle);
    }

    changeItemDescription(itemId: string, newDescription: string): void {
        const item = this.findItemOrThrow(itemId);
        item.changeDescription(newDescription);
    }

    changeItemPriority(itemId: string, newPriority: string): void {
        const item = this.findItemOrThrow(itemId);
        item.changePriority(newPriority);
    }

    private findItemOrThrow(itemId: string): TodoItem {
        const item = this._items.find(i => i.id.value === itemId);
        if (!item) {
            throw new Error(`TodoItem with id ${itemId} not found`);
        }
        return item;
    }
}
// -----------------------------------------------------------------------

// ------------------------- Eventos de Dominio---------------------------------

// src/domain/events/DomainEvent.ts
export interface DomainEvent {
    readonly eventName: string;
    readonly occurredOn: Date;
}

// src/domain/events/DomainEvent.ts
export interface DomainEvent {
    readonly eventName: string;
    readonly occurredOn: Date;
}

// src/domain/events/TodoListCreated.ts
// import { DomainEvent } from './DomainEvent';

export class TodoListCreated implements DomainEvent {
    readonly eventName = 'TodoListCreated';
    readonly occurredOn: Date;

    constructor(
        readonly todoListId: string,
        readonly name: string,
    ) {
        this.occurredOn = new Date();
    }
}

// src/domain/events/TodoItemAdded.ts
// import { DomainEvent } from './DomainEvent';

export class TodoItemAdded implements DomainEvent {
    readonly eventName = 'TodoItemAdded';
    readonly occurredOn: Date;

    constructor(
        readonly todoListId: string,
        readonly todoItemId: string,
        readonly title: string,
    ) {
        this.occurredOn = new Date();
    }
}


// src/domain/events/TodoItemCompleted.ts
// import { DomainEvent } from './DomainEvent';

export class TodoItemCompleted implements DomainEvent {
    readonly eventName = 'TodoItemCompleted';
    readonly occurredOn: Date;

    constructor(
        readonly todoListId: string,
        readonly todoItemId: string,
    ) {
        this.occurredOn = new Date();
    }
}
// -----------------------------------------------------------------------

// -------------------------Servicios de Dominio---------------------------------
// src/domain/services/TodoListDomainService.ts
// import { TodoList } from '../entities/TodoList';

export class TodoListDomainService {
    /**
     * Calcula el porcentaje de tareas completadas en una lista.
     * Regla de negocio: si el 100% están completadas, la lista se considera "terminada".
     */
    static calculateCompletionPercentage(list: TodoList): number {
        if (list.items.length === 0) return 0;
        const completed = list.items.filter(item => item.isCompleted()).length;
        return (completed / list.items.length) * 100;
    }

    static isFullyCompleted(list: TodoList): boolean {
        return this.calculateCompletionPercentage(list) === 100;
    }
}
// -----------------------------------------------------------------------

// -------------------------Excepciones de Dominio---------------------------------
// src/domain/exceptions/DomainException.ts
export class DomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

// src/domain/exceptions/TodoListNotFoundException.ts
// import { DomainException } from './DomainException';

export class TodoListNotFoundException extends DomainException {
    constructor(id: string) {
        super(`TodoList with id ${id} was not found`);
    }
}

// src/domain/exceptions/TodoItemNotFoundException.ts
// import { DomainException } from './DomainException';

export class TodoItemNotFoundException extends DomainException {
    constructor(itemId: string, listId?: string) {
        super(`TodoItem with id ${itemId} not found${listId ? ` in list ${listId}` : ''}`);
    }
}
// -----------------------------------------------------------------------

// -------------------------Repositorio (Interfaz en Dominio)---------------------------------
// src/domain/repositories/TodoListRepository.ts
// import { TodoList } from '../entities/TodoList';
// import { TodoListId } from '../value-objects/TodoListId';

export interface TodoListRepository {
    save(todoList: TodoList): Promise<void>;
    findById(id: TodoListId): Promise<TodoList | null>;
    findAll(): Promise<TodoList[]>;
    delete(id: TodoListId): Promise<void>;
}
// -----------------------------------------------------------------------

// -------------------------Fábrica (Factory)---------------------------------
// src/domain/factories/TodoListFactory.ts
// import { TodoList } from '../entities/TodoList';

export class TodoListFactory {
    static createTodoList(name: string): TodoList {
        return TodoList.create(name);
    }
}
// -----------------------------------------------------------------------

// ********************************************************************

// ***************************Aplicación**********************************
// -------------------------Puertos (Interfaces de salida)---------------------------------

// src/application/ports/EventBus.ts
// import { DomainEvent } from '../../domain/events/DomainEvent';

export interface EventBus {
    publish(events: readonly DomainEvent[]): void;
    subscribe(eventName: string, handler: (event: DomainEvent) => void): void;
}

// src/application/ports/UnitOfWork.ts
export interface UnitOfWork {
    begin(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
// -----------------------------------------------------------------------

// -------------------------DTOs (Objetos de transferencia de datos)---------------------------------

// src/application/dtos/TodoListDTO.ts
// import { TodoItemDTO } from './TodoItemDTO';
export interface TodoListDTO {
    id: string;
    name: string;
    items: TodoItemDTO[];
}

// src/application/dtos/TodoItemDTO.ts
export interface TodoItemDTO {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
}
// -----------------------------------------------------------------------

// -------------------------Mapeadores---------------------------------

// src/application/mappers/TodoListMapper.ts

// import { TodoList } from '../../domain/entities/TodoList';
// import { TodoListDTO } from '../dtos/TodoListDTO';
// import { TodoItemDTO } from '../dtos/TodoItemDTO';
export class TodoListMapper {
    static toDTO(todoList: TodoList): TodoListDTO {
        return {
            id: todoList.id.value,
            name: todoList.name,
            items: todoList.items.map(item => this.itemToDTO(item)),
        };
    }

    private static itemToDTO(item: TodoItem): TodoItemDTO {
        return {
            id: item.id.value,
            title: item.title,
            description: item.description,
            status: item.status,
            priority: item.priority,
        };
    }
}
// -----------------------------------------------------------------------

// -------------------------Puertos de Entrada (Input Ports)---------------------------------

// src/application/ports/in/CreateTodoListInputPort.ts
export interface CreateTodoListInputPort {
    execute(name: string): Promise<string>;
}
// src/application/ports/in/AddTodoItemInputPort.ts
export interface AddTodoItemInputPort {
    execute(listId: string, title: string, description: string, priority: string): Promise<void>;
}
// src/application/ports/in/CompleteTodoItemInputPort.ts
export interface CompleteTodoItemInputPort {
    execute(listId: string, itemId: string): Promise<void>;
}
// src/application/ports/in/GetTodoListInputPort.ts

// import { TodoListDTO } from '../../dtos/TodoListDTO';
export interface GetTodoListInputPort {
    execute(listId: string): Promise<TodoListDTO>;
}
// -----------------------------------------------------------------------


// -------------------------Casos de Uso (Comandos)---------------------------------

// src/application/commands/CreateTodoList.ts

// import { TodoList } from '../../domain/entities/TodoList';
// import { TodoListRepository } from '../../domain/repositories/TodoListRepository';
// import { EventBus } from '../ports/EventBus';

export class CreateTodoList implements CreateTodoListInputPort {
    constructor(
        private readonly repository: TodoListRepository,
        private readonly eventBus: EventBus,
        private readonly unitOfWork: UnitOfWork,
    ) { }

    async execute(name: string): Promise<string> {
        const list = TodoList.create(name);
        await this.unitOfWork.begin();
        try {
            await this.repository.save(list);
            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            throw error;
        }
        // Publicar eventos de dominio generados
        this.eventBus.publish(list.domainEvents);
        list.clearEvents();
        return list.id.value;
    }
}

// src/application/commands/AddTodoItem.ts

// import { TodoListRepository } from '../../domain/repositories/TodoListRepository';
// import { TodoListId } from '../../domain/value-objects/TodoListId';
// import { EventBus } from '../ports/EventBus';
// import { TodoListNotFoundException } from '../../domain/exceptions/TodoListNotFoundException';
export class AddTodoItem implements AddTodoItemInputPort {
    constructor(
        private readonly repository: TodoListRepository,
        private readonly eventBus: EventBus,
        private readonly unitOfWork: UnitOfWork,
    ) { }

    async execute(
        listId: string,
        title: string,
        description: string,
        priority: string,
    ): Promise<void> {
        const list = await this.repository.findById(TodoListId.from(listId));
        if (!list) {
            throw new TodoListNotFoundException(listId);
        }
        list.addItem(title, description, priority);
        await this.unitOfWork.begin();
        try {
            await this.repository.save(list);
            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            throw error;
        }
        this.eventBus.publish(list.domainEvents);
        list.clearEvents();
    }
}

// src/application/commands/CompleteTodoItem.ts

// import { TodoListRepository } from '../../domain/repositories/TodoListRepository';
// import { TodoListId } from '../../domain/value-objects/TodoListId';
// import { EventBus } from '../ports/EventBus';
// import { TodoListNotFoundException } from '../../domain/exceptions/TodoListNotFoundException';
export class CompleteTodoItem implements CompleteTodoItemInputPort {
    constructor(
        private readonly repository: TodoListRepository,
        private readonly eventBus: EventBus,
        private readonly unitOfWork: UnitOfWork,
    ) { }

    async execute(listId: string, itemId: string): Promise<void> {
        const list = await this.repository.findById(TodoListId.from(listId));
        if (!list) {
            throw new TodoListNotFoundException(listId);
        }
        list.completeItem(itemId);
        await this.unitOfWork.begin();
        try {
            await this.repository.save(list);
            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            throw error;
        }
        this.eventBus.publish(list.domainEvents);
        list.clearEvents();
    }
}
// -----------------------------------------------------------------------


// -------------------------Casos de Uso (Consultas)---------------------------------

// src/application/queries/GetTodoList.ts

// import { TodoListRepository } from '../../domain/repositories/TodoListRepository';
// import { TodoListId } from '../../domain/value-objects/TodoListId';
// import { TodoListDTO } from '../dtos/TodoListDTO';
// import { TodoListMapper } from '../mappers/TodoListMapper';
// import { TodoListNotFoundException } from '../../domain/exceptions/TodoListNotFoundException';
export class GetTodoList implements GetTodoListInputPort {
    constructor(private readonly repository: TodoListRepository) { }

    async execute(listId: string): Promise<TodoListDTO> {
        const list = await this.repository.findById(TodoListId.from(listId));
        if (!list) {
            throw new TodoListNotFoundException(listId);
        }
        return TodoListMapper.toDTO(list);
    }
}
// -----------------------------------------------------------------------


// -------------------------Manejadores de Eventos (dentro de aplicación)---------------------------------

// src/application/handlers/DomainEventHandler.ts

// import { DomainEvent } from '../../domain/events/DomainEvent';
export class DomainEventHandler {
    handle(event: DomainEvent): void {
        console.log(`[EVENT] ${event.eventName} at ${event.occurredOn.toISOString()}`);
        // Aquí podrías integrar con un servicio de notificaciones, auditoría, etc.
    }
}
// -----------------------------------------------------------------------
// ********************************************************************


// ***************************Infraestructura**********************************

// src/infrastructure/persistence/InMemoryTodoListRepository.ts

// import { TodoList } from '../../domain/entities/TodoList';
// import { TodoListId } from '../../domain/value-objects/TodoListId';
// import { TodoListRepository } from '../../domain/repositories/TodoListRepository';
export class InMemoryTodoListRepository implements TodoListRepository {
    private readonly store = new Map<string, TodoList>();

    async save(todoList: TodoList): Promise<void> {
        this.store.set(todoList.id.value, todoList);
    }

    async findById(id: TodoListId): Promise<TodoList | null> {
        const list = this.store.get(id.value);
        return list ? list : null;
    }

    async findAll(): Promise<TodoList[]> {
        return Array.from(this.store.values());
    }

    async delete(id: TodoListId): Promise<void> {
        this.store.delete(id.value);
    }
}

// src/infrastructure/messaging/InMemoryEventBus.ts

// import { EventBus } from '../../application/ports/EventBus';
// import { DomainEvent } from '../../domain/events/DomainEvent';
export class InMemoryEventBus implements EventBus {
    private handlers: Map<string, Array<(event: DomainEvent) => void>> = new Map();

    publish(events: readonly DomainEvent[]): void {
        events.forEach(event => {
            const eventHandlers = this.handlers.get(event.eventName) || [];
            eventHandlers.forEach(handler => handler(event));
        });
    }

    subscribe(eventName: string, handler: (event: DomainEvent) => void): void {
        const existing = this.handlers.get(eventName) || [];
        existing.push(handler);
        this.handlers.set(eventName, existing);
    }
}

// src/infrastructure/unit-of-work/InMemoryUnitOfWork.ts

//import { UnitOfWork } from '../../application/ports/UnitOfWork';
export class InMemoryUnitOfWork implements UnitOfWork {
    async begin(): Promise<void> {
        // No-op en memoria, pero en una BD real iniciaría transacción
    }

    async commit(): Promise<void> {
        // No-op
    }

    async rollback(): Promise<void> {
        // No-op
    }
}