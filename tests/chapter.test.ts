import { describe, it, expect } from "vitest";
import { isChapterEligible, buildChapterPrompt, parseChapterResponse } from "../src/lib/chapter";
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

describe("buildChapterPrompt", () => {
  it("includes all entry transcripts with their dates", () => {
    const entries = [
      createMockEntry(1),
      createMockEntry(2)
    ];
    
    const prompt = buildChapterPrompt(entries);
    expect(prompt).toContain(entries[0].transcript);
    expect(prompt).toContain(entries[1].transcript);
  });

  it("instructs the model to return JSON with narrative and themes", () => {
    const prompt = buildChapterPrompt([]);
    expect(prompt).toContain("narrative");
    expect(prompt).toContain("themes");
  });
});

describe("parseChapterResponse", () => {
  it("parses valid JSON with narrative and themes", () => {
    const raw = JSON.stringify({
      narrative: "This month you focused on...",
      themes: ["growth", "resilience"]
    });

    const result = parseChapterResponse(raw);
    expect(result).not.toBeNull();
    expect(result?.narrative).toBe("This month you focused on...");
    expect(result?.themes).toEqual(["growth", "resilience"]);
  });

  it("handles markdown code block wrappers gracefully", () => {
    const raw = `\`\`\`json\n{"narrative": "Story", "themes": ["theme1"]}\n\`\`\``;
    const result = parseChapterResponse(raw);
    expect(result).not.toBeNull();
    expect(result?.narrative).toBe("Story");
  });

  it("returns null if narrative is missing", () => {
    const raw = JSON.stringify({ themes: ["growth"] });
    expect(parseChapterResponse(raw)).toBeNull();
  });

  it("returns null if themes is missing", () => {
    const raw = JSON.stringify({ narrative: "Story" });
    expect(parseChapterResponse(raw)).toBeNull();
  });

  it("returns null on malformed JSON without throwing", () => {
    const raw = `{ "narrative": "Oops`;
    expect(parseChapterResponse(raw)).toBeNull();
  });

  it("strips extra fields", () => {
    const raw = JSON.stringify({
      narrative: "Story",
      themes: ["theme1"],
      extra_field: "hidden"
    });
    
    const result = parseChapterResponse(raw);
    expect(result).not.toHaveProperty("extra_field");
  });
});

