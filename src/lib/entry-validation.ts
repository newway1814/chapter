const MIN_WORD_COUNT = 5;

/**
 * Determines whether a transcript is a valid Entry.
 * A valid Entry must contain at least MIN_WORD_COUNT non-whitespace words.
 * This gate exists to reject accidental noise recordings and protect AI credits.
 * See CONTEXT.md: "Entry" definition.
 */
export const isValidEntry = (transcript: string): boolean => {
  const words = transcript.trim().split(/\s+/).filter((word) => word.length > 0);
  return words.length >= MIN_WORD_COUNT;
};
