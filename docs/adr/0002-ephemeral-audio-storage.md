# 2. Ephemeral Audio Storage

Date: 2026-06-20

## Status

Accepted

## Context

Users record a daily 60-second voice entry, which is transcribed by the Whisper API. We must decide whether to retain the raw `.wav` or `.m4a` audio files in Supabase Storage. Retaining them would allow a "playback" feature for the user.

## Decision

We will treat all raw audio as strictly ephemeral. The audio file is held in memory/temp storage, sent to the Whisper API, and immediately discarded once the text transcript is received. We will not upload or store audio files in Supabase Storage.

## Consequences

- **Positive:** Massive reduction in long-term hosting costs (storing text is negligible compared to storing thousands of audio files).
- **Positive:** A strong, marketable privacy guarantee: "Your voice is never stored."
- **Negative:** The user cannot listen back to the original emotion or tone of their voice entries. We accept this trade-off in favor of cost and privacy.
