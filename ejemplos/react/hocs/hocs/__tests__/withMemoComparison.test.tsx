import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { withMemoComparison } from "../withMemoComparison";

interface DummyProps {
  visible: string;
  ignored: number;
}

describe("withMemoComparison", () => {
  it("does not re-render the wrapped component when the comparator says props are equal", () => {
    const renderSpy = vi.fn();
    function Dummy({ visible }: DummyProps) {
      renderSpy();
      return <div data-testid="dummy">{visible}</div>;
    }

    const ignoreIgnoredField = (prev: DummyProps, next: DummyProps) => prev.visible === next.visible;
    const Wrapped = withMemoComparison(Dummy, ignoreIgnoredField);

    const { rerender } = render(<Wrapped visible="a" ignored={1} />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    rerender(<Wrapped visible="a" ignored={2} />);

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("dummy")).toHaveTextContent("a");
  });

  it("re-renders the wrapped component when the comparator says props changed", () => {
    const renderSpy = vi.fn();
    function Dummy({ visible }: DummyProps) {
      renderSpy();
      return <div data-testid="dummy">{visible}</div>;
    }

    const ignoreIgnoredField = (prev: DummyProps, next: DummyProps) => prev.visible === next.visible;
    const Wrapped = withMemoComparison(Dummy, ignoreIgnoredField);

    const { rerender } = render(<Wrapped visible="a" ignored={1} />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    rerender(<Wrapped visible="b" ignored={1} />);

    expect(renderSpy).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("dummy")).toHaveTextContent("b");
  });
});
