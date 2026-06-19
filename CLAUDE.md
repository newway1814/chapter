# Chapter — AI Documentary Journal App

## Commands
- Dev: `pnpm run dev`
- Build: `pnpm build`
- Typecheck: `pnpm typecheck` ← run after every file change
- Lint: `pnpm lint`
- Test: `pnpm test` (Vitest)

## Project
A Next.js 14 app where users record 60-second voice notes daily.
At month end, Gemini generates a narrative documentary of their month.

## Stack
- Next.js 14 App Router (TypeScript, strict mode)
- Tailwind CSS
- Supabase (auth, Postgres, Storage)
- OpenAI Whisper API (transcription)
- Gemini API (narrative generation)
- Recharts (charts), html2canvas (share cards)
- pnpm, Vercel deployment

## Code style (Matt Pocock standards)
- TypeScript strict mode, no `any`, no type assertions
- Zod for all runtime validation
- Named exports only, no default exports except page components
- Prefer `type` over `interface` for object shapes
- Keep functions under 40 lines, extract aggressively

## Agent rules
- Always run `pnpm typecheck` after changes
- Never skip error handling in API routes
- Use Supabase RLS — never bypass with service role on the client
- Mobile-first responsive design

## TypeScript rules (Matt Pocock standards)
- Run `pnpm typecheck` after every file change
- No `any` type — use `unknown` + Zod narrowing instead
- No non-null assertions (`!`) — handle null explicitly  
- Prefer discriminated unions over optional properties
- All API responses validated with Zod schemas at the boundary
- Use `satisfies` operator to validate without widening types

## Design System (Warm Minimalism)
- No rounded corners. Heavy whitespace. Clean grid.
- Headings: `Playfair Display` (serif)
- Narrative body: `Source Serif 4`
- UI chrome: `Inter`
- See `docs/design_system.md` for full layout specs.

## Testing Seams (from PRD)
- **AI Logic Seam:** Gemini/Whisper prompt construction and response parsing live in `src/lib/ai-parsers.ts` as pure functions. Test with Vitest + mocked network responses. Never call the real API in tests.
- **Audio Recording Seam:** The recorder exposes `onRecordingComplete(transcript: string)`. Test UI/state transitions by passing a string — no real mic needed.
- **DB Access Seam:** All Supabase calls go through functions in `src/lib/db.ts`. UI components are tested against mocked versions of these functions.
- Tests assert external behavior (correct return data), NOT implementation details (fetch headers, internal method calls).