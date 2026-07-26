"use client";

import { useState } from "react";
import Link from "next/link";
import { Column, Heading, Line, Row, Switch, Text } from "@once-ui-system/core";
import { UserCard } from "../components/UserCard";
import { withErrorBoundary } from "../hocs/withErrorBoundary";

const SafeUserCard = withErrorBoundary(UserCard);

export default function WithErrorBoundaryPage() {
  const [simulateError, setSimulateError] = useState(false);

  return (
    <Column fillWidth minHeight="100vh" horizontal="center" padding="l" gap="24">
      <Column maxWidth="m" gap="24">
        <Link href="/ejemplo-hoc">← back to index</Link>

        <Column gap="8">
          <Heading variant="display-strong-s">withErrorBoundary</Heading>
          <Text onBackground="neutral-weak">
            Class-based HOC. Error boundaries only exist as class components —{" "}
            <code>getDerivedStateFromError</code> and <code>componentDidCatch</code> have no hook
            equivalent — so this is the one HOC shape functions and hooks can't replace.
          </Text>
        </Column>

        <Line background="neutral-alpha-medium" />

        <Row gap="8" vertical="center">
          <Switch isChecked={simulateError} onToggle={() => setSimulateError((v) => !v)} />
          <Text>simulateError</Text>
        </Row>

        <SafeUserCard
          name="Ada Lovelace"
          email="ada@once-ui.com"
          role="admin"
          simulateError={simulateError}
        />

        <Column gap="8">
          <Text variant="label-default-s" onBackground="neutral-weak">
            Checking the switch makes <code>UserCard</code> throw during render. In dev mode
            Next.js will also pop up a red "Console Error" overlay — that's expected: the
            boundary's <code>componentDidCatch</code> logs via <code>console.error</code> on
            purpose, so the error is never silently swallowed, even though the fallback UI
            already handled it.
          </Text>
          <Text variant="label-default-s" onBackground="neutral-weak">
            Uncheck the switch: the card comes back. The boundary resets its own error state
            whenever it receives new props, giving <code>UserCard</code> a fresh render attempt
            each time — without that, the fallback would stick forever once triggered.
          </Text>
        </Column>
      </Column>
    </Column>
  );
}
