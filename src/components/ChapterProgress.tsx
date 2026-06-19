"use client";

import { useState } from "react";
import type { Chapter } from "@/src/types/entry";
import { CHAPTER_ENTRY_THRESHOLD } from "@/src/lib/chapter";

type ChapterProgressProps = {
  entryCount: number;
};

/**
 * Renders the 30-day progress bar. 
 * If the user has reached 10 entries, shows the "Generate Chapter" CTA.
 * If generated, displays the final narrative and themes.
 */
export const ChapterProgress = ({ entryCount }: ChapterProgressProps) => {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEligible = entryCount >= CHAPTER_ENTRY_THRESHOLD;
  const progressPercent = Math.min((entryCount / CHAPTER_ENTRY_THRESHOLD) * 100, 100);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-chapter", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate chapter");
      }

      setChapter(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsGenerating(false);
    }
  };

  if (chapter) {
    return (
      <section aria-label="Your latest chapter" className="animation-fadeIn">
        <p className="text-label-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
          Your new Chapter
        </p>
        <div
          className="p-6 mb-6"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "4px",
          }}
        >
          <p className="text-body whitespace-pre-wrap mb-6" style={{ color: "var(--color-text-primary)" }}>
            {chapter.narrative}
          </p>
          <div>
            <p className="text-label-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
              Themes
            </p>
            <ul className="flex flex-wrap gap-2">
              {chapter.themes.map((theme) => (
                <li
                  key={theme}
                  className="px-3 py-1 text-label-sm rounded-full"
                  style={{
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {theme}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Chapter progress">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-label-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
            Progress
          </p>
          <p className="text-narrative" style={{ color: "var(--color-text-primary)" }}>
            {entryCount} of {CHAPTER_ENTRY_THRESHOLD} entries toward your Chapter
          </p>
        </div>
        {isEligible && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 text-label-sm"
            style={{
              background: "var(--color-text-primary)",
              color: "var(--color-bg)",
              borderRadius: "999px",
              opacity: isGenerating ? 0.7 : 1,
            }}
          >
            {isGenerating ? "Reflecting..." : "Generate Chapter"}
          </button>
        )}
      </div>

      <div
        aria-hidden="true"
        style={{
          marginTop: "12px",
          height: "2px",
          background: "var(--color-border)",
          width: "100%",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPercent}%`,
            background: isEligible ? "var(--color-text-primary)" : "var(--color-accent)",
            transition: "width 400ms ease, background-color 400ms ease",
          }}
        />
      </div>

      {error && (
        <p className="text-label-sm mt-3" style={{ color: "red" }}>
          {error}
        </p>
      )}
    </section>
  );
};
