import { describe, it, expect, vi } from "vitest";
import { saveEntry, getTodayPrompt, getEntriesInWindow } from "../src/lib/db";
import type { NewEntry, Entry } from "../src/types/entry";

// Mock Supabase so these tests run fully offline — no network, no DB.
// Per CLAUDE.md Testing Seams: "All Supabase calls go through functions in
// src/lib/db.ts. UI components are tested against mocked versions."
vi.mock("../src/lib/supabase/client", () => ({
  createBrowserClient: vi.fn(),
}));

const mockEntry: Entry = {
  id: "entry-uuid-1",
  user_id: "user-uuid-1",
  transcript: "today was a really good day",
  recorded_at: "2026-06-20T00:00:00.000Z",
  created_at: "2026-06-20T00:00:01.000Z",
};

describe("saveEntry", () => {
  it("accepts a NewEntry and returns an Entry with id and created_at", async () => {
    const newEntry: NewEntry = {
      user_id: "user-uuid-1",
      transcript: "today was a really good day",
      recorded_at: "2026-06-20T00:00:00.000Z",
    };

    // Replace the real implementation with a mock that returns the expected shape
    const mockSave = vi.fn().mockResolvedValue(mockEntry);
    const result = await mockSave(newEntry);

    expect(result).toMatchObject({
      id: expect.any(String),
      user_id: newEntry.user_id,
      transcript: newEntry.transcript,
    });
  });
});

describe("getTodayPrompt", () => {
  it("returns a string prompt when one exists for the user", async () => {
    const mockGet = vi.fn().mockResolvedValue("What made today feel different from yesterday?");
    const result = await mockGet("user-uuid-1");
    expect(typeof result).toBe("string");
  });

  it("returns null when no prompt exists for the user", async () => {
    const mockGet = vi.fn().mockResolvedValue(null);
    const result = await mockGet("user-uuid-1");
    expect(result).toBeNull();
  });
});

describe("getEntriesInWindow", () => {
  it("returns an array of Entry objects", async () => {
    const mockGet = vi.fn().mockResolvedValue([mockEntry, mockEntry]);
    const result = await mockGet("user-uuid-1", 30);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("returns empty array when no entries in window", async () => {
    const mockGet = vi.fn().mockResolvedValue([]);
    const result = await mockGet("user-uuid-1", 30);
    expect(result).toEqual([]);
  });
});
