import { describe, expect, it } from "vitest";
function add(lhs: number, rhs: number) {
  return lhs + rhs;
}

describe("add", () => {
  it("1 + 2 = 3", () => {
    const result = add(1, 2);

    expect(result).toBe(3);
  });
});
