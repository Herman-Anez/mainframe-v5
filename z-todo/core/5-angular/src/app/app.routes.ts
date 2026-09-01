import { Routes } from '@angular/router';
import { TodoListsPageComponent } from './features/todo-lists/todo-lists-page/todo-lists-page.component';
import { TodoListDetailPageComponent } from './features/todo-lists/todo-list-detail-page/todo-list-detail-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'lists' },
  { path: 'lists', component: TodoListsPageComponent },
  { path: 'lists/:listId', component: TodoListDetailPageComponent },
];
