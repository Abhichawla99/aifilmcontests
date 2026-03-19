-- ============================================================
-- AI Film Contests — Supabase Schema
-- Run this once in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── Contests table ──────────────────────────────────────────
create table if not exists contests (
  id              text primary key,
  name            text not null,
  organizer       text not null,
  description     text not null,
  deadline        date not null,
  submission_open date,
  prize           text not null,
  prize_details   text[],
  url             text not null,
  status          text not null check (status in ('open', 'upcoming', 'closed')),
  categories      text[],
  ai_tools_allowed text[],
  eligibility     text,
  entry_fee       text,
  featured        boolean default false,
  tags            text[],
  location        text,
  event_date      date,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Auto-update updated_at on every write
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists contests_updated_at on contests;
create trigger contests_updated_at
  before update on contests
  for each row execute function update_updated_at();

-- ── Subscribers table ────────────────────────────────────────
create table if not exists subscribers (
  id         uuid default gen_random_uuid() primary key,
  email      text unique not null,
  confirmed  boolean default true,
  created_at timestamptz default now()
);

-- ── Row Level Security ───────────────────────────────────────
alter table contests enable row level security;
alter table subscribers enable row level security;

-- Contests: anyone can read, only service_role can write
drop policy if exists "contests_public_read" on contests;
create policy "contests_public_read"
  on contests for select using (true);

drop policy if exists "contests_service_write" on contests;
create policy "contests_service_write"
  on contests for all using (auth.role() = 'service_role');

-- Subscribers: service_role only (never expose to public)
drop policy if exists "subscribers_service_only" on subscribers;
create policy "subscribers_service_only"
  on subscribers for all using (auth.role() = 'service_role');
