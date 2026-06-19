import { describe, it, expect } from "vitest";
import { isValidEntry } from "../src/lib/entry-validation";

describe("isValidEntry", () => {
  it("returns false for an empty string", () => {
    expect(isValidEntry("")).toBe(false);
  });

  it("returns false for a transcript with fewer than 5 words", () => {
    expect(isValidEntry("yeah")).toBe(false);
    expect(isValidEntry("okay bye")).toBe(false);
    expect(isValidEntry("one two three four")).toBe(false);
  });

  it("returns false for whitespace-only strings", () => {
    expect(isValidEntry("   ")).toBe(false);
    expect(isValidEntry("\n\t")).toBe(false);
  });

  it("returns true for exactly 5 words", () => {
    expect(isValidEntry("today was a good day")).toBe(true);
  });

  it("returns true for more than 5 words", () => {
    expect(isValidEntry("I had a really productive and creative day today")).toBe(true);
  });

  it("handles extra whitespace between words correctly", () => {
    // 5 real words but with extra spaces should still count as valid
    expect(isValidEntry("  today  was  a  good  day  ")).toBe(true);
  });
});
