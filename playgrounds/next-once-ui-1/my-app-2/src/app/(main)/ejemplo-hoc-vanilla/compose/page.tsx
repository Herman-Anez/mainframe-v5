"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCard } from "../components/UserCard";
import { withLoading } from "../hocs/withLoading";
import { withAuth } from "../hocs/withAuth";
import { withLogger } from "../hocs/withLogger";
import { withErrorBoundary } from "../hocs/withErrorBoundary";
import { compose } from "../hocs/compose";
import * as s from "../styles";

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
    <main style={s.page}>
      <Link href="/ejemplo-hoc-vanilla" style={s.backLink}>
        ← back to index
      </Link>

      <div style={s.stack}>
        <h1 style={s.title}>compose</h1>
        <p style={s.description}>
          HOCs are just functions, so they compose like any other function. This page stacks{" "}
          <code>withErrorBoundary</code>, <code>withAuth</code>, <code>withLoading</code> and{" "}
          <code>withLogger</code> onto <code>UserCard</code> with one call instead of nesting
          them by hand.
        </p>
        <pre
          style={{
            background: "#0000000d",
            padding: 12,
            borderRadius: 8,
            fontSize: 13,
            overflowX: "auto",
          }}
        >
          {`compose(\n  withErrorBoundary, // outermost: catches throws from everything below\n  withAuth,\n  withLoading,\n  withLogger,        // innermost: logs right before UserCard renders\n)(UserCard)`}
        </pre>
      </div>

      <hr style={s.divider} />

      <div style={s.controlsRow}>
        <label style={s.checkboxLabel}>
          <input
            type="checkbox"
            checked={isAuthenticated}
            onChange={() => setIsAuthenticated((v) => !v)}
          />
          isAuthenticated (withAuth)
        </label>
        <label style={s.checkboxLabel}>
          <input type="checkbox" checked={isLoading} onChange={() => setIsLoading((v) => !v)} />
          isLoading (withLoading)
        </label>
        <label style={s.checkboxLabel}>
          <input
            type="checkbox"
            checked={simulateError}
            onChange={() => setSimulateError((v) => !v)}
          />
          simulateError (withErrorBoundary)
        </label>
      </div>

      <EnhancedUserCard
        name="Ada Lovelace"
        email="ada@example.com"
        role="admin"
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        simulateError={simulateError}
      />

      <p style={s.note}>
        Order matters: <code>withErrorBoundary</code> has to be outermost so it can catch throws
        from <code>withAuth</code>, <code>withLoading</code>, <code>withLogger</code> and{" "}
        <code>UserCard</code> itself — a boundary can only catch errors from components{" "}
        <em>below</em> it in the tree.
      </p>
    </main>
  );
}
