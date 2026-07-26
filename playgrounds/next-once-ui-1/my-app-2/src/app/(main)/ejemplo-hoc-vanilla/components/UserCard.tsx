import styles from "./UserCard.module.css";

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

// Dumb / presentational component: no state, no effects, no context, no
// design-system dependency — plain HTML + CSS module. All behavior comes
// from HOCs wrapping it.
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
    <div className={styles.card}>
      <div className={styles.avatar}>{(avatarValue ?? name).slice(0, 2).toUpperCase()}</div>
      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        <span className={styles.email}>{email}</span>
        <span className={styles.role}>{role}</span>
        {debugId !== undefined && (
          <span className={styles.debugId}>last rendered at debugId: {debugId}</span>
        )}
      </div>
    </div>
  );
}
