/**
 * Database access layer — all Supabase calls are centralised here.
 *
 * Per CLAUDE.md Testing Seams: UI components and API routes import from this
 * module and are tested against vi.mock("../src/lib/db"). The real Supabase
 * client is never imported directly in UI or API files.
 */

import type { Entry, NewEntry } from "@/src/types/entry";
import type { SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Entries
// ---------------------------------------------------------------------------

/**
 * Persist a validated transcript as a new Entry row.
 * Only call after isValidEntry() has returned true.
 */
export const saveEntry = async (
  supabase: SupabaseClient,
  entry: NewEntry
): Promise<Entry> => {
  const { data, error } = await supabase
    .from("entries")
    .insert(entry)
    .select()
    .single();

  if (error !== null) {
    throw new Error(`Failed to save entry: ${error.message}`);
  }

  return data as Entry;
};

// ---------------------------------------------------------------------------
// Prompts (Tomorrow's Interviewer Question)
// ---------------------------------------------------------------------------

/**
 * Return the most recent saved prompt for a user, or null if none exists.
 * Shown at the top of the recording screen to eliminate the blank-page problem.
 */
export const getTodayPrompt = async (
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("prompts")
    .select("question")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error !== null) {
    throw new Error(`Failed to fetch prompt: ${error.message}`);
  }

  return (data as { question: string } | null)?.question ?? null;
};

// ---------------------------------------------------------------------------
// Chapter eligibility window
// ---------------------------------------------------------------------------

/**
 * Return all valid entries for a user within the last `days` days.
 * Used by isChapterEligible() and the progress tracker UI.
 */
export const getEntriesInWindow = async (
  supabase: SupabaseClient,
  userId: string,
  days: number = 30
): Promise<Entry[]> => {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", userId)
    .gte("recorded_at", since.toISOString())
    .order("recorded_at", { ascending: false });

  if (error !== null) {
    throw new Error(`Failed to fetch entries: ${error.message}`);
  }

  return (data ?? []) as Entry[];
};
