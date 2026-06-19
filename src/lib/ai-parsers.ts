import { z } from "zod";

// Zod schema for the expected JSON response from Gemini
// .strip() is default in Zod object schemas, which removes any extra keys not defined here.
export const PostEntryResponseSchema = z.object({
  instant_insight: z.string().min(1),
  tomorrow_question: z.string().min(1),
});

export type PostEntryResponse = z.infer<typeof PostEntryResponseSchema>;

export type ParseResult =
  | { success: true; data: PostEntryResponse }
  | { success: false };

/**
 * Clean and parse the response from Gemini.
 * Extracts JSON if it's wrapped in markdown code blocks.
 */
export const parseCombinedInsight = (raw: string): ParseResult => {
  try {
    // Sometimes LLMs return markdown wrappers like ```json\n...\n```
    // We strip them out before parsing.
    const cleanRaw = raw
      .replace(/^```[a-z]*\n?/i, "") // Remove starting markdown
      .replace(/\n?```$/i, "")       // Remove ending markdown
      .trim();

    const parsedJson = JSON.parse(cleanRaw);
    
    // Zod handles all the structural validation and stripping of unknown keys
    const data = PostEntryResponseSchema.parse(parsedJson);

    return { success: true, data };
  } catch (err) {
    // We catch both JSON.parse errors and Zod validation errors
    return { success: false };
  }
};

/**
 * Builds the prompt for the Post-Entry (Magic) AI Call using Gemini.
 * Incorporates the user's audio transcript and an optional previous question.
 * Enforces the structured JSON output requirement matching PostEntryResponseSchema.
 */
export const buildPostEntryPrompt = (
  transcript: string,
  previousQuestion?: string
): string => {
  const contextBlock = previousQuestion
    ? `The user was just asked this question: "${previousQuestion}"\n\n`
    : "";

  return `
You are an empathetic, insightful interviewer for a private audio journal.
${contextBlock}Here is the user's journal entry transcript for today:
"""
${transcript}
"""

Based on this entry, provide two things in strict JSON format:
1. "instant_insight": A warm, validating, and concise insight (1-2 sentences) about what they shared. Make them feel heard.
2. "tomorrow_question": A single, thought-provoking question to prompt them tomorrow. It should connect to what they said today but push them to reflect deeper.

Return ONLY valid JSON with exactly these two keys: "instant_insight" and "tomorrow_question".
Do NOT wrap the JSON in markdown code blocks.
  `.trim();
};

