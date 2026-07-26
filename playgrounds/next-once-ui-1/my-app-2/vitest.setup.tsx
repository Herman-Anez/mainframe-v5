import "@testing-library/jest-dom/vitest";
import type { ReactNode } from "react";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// The real @once-ui-system/core package resolves to a broken "dist/dist/..."
// path under Vite/jsdom (works fine inside Next.js's own bundler, but not
// here). Unit tests only care about the HOCs' own logic, not the design
// system's internals, so every export is swapped for a generic passthrough
// that still renders `title`/`description`/`children` as visible text.
vi.mock("@once-ui-system/core", () => {
  function GenericComponent({
    children,
    title,
    description,
    ...rest
  }: {
    children?: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
  } & Record<string, unknown>) {
    return (
      <div {...rest}>
        {title !== undefined && <span>{title}</span>}
        {description !== undefined && <span>{description}</span>}
        {children}
      </div>
    );
  }

  // Vitest's ESM mock needs a statically enumerable export list (a Proxy's
  // dynamic `get` isn't picked up when it builds the module namespace), so
  // every component this playground actually imports is listed explicitly.
  const exportNames = [
    "Avatar",
    "Button",
    "Card",
    "Column",
    "Feedback",
    "Heading",
    "Line",
    "Row",
    "Spinner",
    "Switch",
    "Tag",
    "Text",
  ];

  return Object.fromEntries(exportNames.map((name) => [name, GenericComponent]));
});
