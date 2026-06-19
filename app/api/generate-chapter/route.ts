import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { getEntriesInWindow, saveChapter } from "@/src/lib/db";
import { isChapterEligible, buildChapterPrompt, parseChapterResponse } from "@/src/lib/chapter";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError !== null || user === null) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch recent entries and verify eligibility
    const entries = await getEntriesInWindow(supabase, user.id);

    if (!isChapterEligible(entries)) {
      return NextResponse.json(
        { error: "Not eligible for a new chapter yet. Need 10 entries in the last 30 days." },
        { status: 403 }
      );
    }

    // 3. Build prompt for Gemini
    const prompt = buildChapterPrompt(entries);

    // 4. Call Gemini 1.5 Flash
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const aiText = response.text;
    if (!aiText) {
      throw new Error("Failed to generate Chapter from AI");
    }

    // 5. Parse response
    const chapterData = parseChapterResponse(aiText);

    if (chapterData === null) {
      throw new Error("AI returned malformed Chapter JSON");
    }

    // 6. Save chapter to DB
    const newChapter = await saveChapter(supabase, {
      user_id: user.id,
      narrative: chapterData.narrative,
      themes: chapterData.themes,
    });

    // 7. Return success
    return NextResponse.json(newChapter, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
