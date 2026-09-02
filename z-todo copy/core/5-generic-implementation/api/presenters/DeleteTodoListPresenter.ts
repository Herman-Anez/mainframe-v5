import { OutputBoundary } from "../../../2-application/shared/OutputBoundary";

export class DeleteTodoListPresenter implements OutputBoundary<void> {
  presentSuccess(): void {
    console.log({ deleted: true });
  }

  presentError(error: Error): void {
    console.log({ error: error.message });
  }
}
