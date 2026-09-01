import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoFacadeService } from '../../../core/todo-facade.service';
import { CreateTodoListFormComponent } from '../components/create-todo-list-form/create-todo-list-form.component';

@Component({
  selector: 'app-todo-lists-page',
  standalone: true,
  imports: [RouterLink, CreateTodoListFormComponent],
  templateUrl: './todo-lists-page.component.html',
})
export class TodoListsPageComponent implements OnInit {
  private readonly facade = inject(TodoFacadeService);

  readonly lists = this.facade.lists;

  ngOnInit(): void {
    void this.facade.refreshLists();
  }

  onCreate(name: string): void {
    void this.facade.createList(name);
  }

  onDelete(listId: string): void {
    void this.facade.deleteList(listId);
  }
}
