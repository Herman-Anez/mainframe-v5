"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCard } from "../components/UserCard";
import { withErrorBoundary } from "../hocs/withErrorBoundary";
import * as s from "../styles";

const SafeUserCard = withErrorBoundary(UserCard);

export default function WithErrorBoundaryPage() {
  const [simulateError, setSimulateError] = useState(false);

  return (
    <main style={s.page}>
      <Link href="/ejemplo-hoc-vanilla" style={s.backLink}>
        ← back to index
      </Link>

      <div style={s.stack}>
        <h1 style={s.title}>withErrorBoundary</h1>
        <p style={s.description}>
          Class-based HOC. Error boundaries only exist as class components —{" "}
          <code>getDerivedStateFromError</code> and <code>componentDidCatch</code> have no hook
          equivalent — so this is the one HOC shape functions and hooks can't replace.
        </p>
      </div>

      <hr style={s.divider} />

      <label style={s.checkboxLabel}>
        <input
          type="checkbox"
          checked={simulateError}
          onChange={() => setSimulateError((v) => !v)}
        />
        simulateError
      </label>

      <SafeUserCard
        name="Ada Lovelace"
        email="ada@example.com"
        role="admin"
        simulateError={simulateError}
      />

      <div style={s.stack}>
        <p style={s.note}>
          Checking the box makes <code>UserCard</code> throw during render. In dev mode Next.js
          will also pop up a red "Console Error" overlay — that's expected: the boundary's{" "}
          <code>componentDidCatch</code> logs via <code>console.error</code> on purpose, so the
          error is never silently swallowed, even though the fallback UI already handled it.
        </p>
        <p style={s.note}>
          Uncheck the box: the card comes back. The boundary resets its own error state whenever
          it receives new props, giving <code>UserCard</code> a fresh render attempt each time —
          without that, the fallback would stick forever once triggered.
        </p>
      </div>
    </main>
  );
}
