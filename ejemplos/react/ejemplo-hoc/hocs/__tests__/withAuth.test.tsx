import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { withAuth } from "../withAuth";

function Dummy({ label }: { label: string }) {
  return <div data-testid="dummy">{label}</div>;
}

const WrappedDummy = withAuth(Dummy);

describe("withAuth", () => {
  it("renders the wrapped component when isAuthenticated is true", () => {
    render(<WrappedDummy label="secret" isAuthenticated />);

    expect(screen.getByTestId("dummy")).toHaveTextContent("secret");
    expect(screen.queryByText(/access denied/i)).not.toBeInTheDocument();
  });

  it("renders a fallback instead of the wrapped component when isAuthenticated is false", () => {
    render(<WrappedDummy label="secret" isAuthenticated={false} />);

    expect(screen.queryByTestId("dummy")).not.toBeInTheDocument();
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });

  it("treats a missing isAuthenticated prop as unauthenticated", () => {
    render(<WrappedDummy label="secret" />);

    expect(screen.queryByTestId("dummy")).not.toBeInTheDocument();
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });
});
