"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/src/lib/supabase/client";

/**
 * Login page — email magic link auth.
 * Low-friction: user enters email, gets a link, no password to remember.
 * Matches PRD User Story #1: "I want to authenticate easily so that my
 * private journal entries are secure."
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error !== null) {
      setErrorMessage(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  };

  return (
    <main className="content-column flex flex-col justify-center py-24">
      {/* ── Brand heading ─────────────────────────────────────── */}
      <header className="mb-12">
        <p
          className="text-label-sm mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Welcome to
        </p>
        <h1 className="text-display">Chapter</h1>
        <p
          className="text-narrative mt-4"
          style={{ color: "var(--color-text-muted)", maxWidth: "420px" }}
        >
          Speak for 60 seconds a day. We&rsquo;ll turn your voice into a monthly
          memoir.
        </p>
      </header>

      <hr className="rule mb-12" />

      {/* ── Login form ────────────────────────────────────────── */}
      {status === "sent" ? (
        <div className="animate-fade-in" aria-live="polite">
          <p className="text-label-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
            Check your inbox
          </p>
          <p className="text-narrative">
            We&rsquo;ve sent a sign-in link to <strong>{email}</strong>.
            Click it to open your journal.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-8">
            <label
              htmlFor="email"
              className="text-label-sm block mb-3"
              style={{ color: "var(--color-text-muted)" }}
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="input-underline"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
              disabled={status === "loading"}
            />
          </div>

          {status === "error" && (
            <p
              className="text-label-sm mb-4 animate-fade-in"
              style={{ color: "var(--color-accent)" }}
              role="alert"
            >
              {errorMessage}
            </p>
          )}

          <button
            id="login-submit"
            type="submit"
            className="btn-primary"
            disabled={status === "loading" || email.trim() === ""}
            style={{ minWidth: "160px" }}
          >
            {status === "loading" ? "Sending…" : "Send sign-in link"}
          </button>
        </form>
      )}
    </main>
  );
}
