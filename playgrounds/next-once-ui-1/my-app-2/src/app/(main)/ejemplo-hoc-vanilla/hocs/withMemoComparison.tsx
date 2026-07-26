"use client";

import { memo } from "react";
import type { ComponentType } from "react";

// Type 5: memoization HOC. Wraps React.memo with a custom equality
// function, so the wrapped component skips re-rendering entirely (its
// function body never runs) when the parent re-renders but the props this
// comparator cares about haven't changed — even if other props did.
export function withMemoComparison<P extends object>(
  Wrapped: ComponentType<P>,
  arePropsEqual: (prev: Readonly<P>, next: Readonly<P>) => boolean,
) {
  const Memoized = memo(Wrapped, arePropsEqual);
  Memoized.displayName = `withMemoComparison(${Wrapped.displayName || Wrapped.name || "Component"})`;
  return Memoized;
}
