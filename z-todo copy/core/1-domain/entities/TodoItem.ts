
import { Title } from '../value-objects/Title';
import { Description } from '../value-objects/Description';
import { Status } from '../value-objects/Status';
import { Priority } from '../value-objects/Priority';
import { TodoItemId } from '../value-objects/TodoItemId';
import { TodoItemAlreadyCompletedException } from '../exceptions/TodoItemAlreadyCompletedException';

export class TodoItem {
    private constructor(
        readonly id: TodoItemId,
        private _title: Title,
        private _description: Description,
        private _status: Status,
        private _priority: Priority,
    ) { }

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

    /**
     * Reconstruye un TodoItem ya existente desde datos guardados: acepta un id
     * previo y cualquier estado (incluido COMPLETED). No es "crear algo nuevo",
     * así que no valida como create() más allá de rearmar los value objects.
     * Lo usa el mapper de persistencia, no la lógica de negocio.
     */
    static restore(props: {
        id: string;
        title: string;
        description: string;
        status: string;
        priority: string;
    }): TodoItem {
        return new TodoItem(
            TodoItemId.from(props.id),
            Title.create(props.title),
            Description.create(props.description),
            Status.from(props.status),
            Priority.from(props.priority),
        );
    }

    get title(): string { return this._title.value; }
    get description(): string { return this._description.value; }
    get status(): string { return this._status.value; }
    get priority(): string { return this._priority.value; }

    complete(): void {
        if (this._status.isCompleted) {
            throw new TodoItemAlreadyCompletedException();
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