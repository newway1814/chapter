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
