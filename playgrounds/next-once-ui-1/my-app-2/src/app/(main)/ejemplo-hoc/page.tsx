import { Column, Heading, Line, Text } from "@once-ui-system/core";
import Link from "next/link";

const examples = [
  {
    href: "/ejemplo-hoc/with-auth",
    title: "withAuth",
    blurb: "Gatekeeper HOC. Reads a prop and decides whether the wrapped component renders at all.",
  },
  {
    href: "/ejemplo-hoc/with-loading",
    title: "withLoading",
    blurb: "Props-proxy HOC. Intercepts one prop and swaps in a fallback UI while it's truthy.",
  },
  {
    href: "/ejemplo-hoc/with-logger",
    title: "withLogger",
    blurb: "Behavior-injection HOC. Adds mount/unmount/render logging via hooks, no markup changes.",
  },
  {
    href: "/ejemplo-hoc/with-error-boundary",
    title: "withErrorBoundary",
    blurb: "Class-based HOC. The one shape hooks can't replace — catches render errors.",
  },
  {
    href: "/ejemplo-hoc/with-memo-comparison",
    title: "withMemoComparison",
    blurb: "Memoization HOC. Custom equality function decides whether a re-render even happens.",
  },
  {
    href: "/ejemplo-hoc/compose",
    title: "compose",
    blurb: "Stacks all of the above onto one component and shows why the order matters.",
  },
];

export default function EjemploHocIndexPage() {
  return (
    <Column fillWidth minHeight="100vh" horizontal="center" padding="l" gap="24">
      <Column maxWidth="m" gap="24">
        <Column gap="8">
          <Heading variant="display-strong-s">HOC patterns (once-ui)</Heading>
          <Text onBackground="neutral-weak">
            Same dumb component, <code>UserCard</code>, wrapped by a different higher-order
            component on each page below.
          </Text>
        </Column>

        <Line background="neutral-alpha-medium" />

        <Column gap="16">
          {examples.map((example) => (
            <Column key={example.href} gap="4">
              <Link href={example.href} style={{ fontWeight: 600 }}>
                {example.title}
              </Link>
              <Text onBackground="neutral-weak" variant="body-default-s">
                {example.blurb}
              </Text>
            </Column>
          ))}
        </Column>
      </Column>
    </Column>
  );
}
