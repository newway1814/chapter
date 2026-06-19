-- ============================================================
-- Chapter App — Initial Database Schema
-- Run this in your Supabase SQL Editor or via supabase db push
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────────────────────────
-- Table: entries
-- One row per valid voice journal entry.
-- Audio is never stored (ADR-0002 — ephemeral audio).
-- ──────────────────────────────────────────────────────────────
create table if not exists entries (
  id           uuid         primary key default uuid_generate_v4(),
  user_id      uuid         not null references auth.users(id) on delete cascade,
  transcript   text         not null,
  recorded_at  timestamptz  not null,
  created_at   timestamptz  not null default now()
);

-- Index for rolling window queries (getEntriesInWindow)
create index if not exists entries_user_recorded_at_idx
  on entries (user_id, recorded_at desc);

-- Row Level Security: users can only see and write their own entries
alter table entries enable row level security;

create policy "Users can insert their own entries"
  on entries for insert
  with check (auth.uid() = user_id);

create policy "Users can select their own entries"
  on entries for select
  using (auth.uid() = user_id);

-- No update or delete policies — entries are immutable by design

-- ──────────────────────────────────────────────────────────────
-- Table: prompts
-- Stores the "Interviewer Question" generated after each entry.
-- Tomorrow's prompt is read at the start of the next session.
-- Generated as part of the Post-Entry Call (ADR-0001).
-- ──────────────────────────────────────────────────────────────
create table if not exists prompts (
  id           uuid         primary key default uuid_generate_v4(),
  user_id      uuid         not null references auth.users(id) on delete cascade,
  entry_id     uuid         references entries(id) on delete set null,
  question     text         not null,
  created_at   timestamptz  not null default now()
);

-- Index for getTodayPrompt (most recent prompt per user)
create index if not exists prompts_user_created_at_idx
  on prompts (user_id, created_at desc);

-- Row Level Security
alter table prompts enable row level security;

create policy "Users can insert their own prompts"
  on prompts for insert
  with check (auth.uid() = user_id);

create policy "Users can select their own prompts"
  on prompts for select
  using (auth.uid() = user_id);
