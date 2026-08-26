export interface OutputBoundaryLike<TOutput> {
  presentSuccess(output: TOutput): void;
  presentError(error: Error): void;
}

/**
 * Generic Promise-shaped bridge for the 9 structurally-identical *OutputBoundary
 * interfaces in 2-application, so no per-use-case presenter class is needed.
 */
export class AngularPresenter<TOutput> implements OutputBoundaryLike<TOutput> {
  readonly result: Promise<TOutput>;
  private resolveFn!: (value: TOutput) => void;
  private rejectFn!: (reason: Error) => void;

  constructor() {
    this.result = new Promise<TOutput>((resolve, reject) => {
      this.resolveFn = resolve;
      this.rejectFn = reject;
    });
  }

  presentSuccess(output: TOutput): void {
    this.resolveFn(output);
  }

  presentError(error: Error): void {
    this.rejectFn(error);
  }
}

export async function runUseCase<TInput, TOutput>(
  useCase: { execute(input: TInput, output: OutputBoundaryLike<TOutput>): Promise<void> },
  input: TInput,
): Promise<TOutput> {
  const presenter = new AngularPresenter<TOutput>();
  await useCase.execute(input, presenter);
  return presenter.result;
}
