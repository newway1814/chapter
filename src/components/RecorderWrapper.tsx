"use client";

import { AudioRecorder } from "@/src/components/AudioRecorder";

/**
 * RecorderWrapper — thin "use client" island that bridges the Server Component
 * dashboard with the AudioRecorder client component.
 * Issue #3 will replace the stub onRecordingComplete with the real API call chain.
 */
export const RecorderWrapper = () => (
  <AudioRecorder
    onRecordingComplete={(transcript) => {
      // Issue #3: POST to /api/transcribe, then /api/post-entry
      console.log("Recording complete:", transcript);
    }}
  />
);
