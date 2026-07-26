"use client";

import { Component } from "react";
import type { ComponentType, ErrorInfo, ReactNode } from "react";

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

    // getDerivedStateFromError only ever sets hasError to true — nothing
    // resets it, so once tripped the fallback would stick forever even
    // after the parent passes props that would no longer throw. Give the
    // wrapped component a fresh render attempt on every prop update; if it
    // still throws, the boundary re-catches immediately on the same tick.
    componentDidUpdate(prevProps: Readonly<P>) {
      if (this.state.hasError && prevProps !== this.props) {
        this.setState({ hasError: false, error: undefined });
      }
    }

    render(): ReactNode {
      if (this.state.hasError) {
        return (
          <div
            role="alert"
            style={{
              padding: 16,
              borderRadius: 12,
              background: "#ef444422",
              color: "#b91c1c",
            }}
          >
            <strong>Something went wrong</strong>
            <div>{this.state.error?.message ?? "Unknown error"}</div>
          </div>
        );
      }

      return <Wrapped {...this.props} />;
    }
  }

  return WithErrorBoundary;
}
