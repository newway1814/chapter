"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createRecorderMachine, type RecorderState } from "@/src/lib/recorder-state";

type AudioRecorderProps = {
  /**
   * Testing seam — per CLAUDE.md Audio Recording Seam:
   * "The recorder exposes onRecordingComplete(transcript: string).
   * Test UI/state transitions by passing a string — no real mic needed."
   *
   * In production this is called after Whisper transcription completes.
   * In tests, simulate this by passing a transcript string directly.
   */
  onRecordingComplete: (transcript: string) => void;
  onError?: (message: string) => void;
};

type RecordingTimer = {
  elapsed: number;
  percentage: number;
};

const MAX_DURATION_MS = 60_000;
const TICK_INTERVAL_MS = 100;

/**
 * AudioRecorder — the primary interaction element of the app.
 *
 * Architecture:
 * - All state logic lives in recorder-state.ts (fully unit-tested)
 * - This component is a thin rendering layer over the state machine
 * - The onRecordingComplete prop is the testing seam
 * - MediaRecorder is the only browser API used; it is NOT unit-tested
 */
export const AudioRecorder = ({ onRecordingComplete, onError }: AudioRecorderProps) => {
  const machine = useRef(createRecorderMachine());
  const [recorderState, setRecorderState] = useState<RecorderState>(
    machine.current.getState()
  );
  const [timer, setTimer] = useState<RecordingTimer>({ elapsed: 0, percentage: 0 });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Sync machine state to React state
  const syncState = useCallback(() => {
    setRecorderState({ ...machine.current.getState() });
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimer({ elapsed: 0, percentage: 0 });
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setTimer({
        elapsed: Math.min(elapsed, MAX_DURATION_MS),
        percentage: Math.min((elapsed / MAX_DURATION_MS) * 100, 100),
      });
    }, TICK_INTERVAL_MS);
  }, []);

  const handleStart = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        // Audio blob is handed to the parent via onRecordingComplete AFTER
        // Whisper transcription. The blob itself is never stored — ADR-0002.
        // The parent calls machine.onComplete(transcript) when done.
      };

      mediaRecorder.start();
      machine.current.startRecording();
      syncState();
      startTimer();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not access microphone";
      machine.current.onError(message);
      syncState();
      onError?.(message);
    }
  }, [syncState, startTimer, onError]);

  const handleStop = useCallback(() => {
    if (
      mediaRecorderRef.current !== null &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    machine.current.stopRecording();
    syncState();
    stopTimer();

    // Simulate transcription: in a real flow, the parent sends the audio
    // blob to /api/transcribe and calls onRecordingComplete with the result.
    // For now the component signals the parent with the collected blob.
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    // The parent (app/page.tsx) will POST this to /api/transcribe (Issue #3).
    onRecordingComplete(`[blob:${blob.size}]`); // placeholder until Issue #3 wires the API
  }, [syncState, stopTimer, onRecordingComplete]);

  const handleReset = useCallback(() => {
    machine.current.reset();
    syncState();
    stopTimer();
  }, [syncState, stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current?.stop();
      }
    };
  }, [stopTimer]);

  const { status, error } = recorderState;
  const isRecording = status === "recording";
  const isProcessing = status === "processing";
  const isComplete = status === "complete";
  const isError = status === "error";

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}
      aria-label="Voice recorder"
    >
      {/* ── Record / Stop button ──────────────────────────────── */}
      <button
        id="record-button"
        type="button"
        onClick={isRecording ? handleStop : handleStart}
        disabled={isProcessing || isComplete}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: `3px solid var(--color-accent)`,
          background: isRecording ? "var(--color-accent)" : "transparent",
          cursor: isProcessing || isComplete ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 200ms ease, transform 100ms ease",
          transform: isRecording ? "scale(1.05)" : "scale(1)",
          animation: isRecording ? "pulse 1.5s ease-in-out infinite" : "none",
        }}
      >
        <span
          style={{
            display: "block",
            width: isRecording ? "20px" : "16px",
            height: isRecording ? "20px" : "16px",
            borderRadius: isRecording ? "2px" : "50%",
            background: isRecording ? "var(--color-accent-text)" : "var(--color-accent)",
            transition: "all 200ms ease",
          }}
          aria-hidden="true"
        />
      </button>

      {/* ── Progress bar ─────────────────────────────────────── */}
      {isRecording && (
        <div
          role="progressbar"
          aria-valuenow={Math.round(timer.percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Recording: ${Math.round(timer.elapsed / 1000)} of 60 seconds`}
          style={{ width: "100%", maxWidth: "280px" }}
        >
          <div
            style={{
              height: "2px",
              background: "var(--color-border)",
              width: "100%",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${timer.percentage}%`,
                background: "var(--color-accent)",
                transition: "width 100ms linear",
              }}
            />
          </div>
          <p
            className="text-label-sm"
            style={{ color: "var(--color-text-muted)", marginTop: "8px", textAlign: "center" }}
          >
            {Math.round(timer.elapsed / 1000)}s / 60s
          </p>
        </div>
      )}

      {/* ── Status text ──────────────────────────────────────── */}
      <p
        className="text-label-sm"
        style={{
          color: isError ? "var(--color-accent)" : "var(--color-text-muted)",
          textAlign: "center",
        }}
        role={isError ? "alert" : undefined}
        aria-live={isError ? "assertive" : "polite"}
      >
        {status === "idle" && "Tap to speak. Auto-stops at 60 seconds."}
        {status === "recording" && "Recording…"}
        {status === "processing" && "Processing…"}
        {status === "complete" && "Entry saved."}
        {status === "error" && (error ?? "Something went wrong.")}
      </p>

      {/* ── Try again button ─────────────────────────────────── */}
      {isError && (
        <button
          id="try-again-button"
          type="button"
          onClick={handleReset}
          className="btn-ghost"
        >
          Try again
        </button>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-accent) 40%, transparent); }
          50% { box-shadow: 0 0 0 12px color-mix(in srgb, var(--color-accent) 0%, transparent); }
        }
      `}</style>
    </div>
  );
};
