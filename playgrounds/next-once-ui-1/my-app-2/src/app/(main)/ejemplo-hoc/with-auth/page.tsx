"use client";

import { useState } from "react";
import Link from "next/link";
import { Column, Heading, Line, Row, Switch, Text } from "@once-ui-system/core";
import { UserCard } from "../components/UserCard";
import { withAuth } from "../hocs/withAuth";

const AuthedUserCard = withAuth(UserCard);

export default function WithAuthPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <Column fillWidth minHeight="100vh" horizontal="center" padding="l" gap="24">
      <Column maxWidth="m" gap="24">
        <Link href="/ejemplo-hoc">← back to index</Link>

        <Column gap="8">
          <Heading variant="display-strong-s">withAuth</Heading>
          <Text onBackground="neutral-weak">
            Gatekeeper / conditional-rendering HOC. It reads a prop (<code>isAuthenticated</code>)
            and decides whether the wrapped component renders at all — if not, it swaps in a
            fallback UI instead. <code>UserCard</code> itself never knows this check exists.
          </Text>
        </Column>

        <Line background="neutral-alpha-medium" />

        <Row gap="8" vertical="center">
          <Switch isChecked={isAuthenticated} onToggle={() => setIsAuthenticated((v) => !v)} />
          <Text>isAuthenticated</Text>
        </Row>

        <AuthedUserCard
          name="Ada Lovelace"
          email="ada@once-ui.com"
          role="admin"
          isAuthenticated={isAuthenticated}
        />

        <Text variant="label-default-s" onBackground="neutral-weak">
          Uncheck the switch: <code>UserCard</code> disappears and "Access denied" shows instead.
          This HOC is stateless — it re-evaluates the prop on every render, so toggling it back is
          always safe (unlike{" "}
          <Link href="/ejemplo-hoc/with-error-boundary">withErrorBoundary</Link>, which has its
          own internal memory).
        </Text>
      </Column>
    </Column>
  );
}
