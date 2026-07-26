"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCard, type UserCardProps } from "../components/UserCard";
import { withLogger } from "../hocs/withLogger";
import { withMemoComparison } from "../hocs/withMemoComparison";
import * as s from "../styles";

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
    <main style={s.page}>
      <Link href="/ejemplo-hoc-vanilla" style={s.backLink}>
        ← back to index
      </Link>

      <div style={s.stack}>
        <h1 style={s.title}>withMemoComparison</h1>
        <p style={s.description}>
          Memoization HOC. Wraps <code>React.memo</code> with a custom equality function, so the
          wrapped component's render function is skipped entirely — not called, not diffed —
          when the parent re-renders but the props this comparator cares about haven't changed.
        </p>
      </div>

      <hr style={s.divider} />

      <p style={s.description}>
        Both cards below get the same name/email/role, plus a <code>debugId</code> that changes
        on every click. The plain card re-renders every time. The memoized card's comparator
        ignores <code>debugId</code>, so React never calls its render function again — the number
        frozen on screen is stale on purpose.
      </p>

      <div>
        <button type="button" onClick={() => setTick((t) => t + 1)}>
          Force parent re-render (tick: {tick})
        </button>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ ...s.stack, flex: 1 }}>
          <span style={s.note}>Plain (re-renders every tick)</span>
          <PlainLoggedUserCard
            name="Grace Hopper"
            email="grace@example.com"
            role="engineer"
            debugId={tick}
          />
        </div>
        <div style={{ ...s.stack, flex: 1 }}>
          <span style={s.note}>Memoized (ignores debugId changes)</span>
          <MemoizedUserCard
            name="Grace Hopper"
            email="grace@example.com"
            role="engineer"
            debugId={tick}
          />
        </div>
      </div>

      <p style={s.note}>
        Open the console: withLogger fires a new render log for the plain card on every click, but
        stays silent for the memoized one.
      </p>
    </main>
  );
}
