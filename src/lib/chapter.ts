import { z } from "zod";
import type { Entry } from "../types/entry";

export const CHAPTER_ENTRY_THRESHOLD = 10;
export const CHAPTER_WINDOW_DAYS = 30;

/**
 * Determines if a user is eligible to generate a new Chapter.
 * Rule: Must have at least 10 valid entries within the last 30 days.
 */
export const isChapterEligible = (entries: Entry[]): boolean => {
  if (entries.length < CHAPTER_ENTRY_THRESHOLD) {
    return false;
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - CHAPTER_WINDOW_DAYS);

  const validEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.recorded_at);
    return entryDate >= cutoffDate;
  });

  return validEntries.length >= CHAPTER_ENTRY_THRESHOLD;
};

// ─── AI Parsers ──────────────────────────────────────────────────────────────

export const ChapterResponseSchema = z.object({
  narrative: z.string().min(1),
  themes: z.array(z.string()).min(1),
});

export type ChapterData = z.infer<typeof ChapterResponseSchema>;

/**
 * Parses the Gemini response for Chapter generation.
 * Strips markdown code blocks and validates against ChapterResponseSchema.
 */
export const parseChapterResponse = (raw: string): ChapterData | null => {
  try {
    const cleanRaw = raw
      .replace(/^```[a-z]*\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    const parsedJson = JSON.parse(cleanRaw);
    return ChapterResponseSchema.parse(parsedJson);
  } catch (err) {
    return null;
  }
};

/**
 * Builds the prompt for Gemini to generate the Chapter summary.
 */
export const buildChapterPrompt = (entries: Entry[]): string => {
  const transcriptsBlock = entries
    .map((e) => `[${new Date(e.recorded_at).toLocaleDateString()}]: ${e.transcript}`)
    .join("\n\n");

  return `
You are an empathetic biographer summarizing a user's journaling over the past month.
Here are the user's audio journal entries, labeled by date:
"""
${transcriptsBlock}
"""

Based on these entries, provide two things in strict JSON format:
1. "narrative": A warm, reflective summary (3-4 paragraphs) of their journey this month. Weave their experiences together like a story.
2. "themes": An array of 2-5 recurring themes or emotions (short phrases) from their entries.

Return ONLY valid JSON with exactly these two keys: "narrative" and "themes".
Do NOT wrap the JSON in markdown code blocks.
  `.trim();
};
