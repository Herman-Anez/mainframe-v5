"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Column, Heading, Line, Row, Text } from "@once-ui-system/core";
import { UserCard, type UserCardProps } from "../components/UserCard";
import { withLogger } from "../hocs/withLogger";
import { withMemoComparison } from "../hocs/withMemoComparison";

// Ignores `debugId` on purpose: name/email/role are what actually matter
// for what gets displayed, so a debugId-only change shouldn't re-render.
function ignoreDebugId(prev: UserCardProps, next: UserCardProps): boolean {
  return (
    prev.name === next.name &&
    prev.email === next.email &&
    prev.role === next.role &&
    prev.avatarValue === next.avatarValue &&
    prev.simulateError === next.simulateError
  );
}

const PlainLoggedUserCard = withLogger(UserCard);
const MemoizedUserCard = withMemoComparison(withLogger(UserCard), ignoreDebugId);

export default function WithMemoComparisonPage() {
  const [tick, setTick] = useState(0);

  return (
    <Column fillWidth minHeight="100vh" horizontal="center" padding="l" gap="24">
      <Column maxWidth="m" gap="24">
        <Link href="/ejemplo-hoc">← back to index</Link>

        <Column gap="8">
          <Heading variant="display-strong-s">withMemoComparison</Heading>
          <Text onBackground="neutral-weak">
            Memoization HOC. Wraps <code>React.memo</code> with a custom equality function, so
            the wrapped component's render function is skipped entirely — not called, not diffed
            — when the parent re-renders but the props this comparator cares about haven't
            changed.
          </Text>
        </Column>

        <Line background="neutral-alpha-medium" />

        <Text onBackground="neutral-weak">
          Both cards below get the same name/email/role, plus a <code>debugId</code> that changes
          on every click. The plain card re-renders every time. The memoized card's comparator
          ignores <code>debugId</code>, so React never calls its render function again — the
          number frozen on screen is stale on purpose.
        </Text>

        <Row>
          <Button size="s" onClick={() => setTick((t) => t + 1)}>
            Force parent re-render (tick: {tick})
          </Button>
        </Row>

        <Row gap="16" wrap>
          <Column gap="8" flex={1}>
            <Text variant="label-default-s" onBackground="neutral-weak">
              Plain (re-renders every tick)
            </Text>
            <PlainLoggedUserCard
              name="Grace Hopper"
              email="grace@once-ui.com"
              role="engineer"
              debugId={tick}
            />
          </Column>
          <Column gap="8" flex={1}>
            <Text variant="label-default-s" onBackground="neutral-weak">
              Memoized (ignores debugId changes)
            </Text>
            <MemoizedUserCard
              name="Grace Hopper"
              email="grace@once-ui.com"
              role="engineer"
              debugId={tick}
            />
          </Column>
        </Row>

        <Text variant="label-default-s" onBackground="neutral-weak">
          Open the console: withLogger fires a new render log for the plain card on every click,
          but stays silent for the memoized one.
        </Text>
      </Column>
    </Column>
  );
}
