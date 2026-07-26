import type { CSSProperties } from "react";

export const page: CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  padding: 24,
  display: "flex",
  flexDirection: "column",
  gap: 24,
};

export const stack: CSSProperties = { display: "flex", flexDirection: "column", gap: 8 };

export const title: CSSProperties = { fontSize: 22, margin: 0 };

export const subtitle: CSSProperties = { fontSize: 18, margin: 0 };

export const description: CSSProperties = { opacity: 0.7, margin: 0 };

export const note: CSSProperties = { fontSize: 13, opacity: 0.7, margin: 0 };

export const divider: CSSProperties = { border: "none", borderTop: "1px solid #3333" };

export const checkboxLabel: CSSProperties = { display: "flex", gap: 8, alignItems: "center" };

export const controlsRow: CSSProperties = { display: "flex", gap: 24, flexWrap: "wrap" };

export const backLink: CSSProperties = { fontSize: 13, opacity: 0.7 };
