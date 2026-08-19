export interface CapturedPresenter<TOutput> {
  presenter: {
    presentSuccess(output: TOutput): void;
    presentError(error: Error): void;
  };
  state: {
    success?: TOutput;
    error?: Error;
  };
}

export function capture<TOutput>(): CapturedPresenter<TOutput> {
  const state: { success?: TOutput; error?: Error } = {};
  return {
    presenter: {
      presentSuccess(output: TOutput) {
        state.success = output;
      },
      presentError(error: Error) {
        state.error = error;
      },
    },
    state,
  };
}
