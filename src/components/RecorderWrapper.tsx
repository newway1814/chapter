"use client";

import { useState } from "react";
import { AudioRecorder } from "@/src/components/AudioRecorder";
import { InstantInsightCard } from "@/src/components/InstantInsightCard";

type InsightData = {
  instant_insight: string;
  tomorrow_question: string;
};

/**
 * RecorderWrapper — thin "use client" island that bridges the Server Component
 * dashboard with the AudioRecorder client component.
 */
export const RecorderWrapper = () => {
  const [insight, setInsight] = useState<InsightData | null>(null);

  return (
    <div className="flex flex-col items-center w-full">
      <AudioRecorder
        onRecordingComplete={async (transcript) => {
          try {
          const res = await fetch("/api/post-entry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transcript }),
          });

          if (!res.ok) {
            console.error("Failed to fetch insight");
            return;
          }

            const data = await res.json();
            setInsight(data);
          } catch (err) {
            console.error("Error calling post-entry:", err);
          }
        }}
      />

      {insight && <InstantInsightCard insight={insight.instant_insight} />}
    </div>
  );
};
