"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCard } from "../components/UserCard";
import { withAuth } from "../hocs/withAuth";
import * as s from "../styles";

const AuthedUserCard = withAuth(UserCard);

export default function WithAuthPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <main style={s.page}>
      <Link href="/ejemplo-hoc-vanilla" style={s.backLink}>
        ← back to index
      </Link>

      <div style={s.stack}>
        <h1 style={s.title}>withAuth</h1>
        <p style={s.description}>
          Gatekeeper / conditional-rendering HOC. It reads a prop (<code>isAuthenticated</code>)
          and decides whether the wrapped component renders at all — if not, it swaps in a
          fallback UI instead. <code>UserCard</code> itself never knows this check exists.
        </p>
      </div>

      <hr style={s.divider} />

      <label style={s.checkboxLabel}>
        <input
          type="checkbox"
          checked={isAuthenticated}
          onChange={() => setIsAuthenticated((v) => !v)}
        />
        isAuthenticated
      </label>

      <AuthedUserCard
        name="Ada Lovelace"
        email="ada@example.com"
        role="admin"
        isAuthenticated={isAuthenticated}
      />

      <p style={s.note}>
        Uncheck the box: <code>UserCard</code> disappears and "Access denied" shows instead. This
        HOC is stateless — it re-evaluates the prop on every render, so toggling it back is always
        safe (unlike <Link href="/ejemplo-hoc-vanilla/with-error-boundary">withErrorBoundary</Link>,
        which has its own internal memory).
      </p>
    </main>
  );
}
