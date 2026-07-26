// @ts-nocheck
"use client";

import type { ComponentType } from "react";

export interface WithLoadingProps {
  isLoading?: boolean;
}

// Type 1: props-proxy HOC. Intercepts a prop (`isLoading`), short-circuits
// rendering, and otherwise passes everything through unchanged.
export function withLoading<P extends object>(Wrapped: ComponentType<P>) {
  function WithLoading(props: P & WithLoadingProps) {
    const { isLoading, ...rest } = props;

    if (isLoading) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: 16,
            border: "1px solid #3333",
            borderRadius: 12,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 16,
              height: 16,
              border: "2px solid #6366f1",
              borderTopColor: "transparent",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.6s linear infinite",
            }}
          />
          <span style={{ opacity: 0.7 }}>Loading user...</span>
          <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
        </div>
      );
    }

    return <Wrapped {...(props as P)} />;
  }

  WithLoading.displayName = `withLoading(${Wrapped.displayName || Wrapped.name || "Component"})`;
  return WithLoading;
}
