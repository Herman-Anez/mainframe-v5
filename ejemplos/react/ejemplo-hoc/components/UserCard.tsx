import { Avatar, Card, Column, Row, Tag, Text } from "@once-ui-system/core";

export interface UserCardProps {
  name: string;
  email: string;
  role: string;
  avatarValue?: string;
  /** When true, throws during render — used to demo withErrorBoundary. */
  simulateError?: boolean;
  /** Unrelated metadata (e.g. a request id) — used to demo withMemoComparison. */
  debugId?: number | string;
}

// Dumb / presentational component: no state, no effects, no context.
// Pure function of its props -> JSX. All behavior comes from HOCs wrapping it.
export function UserCard({
  name,
  email,
  role,
  avatarValue,
  simulateError,
  debugId,
}: UserCardProps) {
  if (simulateError) {
    throw new Error("Simulated render error inside <UserCard />");
  }

  return (
    <Card padding="16" radius="l" border="neutral-alpha-medium" fillWidth>
      <Row gap="12" vertical="center">
        <Avatar size="m" value={avatarValue ?? name.slice(0, 2)} />
        <Column gap="4">
          <Text variant="body-strong-m">{name}</Text>
          <Text variant="body-default-s" onBackground="neutral-weak">
            {email}
          </Text>
          <Tag size="s">{role}</Tag>
          {debugId !== undefined && (
            <Text variant="label-default-s" onBackground="neutral-weak">
              last rendered at debugId: {debugId}
            </Text>
          )}
        </Column>
      </Row>
    </Card>
  );
}
