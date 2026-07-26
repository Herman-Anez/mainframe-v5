"use client";

import type { ComponentType } from "react";

export interface WithAuthProps {
  isAuthenticated?: boolean;
}

// Type 2: conditional-rendering / gatekeeper HOC. Reads a prop and decides
// whether the wrapped component renders at all, swapping in a fallback UI.
export function withAuth<P extends object>(Wrapped: ComponentType<P>) {
  function WithAuth(props: P & WithAuthProps) {
    const { isAuthenticated, ...rest } = props;

    if (!isAuthenticated) {
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
          <strong>Access denied</strong>
          <div>You must be authenticated to view this content.</div>
        </div>
      );
    }

    return <Wrapped {...(rest as P)} />;
  }

  WithAuth.displayName = `withAuth(${Wrapped.displayName || Wrapped.name || "Component"})`;
  return WithAuth;
}
