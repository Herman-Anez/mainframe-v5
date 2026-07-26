"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Column, Heading, Line, Row, Switch, Text } from "@once-ui-system/core";
import { UserCard } from "../components/UserCard";
import { withLogger } from "../hocs/withLogger";

const LoggedUserCard = withLogger(UserCard);

const people = [
  { name: "Ada Lovelace", email: "ada@once-ui.com", role: "admin" },
  { name: "Grace Hopper", email: "grace@once-ui.com", role: "engineer" },
  { name: "Katherine Johnson", email: "katherine@once-ui.com", role: "scientist" },
];

export default function WithLoggerPage() {
  const [mounted, setMounted] = useState(true);
  const [personIndex, setPersonIndex] = useState(0);
  const person = people[personIndex];

  return (
    <Column fillWidth minHeight="100vh" horizontal="center" padding="l" gap="24">
      <Column maxWidth="m" gap="24">
        <Link href="/ejemplo-hoc">← back to index</Link>

        <Column gap="8">
          <Heading variant="display-strong-s">withLogger</Heading>
          <Text onBackground="neutral-weak">
            Behavior-injection HOC. It adds a cross-cutting concern — logging mount, unmount, and
            every render with the current props — using <code>useEffect</code> inside a wrapper
            function component. <code>UserCard</code>'s own JSX never changes.
          </Text>
          <Text variant="label-default-s" onBackground="neutral-weak">
            Open the browser console to see the log lines this page produces.
          </Text>
        </Column>

        <Line background="neutral-alpha-medium" />

        <Row gap="24" wrap vertical="center">
          <Row gap="8" vertical="center">
            <Switch isChecked={mounted} onToggle={() => setMounted((v) => !v)} />
            <Text>mounted</Text>
          </Row>
          <Button
            size="s"
            disabled={!mounted}
            onClick={() => setPersonIndex((i) => (i + 1) % people.length)}
          >
            Change props (next person)
          </Button>
        </Row>

        {mounted ? (
          <LoggedUserCard name={person.name} email={person.email} role={person.role} />
        ) : (
          <Text variant="label-default-s" onBackground="neutral-weak">
            Unmounted — check the console for the "unmounted" log line.
          </Text>
        )}

        <Text variant="label-default-s" onBackground="neutral-weak">
          Unchecking "mounted" logs <code>... unmounted</code>. Clicking "Change props" logs a new{" "}
          <code>render #N</code> line with the updated props, and you'll see the card's name/email
          update on screen at the same time — the log always matches what's rendered.
        </Text>
      </Column>
    </Column>
  );
}
