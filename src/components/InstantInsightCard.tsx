import { ReactNode } from "react";

type InstantInsightCardProps = {
  insight: string;
};

/**
 * InstantInsightCard — The "Magic" moment of the app.
 * Displays the AI's warm, validating response immediately after recording.
 */
export const InstantInsightCard = ({ insight }: InstantInsightCardProps) => {
  if (!insight) return null;

  return (
    <div
      className="p-6 mt-8"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        maxWidth: "400px",
        width: "100%",
        textAlign: "left",
        animation: "fadeIn 500ms ease",
      }}
      role="region"
      aria-label="AI Insight"
    >
      <p className="text-label-sm mb-3" style={{ color: "var(--color-text-muted)" }}>
        Instant insight
      </p>
      <p className="text-body" style={{ color: "var(--color-text-primary)" }}>
        {insight}
      </p>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
