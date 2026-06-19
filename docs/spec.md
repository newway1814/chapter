# Spec: Chapter - AI Documentary Journal App

## Objective
Build a daily voice journaling app designed to persuade non-journalers to build a habit. It removes friction through a 60-second audio limit and drives retention by combining an immediate feedback loop (AI-generated questions and insights) with a long-term reward (a monthly text-and-charts "Chapter" documentary).

## Tech Stack
- Next.js 14 App Router
- TypeScript (Strict Mode)
- Tailwind CSS
- Supabase (@supabase/supabase-js, Auth, Postgres)
- OpenAI Whisper API (Transcription)
- Gemini API (Insight & Chapter Generation)
- Recharts, html2canvas (For Chapters)
- Vercel (Deployment)
- pnpm (Package Manager)

## Commands
- Build: `pnpm build`
- Dev: `pnpm run dev`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint`
- Test: `pnpm test` (Vitest)

## Project Structure
- `src/app/` → Next.js App Router pages and API routes
- `src/components/` → Reusable UI and layout components
- `src/lib/` → Shared utilities (Supabase client, AI wrappers)
- `src/types/` → Zod schemas and derived TypeScript types
- `docs/` → Specs, ADRs, Design System, Context Glossary
- `tests/` → Vitest unit tests

## Code Style
- **TypeScript Strict:** No `any` type, use `unknown` + Zod narrowing. No non-null assertions (`!`).
- **Exports:** Named exports only (except Next.js page/layout components).
- **Types:** Prefer `type` over `interface`. Use discriminated unions. Use `satisfies` operator.
- **Validation:** All API responses and inputs validated with Zod schemas at boundaries.
- **Function Size:** Keep under 40 lines, extract aggressively.

Example:
```typescript
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1)
});

type User = z.infer<typeof UserSchema>;

export const getUser = (data: unknown): User | null => {
  const result = UserSchema.safeParse(data);
  return result.success ? result.data : null;
};
```

## Testing Strategy
- **Framework:** Vitest for unit tests.
- **Focus:** Unit tests for all pure functions in `src/lib` (especially Zod validators and AI prompt builders).
- **CI/CD:** `pnpm typecheck` and `pnpm test` required on all PRs.

## Boundaries
- **Always:** Run `pnpm typecheck` before committing. Use Supabase RLS. Mobile-first design.
- **Ask first:** Before adding new heavy dependencies or changing database schema.
- **Never:** Bypass RLS with the service role key on the client. Never skip error handling in API routes. Never store raw audio files (per ADR-0002).

## Success Criteria
- User can log in via Supabase Auth.
- User can record up to 60 seconds of audio.
- Audio is transcribed and immediately deleted (ephemeral).
- UI instantly displays an AI-generated insight and silently saves tomorrow's prompt.
- App generates a "Chapter" summary view using Recharts if the user has >= 10 entries in 30 days.
