# PRD: Chapter - AI Documentary Journal App

## Problem Statement

Many people desire the mental clarity and memory preservation benefits of daily journaling, but they struggle to maintain the habit because writing feels like a chore. Standard journaling tools demand high friction (typing out long entries) and offer delayed gratification, leading to high drop-off rates among non-journalers.

## Solution

Chapter is a low-friction, daily voice journaling app designed to persuade non-journalers to build a habit. It eliminates friction by enforcing a strict 60-second audio limit, removing the pressure of the blank page. It drives daily retention by providing immediate value (an AI-generated "Instant Insight" and personalized question for tomorrow) and a compelling long-term reward (a synthesized monthly "Chapter" documentary summarizing their month).

## User Stories

1. As a new user, I want to authenticate easily so that my private journal entries are secure.
2. As a user, I want to open the app and immediately see a personalized question based on my previous entry, so that I don't have to struggle with "what to talk about."
3. As a user, I want to press a single button to record my voice for up to 60 seconds, so that journaling is as easy as sending a voice note.
4. As a user, I want to be stopped at exactly 60 seconds, so that I don't feel pressure to ramble and the habit stays low-friction.
5. As a privacy-conscious user, I want the app to delete my raw audio immediately after transcription, so that I know my voice isn't being stored anywhere.
6. As a user, I want my voice note to be quickly transcribed, so that the AI can analyze what I said.
7. As a user, if my recording is too short or just accidental noise, I want the app to reject it and ask me to try again, so that I don't waste my daily entry.
8. As a user, I want to instantly receive a beautiful, one-sentence "Instant Insight" about my entry right after recording, so that I get immediate value and gratification every day.
9. As a user, I want to visually track how many daily entries I've made toward my 30-day "Chapter", so that I feel motivated to keep the streak going.
10. As a user who has completed 10 or more valid entries in a 30-day rolling window, I want the app to automatically generate my "Chapter", so that I can see a synthesized narrative and visual charts of my month.
11. As a user, I want my Chapter to be presented in a clean, "Warm Minimalist" UI with beautiful typography, so that reading it feels like looking at a high-quality journal.
12. As a user, I want to be able to export or share aspects of my Chapter as a digital card, so that I can keep it or share it if I choose.

## Implementation Decisions

- **Architecture:** Next.js 14 App Router, strict TypeScript, Tailwind CSS.
- **Database & Auth:** `@supabase/supabase-js` connecting to a Postgres instance with Row Level Security (RLS) enabled.
- **AI Integrations:** OpenAI Whisper for transcription. Gemini for text analysis (Insights and Chapters).
- **ADR-0001 (Combined API Generation):** A single "Post-Entry" Gemini API call will process the transcript to generate both the "Instant Insight" (shown immediately) and the "Interviewer Question" (saved for tomorrow), halving latency and API costs.
- **ADR-0002 (Ephemeral Audio):** Raw audio files will be deleted immediately after Whisper transcription. They will never be saved to Supabase Storage.
- **Definition of "Entry":** A valid entry requires a minimum word count post-transcription to prevent LLM credit waste on accidental noise.
- **Definition of "Chapter":** A 30-day rolling window narrative that requires a minimum of 10 valid Entries to generate.

## Testing Decisions

A good test in this codebase only tests external behavior, not implementation details (e.g., testing that the correct data structure is returned, rather than testing that `fetch` was called with specific headers).

- **The AI Logic Seam:** All Gemini and Whisper prompt construction and response parsing will be isolated into pure TypeScript functions (e.g., `src/lib/ai-parsers.ts`). We will unit test the Zod validation and prompt logic completely offline using Vitest, mocking only the network response.
- **The Audio Recording Seam:** The React audio recorder will expose a clean seam: `onRecordingComplete(transcript: string)`. We will test the UI flow and state transitions by passing in a string transcript, bypassing the need for a real microphone in tests.
- **The Database Access Seam:** All Supabase operations will go through explicit functions in `src/lib/db.ts`. UI components will be tested against mocked versions of these functions.

## Out of Scope

- Manual text-entry journaling (voice only to keep friction low).
- Actual video or audio generation for the "documentary" output.
- Playback of past raw audio recordings (since audio is ephemeral).
- Native mobile app deployment (this is a web app, responsive mobile-first).

## Further Notes

- The design system dictates "Warm Minimalism": no rounded corners, heavy whitespace, and specific typography (`Playfair Display` for headings, `Source Serif 4` for narrative, `Inter` for UI chrome). See `docs/design_system.md` for full layout specs.
