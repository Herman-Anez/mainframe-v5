"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCard } from "../components/UserCard";
import { withLoading } from "../hocs/withLoading";
import * as s from "../styles";

const LoadableUserCard = withLoading(UserCard);

export default function WithLoadingPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main style={s.page}>
      <Link href="/ejemplo-hoc-vanilla" style={s.backLink}>
        ← back to index
      </Link>

      <div style={s.stack}>
        <h1 style={s.title}>withLoading</h1>
        <p style={s.description}>
          Props-proxy HOC. It intercepts one prop (<code>isLoading</code>), and while it's
          truthy, renders a spinner instead of the wrapped component. Every other prop passes
          through unchanged — <code>UserCard</code> never sees <code>isLoading</code> itself.
        </p>
      </div>

      <hr style={s.divider} />

      <label style={s.checkboxLabel}>
        <input type="checkbox" checked={isLoading} onChange={() => setIsLoading((v) => !v)} />
        isLoading
      </label>

      <LoadableUserCard
        name="Ada Lovelace"
        email="ada@example.com"
        role="admin"
        isLoading={isLoading}
      />

      <p style={s.note}>
        Check the box: the card is replaced by a spinner. Uncheck it: the card comes right back —
        this HOC holds no state of its own, it just proxies one prop.
      </p>
    </main>
  );
}
