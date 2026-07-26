import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withLogger } from "../withLogger";

function Dummy({ label }: { label: string }) {
  return <div>{label}</div>;
}
Dummy.displayName = "Dummy";

const WrappedDummy = withLogger(Dummy);

describe("withLogger", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("logs a mount message tagged with the wrapped component's name", () => {
    render(<WrappedDummy label="hi" />);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Dummy mounted"));
  });

  it("logs an unmount message when the component is removed", () => {
    const { unmount } = render(<WrappedDummy label="hi" />);
    logSpy.mockClear();

    unmount();

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Dummy unmounted"));
  });

  it("logs a render entry on every re-render with the current props", () => {
    const { rerender } = render(<WrappedDummy label="first" />);
    logSpy.mockClear();

    rerender(<WrappedDummy label="second" />);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("render #"),
      expect.objectContaining({ label: "second" }),
    );
  });

  it("still renders the wrapped component's output", () => {
    const { getByText } = render(<WrappedDummy label="visible" />);
    expect(getByText("visible")).toBeInTheDocument();
  });
});
