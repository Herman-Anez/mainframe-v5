"use client";

import { useState } from "react";
import Link from "next/link";
import { Column, Heading, Line, Row, Switch, Text } from "@once-ui-system/core";
import { UserCard } from "../components/UserCard";
import { withLoading } from "../hocs/withLoading";

const LoadableUserCard = withLoading(UserCard);

export default function WithLoadingPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Column fillWidth minHeight="100vh" horizontal="center" padding="l" gap="24">
      <Column maxWidth="m" gap="24">
        <Link href="/ejemplo-hoc">← back to index</Link>

        <Column gap="8">
          <Heading variant="display-strong-s">withLoading</Heading>
          <Text onBackground="neutral-weak">
            Props-proxy HOC. It intercepts one prop (<code>isLoading</code>), and while it's
            truthy, renders a spinner instead of the wrapped component. Every other prop passes
            through unchanged — <code>UserCard</code> never sees <code>isLoading</code> itself.
          </Text>
        </Column>

        <Line background="neutral-alpha-medium" />

        <Row gap="8" vertical="center">
          <Switch isChecked={isLoading} onToggle={() => setIsLoading((v) => !v)} />
          <Text>isLoading</Text>
        </Row>

        <LoadableUserCard
          name="Ada Lovelace"
          email="ada@once-ui.com"
          role="admin"
          isLoading={isLoading}
        />

        <Text variant="label-default-s" onBackground="neutral-weak">
          Check the switch: the card is replaced by a spinner. Uncheck it: the card comes right
          back — this HOC holds no state of its own, it just proxies one prop.
        </Text>
      </Column>
    </Column>
  );
}
