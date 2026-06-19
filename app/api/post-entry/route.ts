import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { saveEntry, savePrompt, getTodayPrompt } from "@/src/lib/db";
import { isValidEntry } from "@/src/lib/entry-validation";
import { buildPostEntryPrompt, parseCombinedInsight } from "@/src/lib/ai-parsers";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "Missing transcript" }, { status: 400 });
    }

    if (!isValidEntry(transcript)) {
      return NextResponse.json(
        { error: "Transcript is too short or invalid" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Save the audio transcript as an entry
    await saveEntry(supabase, {
      user_id: user.id,
      transcript: transcript,
      recorded_at: new Date().toISOString(),
    });

    // Get the previous question context to feed into Gemini
    const previousQuestion = await getTodayPrompt(supabase, user.id);

    // Call Gemini
    const prompt = buildPostEntryPrompt(transcript, previousQuestion ?? undefined);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // Enforce JSON output type
        responseMimeType: "application/json",
      }
    });

    const rawResponse = response.text || "";

    // Parse out the insight and tomorrow's question
    const parsed = parseCombinedInsight(rawResponse);

    if (!parsed.success) {
      console.error("Failed to parse Gemini response:", rawResponse);
      return NextResponse.json(
        { error: "AI response parsing failed" },
        { status: 500 }
      );
    }

    // Save tomorrow's question to the DB
    await savePrompt(supabase, user.id, parsed.data.tomorrow_question);

    return NextResponse.json({
      instant_insight: parsed.data.instant_insight,
      tomorrow_question: parsed.data.tomorrow_question,
    });
  } catch (error: any) {
    console.error("Post-entry error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process entry" },
      { status: 500 }
    );
  }
}
