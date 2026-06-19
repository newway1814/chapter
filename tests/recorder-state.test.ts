import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRecorderMachine, type RecorderState } from "../src/lib/recorder-state";

describe("RecorderMachine", () => {
  describe("initial state", () => {
    it("starts in idle state", () => {
      const machine = createRecorderMachine();
      expect(machine.getState().status).toBe("idle");
    });

    it("has no transcript in idle state", () => {
      const machine = createRecorderMachine();
      expect(machine.getState().transcript).toBeNull();
    });

    it("has no error in idle state", () => {
      const machine = createRecorderMachine();
      expect(machine.getState().error).toBeNull();
    });
  });

  describe("startRecording()", () => {
    it("transitions from idle to recording", () => {
      const machine = createRecorderMachine();
      machine.startRecording();
      expect(machine.getState().status).toBe("recording");
    });

    it("throws if called when not in idle state", () => {
      const machine = createRecorderMachine();
      machine.startRecording();
      expect(() => machine.startRecording()).toThrow();
    });
  });

  describe("stopRecording()", () => {
    it("transitions from recording to processing", () => {
      const machine = createRecorderMachine();
      machine.startRecording();
      machine.stopRecording();
      expect(machine.getState().status).toBe("processing");
    });

    it("throws if called when not in recording state", () => {
      const machine = createRecorderMachine();
      expect(() => machine.stopRecording()).toThrow();
    });
  });

  describe("onComplete(transcript)", () => {
    it("transitions from processing to complete with the transcript", () => {
      const machine = createRecorderMachine();
      machine.startRecording();
      machine.stopRecording();
      machine.onComplete("today was a really good day");
      const state = machine.getState();
      expect(state.status).toBe("complete");
      expect(state.transcript).toBe("today was a really good day");
    });

    it("transitions to error state if transcript is invalid (< 5 words)", () => {
      const machine = createRecorderMachine();
      machine.startRecording();
      machine.stopRecording();
      machine.onComplete("too short");
      const state = machine.getState();
      expect(state.status).toBe("error");
      expect(state.error).toMatch(/too short/i);
    });

    it("transitions to error state for empty transcript", () => {
      const machine = createRecorderMachine();
      machine.startRecording();
      machine.stopRecording();
      machine.onComplete("");
      expect(machine.getState().status).toBe("error");
    });

    it("throws if called when not in processing state", () => {
      const machine = createRecorderMachine();
      expect(() => machine.onComplete("five words at least here")).toThrow();
    });
  });

  describe("onError(message)", () => {
    it("transitions to error state from recording", () => {
      const machine = createRecorderMachine();
      machine.startRecording();
      machine.onError("Microphone access denied");
      const state = machine.getState();
      expect(state.status).toBe("error");
      expect(state.error).toBe("Microphone access denied");
    });

    it("transitions to error state from processing", () => {
      const machine = createRecorderMachine();
      machine.startRecording();
      machine.stopRecording();
      machine.onError("Upload failed");
      expect(machine.getState().status).toBe("error");
    });
  });

  describe("reset()", () => {
    it("returns to idle from any state", () => {
      const machine = createRecorderMachine();
      machine.startRecording();
      machine.onError("Something went wrong");
      machine.reset();
      expect(machine.getState().status).toBe("idle");
    });

    it("clears transcript and error on reset", () => {
      const machine = createRecorderMachine();
      machine.startRecording();
      machine.stopRecording();
      machine.onComplete("today was a really good day");
      machine.reset();
      const state = machine.getState();
      expect(state.transcript).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe("auto-stop at 60 seconds", () => {
    it("calls stopRecording automatically after 60 seconds", () => {
      vi.useFakeTimers();
      const machine = createRecorderMachine();
      const stopSpy = vi.spyOn(machine, "stopRecording");

      machine.startRecording();
      vi.advanceTimersByTime(60_000);

      expect(stopSpy).toHaveBeenCalledOnce();
      vi.useRealTimers();
    });

    it("does NOT auto-stop if stopRecording was called manually before 60s", () => {
      vi.useFakeTimers();
      const machine = createRecorderMachine();
      const stopSpy = vi.spyOn(machine, "stopRecording");

      machine.startRecording();
      vi.advanceTimersByTime(30_000);
      machine.stopRecording();

      vi.advanceTimersByTime(35_000); // past 60s from start
      expect(stopSpy).toHaveBeenCalledOnce(); // only once (manual call)
      vi.useRealTimers();
    });
  });
});
