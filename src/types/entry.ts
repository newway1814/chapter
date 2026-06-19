import { z } from "zod";

// Zod schema for creating a new entry (before DB assigns id/created_at)
export const NewEntrySchema = z.object({
  user_id: z.string().uuid(),
  transcript: z.string().min(1),
  recorded_at: z.string().datetime(),
});

// Zod schema for an entry as returned from the database
export const EntrySchema = NewEntrySchema.extend({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
});

export type NewEntry = z.infer<typeof NewEntrySchema>;
export type Entry = z.infer<typeof EntrySchema>;

// Zod schema for creating a new chapter
export const NewChapterSchema = z.object({
  user_id: z.string().uuid(),
  narrative: z.string().min(1),
  themes: z.array(z.string()).min(1),
});

// Zod schema for a chapter as returned from the database
export const ChapterSchema = NewChapterSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
});

export type NewChapter = z.infer<typeof NewChapterSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;
