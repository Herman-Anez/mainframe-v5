"use client";

import { useState } from "react";
import Link from "next/link";
import { Column, Heading, Line, Row, Switch, Text } from "@once-ui-system/core";
import { UserCard } from "../components/UserCard";
import { withLoading } from "../hocs/withLoading";
import { withAuth } from "../hocs/withAuth";
import { withLogger } from "../hocs/withLogger";
import { withErrorBoundary } from "../hocs/withErrorBoundary";
import { compose } from "../hocs/compose";

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

export default function ComposePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [simulateError, setSimulateError] = useState(false);

  return (
    <Column fillWidth minHeight="100vh" horizontal="center" padding="l" gap="24">
      <Column maxWidth="m" gap="24">
        <Link href="/ejemplo-hoc">← back to index</Link>

        <Column gap="8">
          <Heading variant="display-strong-s">compose</Heading>
          <Text onBackground="neutral-weak">
            HOCs are just functions, so they compose like any other function. This page stacks{" "}
            <code>withErrorBoundary</code>, <code>withAuth</code>, <code>withLoading</code> and{" "}
            <code>withLogger</code> onto <code>UserCard</code> with one call instead of nesting
            them by hand.
          </Text>
          <Column
            as="pre"
            padding="12"
            radius="m"
            background="neutral-alpha-weak"
            style={{ overflowX: "auto" }}
          >
            <Text variant="code-default-s">
              {`compose(\n  withErrorBoundary, // outermost: catches throws from everything below\n  withAuth,\n  withLoading,\n  withLogger,        // innermost: logs right before UserCard renders\n)(UserCard)`}
            </Text>
          </Column>
        </Column>

        <Line background="neutral-alpha-medium" />

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

        <EnhancedUserCard
          name="Ada Lovelace"
          email="ada@once-ui.com"
          role="admin"
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          simulateError={simulateError}
        />

        <Text variant="label-default-s" onBackground="neutral-weak">
          Order matters: <code>withErrorBoundary</code> has to be outermost so it can catch
          throws from <code>withAuth</code>, <code>withLoading</code>, <code>withLogger</code>{" "}
          and <code>UserCard</code> itself — a boundary can only catch errors from components{" "}
          <em>below</em> it in the tree.
        </Text>
      </Column>
    </Column>
  );
}
