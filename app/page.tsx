import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { RecorderWrapper } from "@/src/components/RecorderWrapper";

/**
 * Dashboard — the main journaling screen.
 * This is a Server Component: auth is checked server-side, never on the client.
 *
 * Issue #1 acceptance criteria: "Empty dashboard renders"
 * Issues #2, #3, #4 will progressively fill this shell with:
 *   - The AudioRecorder component
 *   - The InstantInsight card
 *   - The Chapter progress tracker
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error !== null || user === null) {
    redirect("/login");
  }

  return (
    <main className="content-column py-12">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="mb-12">
        <p className="text-label-sm" style={{ color: "var(--color-text-muted)" }}>
          Your journal
        </p>
        <h1 className="text-display mt-1">Chapter</h1>
      </header>

      <hr className="rule mb-12" />

      {/* ── Today's prompt placeholder ──────────────────────────── */}
      {/* Issue #3 will replace this with the real getTodayPrompt() call */}
      <section aria-label="Today's prompt" className="mb-12">
        <p className="text-label-sm mb-3" style={{ color: "var(--color-text-muted)" }}>
          Today's question
        </p>
        <p className="text-narrative" style={{ color: "var(--color-text-primary)" }}>
          What's one thing that surprised you today?
        </p>
      </section>

      {/* ── Recorder ────────────────────────────────────────────── */}
      {/* AudioRecorder is a Client Component — wrapped to avoid RSC boundary error */}
      <section
        aria-label="Voice recorder"
        className="flex flex-col items-center gap-6 py-12"
      >
        <RecorderWrapper />
      </section>

      <hr className="rule mb-12" />

      {/* ── Chapter progress placeholder ────────────────────────── */}
      {/* Issue #4 will replace this with <ChapterProgress /> */}
      <section aria-label="Chapter progress">
        <p className="text-label-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
          Progress
        </p>
        <p
          className="text-narrative"
          style={{ color: "var(--color-text-primary)" }}
        >
          0 of 10 entries toward your Chapter
        </p>
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
              width: "0%",
              background: "var(--color-accent)",
              transition: "width 400ms ease",
            }}
          />
        </div>
      </section>
    </main>
  );
}
