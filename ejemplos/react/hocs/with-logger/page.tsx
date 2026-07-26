"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCard } from "../components/UserCard";
import { withLogger } from "../hocs/withLogger";
import * as s from "../styles";

const LoggedUserCard = withLogger(UserCard);

const people = [
  { name: "Ada Lovelace", email: "ada@example.com", role: "admin" },
  { name: "Grace Hopper", email: "grace@example.com", role: "engineer" },
  { name: "Katherine Johnson", email: "katherine@example.com", role: "scientist" },
];

export default function WithLoggerPage() {
  const [mounted, setMounted] = useState(true);
  const [personIndex, setPersonIndex] = useState(0);
  const person = people[personIndex];

  return (
    <main style={s.page}>
      <Link href="/ejemplo-hoc-vanilla" style={s.backLink}>
        ← back to index
      </Link>

      <div style={s.stack}>
        <h1 style={s.title}>withLogger</h1>
        <p style={s.description}>
          Behavior-injection HOC. It adds a cross-cutting concern — logging mount, unmount, and
          every render with the current props — using <code>useEffect</code> inside a wrapper
          function component. <code>UserCard</code>'s own JSX never changes.
        </p>
        <p style={s.note}>Open the browser console to see the log lines this page produces.</p>
      </div>

      <hr style={s.divider} />

      <div style={s.controlsRow}>
        <label style={s.checkboxLabel}>
          <input type="checkbox" checked={mounted} onChange={() => setMounted((v) => !v)} />
          mounted
        </label>
        <button
          type="button"
          onClick={() => setPersonIndex((i) => (i + 1) % people.length)}
          disabled={!mounted}
        >
          Change props (next person)
        </button>
      </div>

      {mounted ? (
        <LoggedUserCard name={person.name} email={person.email} role={person.role} />
      ) : (
        <p style={s.note}>Unmounted — check the console for the "unmounted" log line.</p>
      )}

      <p style={s.note}>
        Unchecking "mounted" logs <code>... unmounted</code>. Clicking "Change props" logs a new{" "}
        <code>render #N</code> line with the updated props, and you'll see the card's name/email
        update on screen at the same time — the log always matches what's rendered.
      </p>
    </main>
  );
}
