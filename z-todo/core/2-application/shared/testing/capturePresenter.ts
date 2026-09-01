import { OutputBoundary } from '../OutputBoundary';

export interface CapturedPresenter<TOutput> {
  presenter: OutputBoundary<TOutput>;
  state: {
    success?: TOutput;
    error?: Error;
    /** Qué método se llamó — útil cuando TOutput es `void` y `success` queda `undefined`. */
    settled?: 'success' | 'error';
  };
}

export function capture<TOutput>(): CapturedPresenter<TOutput> {
  const state: CapturedPresenter<TOutput>['state'] = {};
  return {
    presenter: {
      presentSuccess(output: TOutput) {
        state.success = output;
        state.settled = 'success';
      },
      presentError(error: Error) {
        state.error = error;
        state.settled = 'error';
      },
    },
    state,
  };
}
