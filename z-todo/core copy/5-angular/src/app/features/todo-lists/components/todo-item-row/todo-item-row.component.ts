import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoItemOutput } from '@core-application/use-cases/query/get-todo-list/GetTodoListOutput';

@Component({
  selector: 'tr[app-todo-item-row]',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-item-row.component.html',
})
export class TodoItemRowComponent {
  @Input({ required: true }) item!: TodoItemOutput;

  @Output() complete = new EventEmitter<void>();
  @Output() rename = new EventEmitter<string>();
  @Output() changeDescription = new EventEmitter<string>();
  @Output() changePriority = new EventEmitter<string>();

  readonly priorities = ['LOW', 'MEDIUM', 'HIGH'];

  editingTitle = false;
  editingDescription = false;
  titleDraft = '';
  descriptionDraft = '';

  @HostBinding('class.completed')
  get isCompleted(): boolean {
    return this.item.status === 'COMPLETED';
  }

  startEditTitle(): void {
    this.titleDraft = this.item.title;
    this.editingTitle = true;
  }

  submitTitle(): void {
    const trimmed = this.titleDraft.trim();
    if (trimmed && trimmed !== this.item.title) {
      this.rename.emit(trimmed);
    }
    this.editingTitle = false;
  }

  startEditDescription(): void {
    this.descriptionDraft = this.item.description;
    this.editingDescription = true;
  }

  submitDescription(): void {
    if (this.descriptionDraft !== this.item.description) {
      this.changeDescription.emit(this.descriptionDraft);
    }
    this.editingDescription = false;
  }

  onPriorityChange(newPriority: string): void {
    if (newPriority !== this.item.priority) {
      this.changePriority.emit(newPriority);
    }
  }
}
