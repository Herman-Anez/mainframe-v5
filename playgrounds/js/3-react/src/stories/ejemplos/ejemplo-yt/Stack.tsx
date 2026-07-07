import React from 'react';

interface StackProps {
  children?: React.ReactNode;
  spacing?: number;
  wrap?: boolean;
  direction?: "row" | "column";
}

function Stack({ children, spacing = 2, direction = "row", wrap = false }: StackProps) {
  const style: React.CSSProperties = {
    display: "flex",
    gap: `${spacing * 0.25}rem`,
    flexWrap: wrap ? "wrap" : "nowrap",
    flexDirection: direction,
  };
  return <div style={style}>{children}</div>;
}

export default Stack;
