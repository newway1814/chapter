import { describe, it, expect } from "vitest";
import { parseCombinedInsight, buildPostEntryPrompt } from "../src/lib/ai-parsers";

describe("parseCombinedInsight", () => {
  it("parses valid JSON successfully", () => {
    const raw = JSON.stringify({
      instant_insight: "A valid insight",
      tomorrow_question: "A valid question?",
    });

    const result = parseCombinedInsight(raw);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.instant_insight).toBe("A valid insight");
      expect(result.data.tomorrow_question).toBe("A valid question?");
    }
  });

  it("handles markdown code block wrappers gracefully", () => {
    const raw = `\`\`\`json\n{"instant_insight": "Insight", "tomorrow_question": "Question?"}\n\`\`\``;

    const result = parseCombinedInsight(raw);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.instant_insight).toBe("Insight");
      expect(result.data.tomorrow_question).toBe("Question?");
    }
  });

  it("fails if instant_insight is missing", () => {
    const raw = JSON.stringify({
      tomorrow_question: "A valid question?",
    });

    const result = parseCombinedInsight(raw);
    expect(result.success).toBe(false);
  });

  it("fails if instant_insight is empty", () => {
    const raw = JSON.stringify({
      instant_insight: "",
      tomorrow_question: "A valid question?",
    });

    const result = parseCombinedInsight(raw);
    expect(result.success).toBe(false);
  });

  it("fails if tomorrow_question is missing", () => {
    const raw = JSON.stringify({
      instant_insight: "A valid insight",
    });

    const result = parseCombinedInsight(raw);
    expect(result.success).toBe(false);
  });

  it("fails on malformed JSON without throwing", () => {
    const raw = `{ "instant_insight": "Whoops forgot to close this`;

    // Should return { success: false }, not throw an exception
    const result = parseCombinedInsight(raw);
    expect(result.success).toBe(false);
  });

  it("strips extra fields not in schema", () => {
    const raw = JSON.stringify({
      instant_insight: "Insight",
      tomorrow_question: "Question?",
      internal_thought_process: "Thinking...",
      confidence_score: 95,
    });

    const result = parseCombinedInsight(raw);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("internal_thought_process");
      expect(result.data).not.toHaveProperty("confidence_score");
    }
  });
});

describe("buildPostEntryPrompt", () => {
  it("includes the transcript in the prompt", () => {
    const prompt = buildPostEntryPrompt("Today was fantastic.");
    expect(prompt).toContain("Today was fantastic.");
  });

  it("instructs the model to output JSON with required keys", () => {
    const prompt = buildPostEntryPrompt("Hello");
    expect(prompt).toContain("instant_insight");
    expect(prompt).toContain("tomorrow_question");
  });

  it("incorporates the previous question if provided", () => {
    const prompt = buildPostEntryPrompt("I felt great today", "How did you feel today?");
    expect(prompt).toContain("How did you feel today?");
    expect(prompt).toContain("I felt great today");
  });
});
