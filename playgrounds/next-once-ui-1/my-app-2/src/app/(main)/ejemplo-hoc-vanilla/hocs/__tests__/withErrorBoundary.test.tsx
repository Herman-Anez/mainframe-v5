import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withErrorBoundary } from "../withErrorBoundary";

function Dummy({ shouldThrow, label }: { shouldThrow?: boolean; label: string }) {
  if (shouldThrow) {
    throw new Error("boom");
  }
  return <div data-testid="dummy">{label}</div>;
}

const WrappedDummy = withErrorBoundary(Dummy);

describe("withErrorBoundary", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // React logs caught render errors via console.error; silence the
    // expected noise so test output only shows real failures.
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("renders the wrapped component normally when nothing throws", () => {
    render(<WrappedDummy label="fine" />);

    expect(screen.getByTestId("dummy")).toHaveTextContent("fine");
  });

  it("renders a fallback with the error message when the wrapped component throws", () => {
    render(<WrappedDummy label="fine" shouldThrow />);

    expect(screen.queryByTestId("dummy")).not.toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  it("reports the caught error via componentDidCatch (console.error)", () => {
    render(<WrappedDummy label="fine" shouldThrow />);

    expect(errorSpy).toHaveBeenCalledWith(
      "[withErrorBoundary] caught:",
      expect.objectContaining({ message: "boom" }),
      expect.anything(),
    );
  });

  it("recovers and renders the wrapped component again once new props stop throwing", () => {
    const { rerender } = render(<WrappedDummy label="fine" shouldThrow />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    rerender(<WrappedDummy label="fine" shouldThrow={false} />);

    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
    expect(screen.getByTestId("dummy")).toHaveTextContent("fine");
  });
});
