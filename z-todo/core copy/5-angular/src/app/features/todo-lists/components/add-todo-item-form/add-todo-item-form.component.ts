import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface AddTodoItemFormValue {
  title: string;
  description: string;
  priority: string;
}

@Component({
  selector: 'app-add-todo-item-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-todo-item-form.component.html',
})
export class AddTodoItemFormComponent {
  @Output() add = new EventEmitter<AddTodoItemFormValue>();

  title = '';
  description = '';
  priority = 'MEDIUM';

  readonly priorities = ['LOW', 'MEDIUM', 'HIGH'];

  submit(): void {
    const trimmedTitle = this.title.trim();
    if (!trimmedTitle) {
      return;
    }
    this.add.emit({ title: trimmedTitle, description: this.description.trim(), priority: this.priority });
    this.title = '';
    this.description = '';
    this.priority = 'MEDIUM';
  }
}
