"use client";

import type { ComponentType } from "react";
import { useEffect, useRef } from "react";

// Type 3: behavior-injection HOC. Adds a cross-cutting concern (logging
// mount/unmount/render) via hooks, without touching the wrapped component's
// markup or props contract.
export function withLogger<P extends object>(Wrapped: ComponentType<P>) {
  const name = Wrapped.displayName || Wrapped.name || "Component";

  function WithLogger(props: P) {
    const renderCount = useRef(0);
    renderCount.current += 1;

    useEffect(() => {
      console.log(`[withLogger] ${name} mounted`);
      return () => console.log(`[withLogger] ${name} unmounted`);
    }, []);

    useEffect(() => {
      console.log(`[withLogger] ${name} render #${renderCount.current}`, props);
    });

    return <Wrapped {...props} />;
  }

  WithLogger.displayName = `withLogger(${name})`;
  return WithLogger;
}
