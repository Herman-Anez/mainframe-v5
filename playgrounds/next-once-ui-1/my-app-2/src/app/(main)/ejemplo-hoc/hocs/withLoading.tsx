"use client";

import type { ComponentType } from "react";
import { Card, Row, Spinner, Text } from "@once-ui-system/core";

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
        <Card padding="16" radius="l" border="neutral-alpha-medium" fillWidth>
          <Row gap="8" vertical="center">
            <Spinner size="s" />
            <Text onBackground="neutral-weak">Loading user...</Text>
          </Row>
        </Card>
      );
    }

    return <Wrapped {...(rest as P)} />;
  }

  WithLoading.displayName = `withLoading(${Wrapped.displayName || Wrapped.name || "Component"})`;
  return WithLoading;
}
