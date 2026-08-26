import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-todo-list-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-todo-list-form.component.html',
})
export class CreateTodoListFormComponent {
  @Output() create = new EventEmitter<string>();

  name = '';

  submit(): void {
    const trimmed = this.name.trim();
    if (!trimmed) {
      return;
    }
    this.create.emit(trimmed);
    this.name = '';
  }
}
