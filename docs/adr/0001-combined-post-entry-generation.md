# 1. Combined Post-Entry Generation

Date: 2026-06-20

## Status

Accepted

## Context

The app requires two AI-generated outputs per daily entry: an "Instant Insight" to reward the user immediately, and an "Interviewer Question" to prompt them the next time they open the app. Making two separate API calls to Gemini would double the latency the user experiences while waiting for their insight, and double our API costs. 

## Decision

We will make a single "Post-Entry Analysis" call to Gemini after a successful transcription. The prompt will request a structured JSON response containing both the `instant_insight` (to be displayed immediately) and the `tomorrow_question` (to be saved to Supabase for the next session).

## Consequences

- **Positive:** Halves Gemini API latency for the user. Halves API costs. 
- **Negative:** The "tomorrow question" is generated immediately. If the user skips several days before returning, the question will be based on their entry from several days ago rather than any context about their absence. We accept this trade-off for the performance gains.
