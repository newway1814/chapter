import { describe, it, expect } from "vitest";
import { isChapterEligible } from "../src/lib/chapter";
import type { Entry } from "../src/types/entry";

const createMockEntry = (daysAgo: number): Entry => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return {
    id: crypto.randomUUID(),
    user_id: "user-123",
    transcript: "Test entry transcript",
    recorded_at: date.toISOString(),
    created_at: date.toISOString(),
  };
};

describe("isChapterEligible", () => {
  it("returns false for an empty array", () => {
    expect(isChapterEligible([])).toBe(false);
  });

  it("returns false for 9 entries", () => {
    const entries = Array.from({ length: 9 }, () => createMockEntry(1));
    expect(isChapterEligible(entries)).toBe(false);
  });

  it("returns true for 10 entries within 30 days", () => {
    const entries = Array.from({ length: 10 }, () => createMockEntry(1));
    expect(isChapterEligible(entries)).toBe(true);
  });

  it("returns false if some entries are outside the 30-day window", () => {
    // 9 entries from yesterday
    const validEntries = Array.from({ length: 9 }, () => createMockEntry(1));
    // 1 entry from 31 days ago
    const oldEntry = createMockEntry(31);
    
    expect(isChapterEligible([...validEntries, oldEntry])).toBe(false);
  });
});
