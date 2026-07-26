"use client";

import type { ComponentType } from "react";
import { Feedback } from "@once-ui-system/core";

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
        <Feedback
          variant="danger"
          title="Access denied"
          description="You must be authenticated to view this content."
        />
      );
    }

    return <Wrapped {...(rest as P)} />;
  }

  WithAuth.displayName = `withAuth(${Wrapped.displayName || Wrapped.name || "Component"})`;
  return WithAuth;
}
