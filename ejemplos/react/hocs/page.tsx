import Link from "next/link";
import * as s from "./styles";

const examples = [
  {
    href: "/ejemplo-hoc-vanilla/with-auth",
    title: "withAuth",
    blurb: "Gatekeeper HOC. Reads a prop and decides whether the wrapped component renders at all.",
  },
  {
    href: "/ejemplo-hoc-vanilla/with-loading",
    title: "withLoading",
    blurb: "Props-proxy HOC. Intercepts one prop and swaps in a fallback UI while it's truthy.",
  },
  {
    href: "/ejemplo-hoc-vanilla/with-logger",
    title: "withLogger",
    blurb: "Behavior-injection HOC. Adds mount/unmount/render logging via hooks, no markup changes.",
  },
  {
    href: "/ejemplo-hoc-vanilla/with-error-boundary",
    title: "withErrorBoundary",
    blurb: "Class-based HOC. The one shape hooks can't replace — catches render errors.",
  },
  {
    href: "/ejemplo-hoc-vanilla/with-memo-comparison",
    title: "withMemoComparison",
    blurb: "Memoization HOC. Custom equality function decides whether a re-render even happens.",
  },
  {
    href: "/ejemplo-hoc-vanilla/compose",
    title: "compose",
    blurb: "Stacks all of the above onto one component and shows why the order matters.",
  },
];

export default function EjemploHocVanillaIndexPage() {
  return (
    <main style={s.page}>
      <div style={s.stack}>
        <h1 style={s.title}>HOC patterns (vanilla)</h1>
        <p style={s.description}>
          Same dumb component, <code>UserCard</code>, wrapped by a different higher-order
          component on each page below. No design-system components anywhere in this folder —
          plain HTML + CSS only.
        </p>
      </div>

      <ul style={{ display: "flex", flexDirection: "column", gap: 16, padding: 0, margin: 0, listStyle: "none" }}>
        {examples.map((example) => (
          <li key={example.href}>
            <Link href={example.href} style={{ fontWeight: 600 }}>
              {example.title}
            </Link>
            <p style={{ ...s.description, marginTop: 4 }}>{example.blurb}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
