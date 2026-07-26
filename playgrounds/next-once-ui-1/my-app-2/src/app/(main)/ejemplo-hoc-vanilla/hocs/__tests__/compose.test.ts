import { describe, expect, it } from "vitest";
import { compose } from "../compose";

describe("compose", () => {
  it("applies HOCs right-to-left, so the first arg ends up outermost", () => {
    const order: string[] = [];

    const withA = (Base: string) => {
      order.push("wrap:A");
      return `A(${Base})`;
    };
    const withB = (Base: string) => {
      order.push("wrap:B");
      return `B(${Base})`;
    };

    // Cast: compose is typed for React components, but the wrapping
    // mechanics (reduceRight) are pure and easy to verify with strings.
    const result = (compose as unknown as (...hocs: ((s: string) => string)[]) => (s: string) => string)(
      withA,
      withB,
    )("Base");

    expect(result).toBe("A(B(Base))");
    // B wraps first (innermost), then A wraps the result (outermost).
    expect(order).toEqual(["wrap:B", "wrap:A"]);
  });

  it("returns the original component unchanged when given no HOCs", () => {
    const identity = (compose as unknown as (...hocs: ((s: string) => string)[]) => (s: string) => string)();
    expect(identity("Base")).toBe("Base");
  });
});
