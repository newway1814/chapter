# Chapter — AI Documentary Journal App

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