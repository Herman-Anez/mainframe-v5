import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { withLoading } from "../withLoading";

interface DummyProps {
  label: string;
}

function Dummy({ label }: DummyProps) {
  return <div data-testid="dummy">{label}</div>;
}

const WrappedDummy = withLoading(Dummy);

describe("withLoading", () => {
  it("renders the wrapped component when isLoading is false", () => {
    render(<WrappedDummy label="hello" isLoading={false} />);

    expect(screen.getByTestId("dummy")).toHaveTextContent("hello");
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it("renders the wrapped component when isLoading is omitted", () => {
    render(<WrappedDummy label="hello" />);

    expect(screen.getByTestId("dummy")).toBeInTheDocument();
  });

  it("shows a loading state instead of the wrapped component when isLoading is true", () => {
    render(<WrappedDummy label="hello" isLoading />);

    expect(screen.queryByTestId("dummy")).not.toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("does not leak the isLoading prop into the wrapped component", () => {
    function PropsSpy(props: Record<string, unknown>) {
      return <div data-testid="props">{JSON.stringify(Object.keys(props))}</div>;
    }
    const WrappedSpy = withLoading(PropsSpy);

    render(<WrappedSpy label="hello" isLoading={false} />);

    expect(screen.getByTestId("props")).toHaveTextContent('["label"]');
  });
});
