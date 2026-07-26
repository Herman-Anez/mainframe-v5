"use client";

import { Component } from "react";
import type { ComponentType, ErrorInfo, ReactNode } from "react";
import { Feedback } from "@once-ui-system/core";

interface State {
  hasError: boolean;
  error?: Error;
}

// Type 4: class-based HOC. Error boundaries only exist as class components
// (getDerivedStateFromError / componentDidCatch have no hook equivalent),
// so this is the one HOC shape hooks cannot replace.
export function withErrorBoundary<P extends object>(Wrapped: ComponentType<P>) {
  class WithErrorBoundary extends Component<P, State> {
    static displayName = `withErrorBoundary(${Wrapped.displayName || Wrapped.name || "Component"})`;

    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
      console.error("[withErrorBoundary] caught:", error, info.componentStack);
    }

    render(): ReactNode {
      if (this.state.hasError) {
        return (
          <Feedback
            variant="danger"
            title="Something went wrong"
            description={this.state.error?.message ?? "Unknown error"}
          />
        );
      }

      return <Wrapped {...this.props} />;
    }
  }

  return WithErrorBoundary;
}
