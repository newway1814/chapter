import { isValidEntry } from "./entry-validation";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RecorderStatus = "idle" | "recording" | "processing" | "complete" | "error";

export type RecorderState = {
  readonly status: RecorderStatus;
  readonly transcript: string | null;
  readonly error: string | null;
};

export type RecorderMachine = {
  getState: () => RecorderState;
  startRecording: () => void;
  stopRecording: () => void;
  onComplete: (transcript: string) => void;
  onError: (message: string) => void;
  reset: () => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_RECORDING_DURATION_MS = 60_000;

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a recorder state machine instance.
 *
 * This is a pure state machine — it contains zero browser APIs.
 * It delegates transcript validation to isValidEntry().
 *
 * Per CLAUDE.md Audio Recording Seam:
 * "Test UI/state transitions by passing a string — no real mic needed."
 * The machine is tested entirely via createRecorderMachine() + string inputs.
 */
export const createRecorderMachine = (): RecorderMachine => {
  let state: RecorderState = {
    status: "idle",
    transcript: null,
    error: null,
  };

  let autoStopTimer: ReturnType<typeof setTimeout> | null = null;

  const clearAutoStop = () => {
    if (autoStopTimer !== null) {
      clearTimeout(autoStopTimer);
      autoStopTimer = null;
    }
  };

  const machine: RecorderMachine = {
    getState: () => state,

    startRecording: () => {
      if (state.status !== "idle") {
        throw new Error(`Cannot startRecording from state: ${state.status}`);
      }
      state = { status: "recording", transcript: null, error: null };

      // Auto-stop at 60 seconds (per PRD User Story #4)
      autoStopTimer = setTimeout(() => {
        machine.stopRecording();
      }, MAX_RECORDING_DURATION_MS);
    },

    stopRecording: () => {
      if (state.status !== "recording") {
        throw new Error(`Cannot stopRecording from state: ${state.status}`);
      }
      clearAutoStop();
      state = { status: "processing", transcript: null, error: null };
    },

    onComplete: (transcript: string) => {
      if (state.status !== "processing") {
        throw new Error(`Cannot call onComplete from state: ${state.status}`);
      }

      if (!isValidEntry(transcript)) {
        state = {
          status: "error",
          transcript: null,
          error: "Recording too short — please say at least 5 words and try again.",
        };
        return;
      }

      state = { status: "complete", transcript, error: null };
    },

    onError: (message: string) => {
      clearAutoStop();
      state = { status: "error", transcript: null, error: message };
    },

    reset: () => {
      clearAutoStop();
      state = { status: "idle", transcript: null, error: null };
    },
  };

  return machine;
};
