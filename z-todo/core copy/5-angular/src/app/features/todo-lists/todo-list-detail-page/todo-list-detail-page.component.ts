import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TodoFacadeService } from '../../../core/todo-facade.service';
import { AddTodoItemFormComponent, AddTodoItemFormValue } from '../components/add-todo-item-form/add-todo-item-form.component';
import { TodoItemRowComponent } from '../components/todo-item-row/todo-item-row.component';

@Component({
  selector: 'app-todo-list-detail-page',
  standalone: true,
  imports: [RouterLink, AddTodoItemFormComponent, TodoItemRowComponent],
  templateUrl: './todo-list-detail-page.component.html',
})
export class TodoListDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly facade = inject(TodoFacadeService);

  readonly currentList = this.facade.currentList;

  private listId = '';

  ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('listId') ?? '';
    void this.facade.refreshCurrentList(this.listId);
  }

  onAddItem(value: AddTodoItemFormValue): void {
    void this.facade.addItem(this.listId, value.title, value.description, value.priority);
  }

  onComplete(itemId: string): void {
    void this.facade.completeItem(this.listId, itemId);
  }

  onRename(itemId: string, newTitle: string): void {
    void this.facade.renameItem(this.listId, itemId, newTitle);
  }

  onChangeDescription(itemId: string, newDescription: string): void {
    void this.facade.changeItemDescription(this.listId, itemId, newDescription);
  }

  onChangePriority(itemId: string, newPriority: string): void {
    void this.facade.changeItemPriority(this.listId, itemId, newPriority);
  }

  async onDeleteList(): Promise<void> {
    await this.facade.deleteList(this.listId);
    void this.router.navigate(['/lists']);
  }
}
