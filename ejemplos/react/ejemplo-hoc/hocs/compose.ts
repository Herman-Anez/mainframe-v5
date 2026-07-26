import type { ComponentType } from "react";

type HOC = (Wrapped: ComponentType<any>) => ComponentType<any>;

// Type 5: composition utility. HOCs are just functions, so they compose
// like any other function — this is what lets you stack withLoading +
// withAuth + withLogger + withErrorBoundary into one enhanced component
// instead of nesting them by hand.
export function compose(...hocs: HOC[]): HOC {
  return (Component) => hocs.reduceRight((acc, hoc) => hoc(acc), Component);
}
