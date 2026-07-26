"use client";

import { useState } from "react";
import { Button, Column, Heading, Line, Row, Switch, Text } from "@once-ui-system/core";
import { UserCard, type UserCardProps } from "./components/UserCard";
import { withLoading } from "./hocs/withLoading";
import { withAuth } from "./hocs/withAuth";
import { withLogger } from "./hocs/withLogger";
import { withErrorBoundary } from "./hocs/withErrorBoundary";
import { withMemoComparison } from "./hocs/withMemoComparison";
import { compose } from "./hocs/compose";

// HOCs must be composed at module scope, not inside the component body.
// Calling withX(Component) on every render would produce a new component
// type each time -> React unmounts/remounts the subtree instead of
// reconciling it (loses state, retriggers effects).
const EnhancedUserCard = compose(
  withErrorBoundary, // outermost: catches throws from everything below it
  withAuth,
  withLoading,
  withLogger, // innermost: logs right before the dumb component renders
)(UserCard);

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

export default function EjemploHocPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [tick, setTick] = useState(0);

  return (
    <Column fillWidth minHeight="100vh" horizontal="center" padding="l" gap="24">
      <Column maxWidth="m" gap="24">
        <Column gap="8">
          <Heading variant="display-strong-s">HOC patterns over a dumb component</Heading>
          <Text onBackground="neutral-weak">
            <code>UserCard</code> is a pure presentational component. Everything below is added
            by wrapping it in higher-order components — no JSX in UserCard itself changes.
          </Text>
        </Column>

        <Row gap="24" wrap>
          <Row gap="8" vertical="center">
            <Switch isChecked={isAuthenticated} onToggle={() => setIsAuthenticated((v) => !v)} />
            <Text>isAuthenticated (withAuth)</Text>
          </Row>
          <Row gap="8" vertical="center">
            <Switch isChecked={isLoading} onToggle={() => setIsLoading((v) => !v)} />
            <Text>isLoading (withLoading)</Text>
          </Row>
          <Row gap="8" vertical="center">
            <Switch isChecked={simulateError} onToggle={() => setSimulateError((v) => !v)} />
            <Text>simulateError (withErrorBoundary)</Text>
          </Row>
        </Row>

        <Line background="neutral-alpha-medium" />

        <EnhancedUserCard
          name="Ada Lovelace"
          email="ada@once-ui.com"
          role="admin"
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          simulateError={simulateError}
        />

        <Column gap="8">
          <Text variant="label-default-s" onBackground="neutral-weak">
            Open the console to see withLogger output. Toggling simulateError throws inside
            UserCard's render — withErrorBoundary is the only HOC here that must be a class
            component, since getDerivedStateFromError has no hook equivalent.
          </Text>
        </Column>

        <Line background="neutral-alpha-medium" />

        <Column gap="8">
          <Heading variant="heading-strong-m">withMemoComparison: skip re-render on purpose</Heading>
          <Text onBackground="neutral-weak">
            Both cards below get the same name/email/role, plus a <code>debugId</code> that
            changes on every click. The plain card re-renders (and repaints its debugId) every
            time. The memoized card's custom comparator ignores <code>debugId</code>, so React
            never calls its render function again — the number frozen on screen is stale on
            purpose.
          </Text>
          <Row gap="12" vertical="center">
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
        </Column>
      </Column>
    </Column>
  );
}
