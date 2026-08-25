import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("formats a number as USD currency", () => {
    expect(formatPrice(240)).toBe("$240.00");
  });

  it("formats zero and decimals correctly", () => {
    expect(formatPrice(0)).toBe("$0.00");
    expect(formatPrice(12.5)).toBe("$12.50");
  });
});
