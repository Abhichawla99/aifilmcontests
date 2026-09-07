-- ============================================================
-- AI Film Contests — Autopilot migration (2026-09-07)
-- Paste this ONCE into: Supabase Dashboard → SQL Editor → Run
-- Safe to re-run: every statement is IF NOT EXISTS / idempotent.
-- ============================================================

-- ── Contests: paid featured listings + organizer contact ─────
alter table contests add column if not exists featured_until        timestamptz;
alter table contests add column if not exists featured_paid_at      timestamptz;
alter table contests add column if not exists organizer_email       text;
alter table contests add column if not exists organizer_contact_url text;
alter table contests add column if not exists outreach_sent_at      timestamptz;
alter table contests add column if not exists outreach_status       text;   -- 'draft' | 'sent' | 'replied' | 'declined'

-- ── Subscribers: where they came from + last engagement ──────
alter table subscribers add column if not exists source           text;    -- landing page path at signup
alter table subscribers add column if not exists last_engaged_at  timestamptz;
alter table subscribers add column if not exists bounced_at       timestamptz;

-- ── Per-recipient send log (what we sent to whom) ────────────
create table if not exists email_sends (
  id              uuid default gen_random_uuid() primary key,
  email_type      text not null,
  recipient       text not null,
  subject         text,
  resend_email_id text,
  contest_ids     text[],
  sent_at         timestamptz default now()
);
create index if not exists email_sends_sent_at_idx   on email_sends (sent_at desc);
create index if not exists email_sends_recipient_idx on email_sends (recipient);

-- ── Engagement events from the Resend webhook ────────────────
create table if not exists email_events (
  id              uuid default gen_random_uuid() primary key,
  event_type      text not null,        -- delivered | opened | clicked | bounced | complained | delivery_delayed
  recipient       text,
  resend_email_id text,
  subject         text,
  clicked_url     text,
  created_at      timestamptz default now(),
  raw             jsonb
);
create index if not exists email_events_created_idx   on email_events (created_at desc);
create index if not exists email_events_recipient_idx on email_events (recipient);
create index if not exists email_events_type_idx      on email_events (event_type);

-- ── What every robot did, every day ──────────────────────────
create table if not exists agent_runs (
  id       uuid default gen_random_uuid() primary key,
  task     text not null,                -- research | seo | optimizer | sales | notify | scorecard | outreach | sale
  status   text not null,                -- ok | failed | skipped
  summary  text,
  details  jsonb,
  ran_at   timestamptz default now()
);
create index if not exists agent_runs_ran_at_idx on agent_runs (ran_at desc);

-- ── Daily plain-English report archive ───────────────────────
create table if not exists daily_reports (
  id          uuid default gen_random_uuid() primary key,
  report_date date unique not null,
  headline    text,
  text_report text,
  data        jsonb,
  created_at  timestamptz default now()
);

-- ── Organizer outreach log (drafts + sent) ───────────────────
create table if not exists outreach_log (
  id              uuid default gen_random_uuid() primary key,
  contest_id      text,
  organizer_email text,
  mode            text not null,         -- draft | sent
  subject         text,
  body            text,
  resend_email_id text,
  created_at      timestamptz default now()
);

-- ── Tiny key/value settings (no redeploy needed to flip) ─────
create table if not exists settings (
  key        text primary key,
  value      text,
  updated_at timestamptz default now()
);

-- ── Row Level Security: service_role only for all new tables ─
alter table email_sends   enable row level security;
alter table email_events  enable row level security;
alter table agent_runs    enable row level security;
alter table daily_reports enable row level security;
alter table outreach_log  enable row level security;
alter table settings      enable row level security;

drop policy if exists "email_sends_service_only"   on email_sends;
drop policy if exists "email_events_service_only"  on email_events;
drop policy if exists "agent_runs_service_only"    on agent_runs;
drop policy if exists "daily_reports_service_only" on daily_reports;
drop policy if exists "outreach_log_service_only"  on outreach_log;
drop policy if exists "settings_service_only"      on settings;

create policy "email_sends_service_only"   on email_sends   for all using (auth.role() = 'service_role');
create policy "email_events_service_only"  on email_events  for all using (auth.role() = 'service_role');
create policy "agent_runs_service_only"    on agent_runs    for all using (auth.role() = 'service_role');
create policy "daily_reports_service_only" on daily_reports for all using (auth.role() = 'service_role');
create policy "outreach_log_service_only"  on outreach_log  for all using (auth.role() = 'service_role');
create policy "settings_service_only"      on settings      for all using (auth.role() = 'service_role');

grant all on table email_sends   to service_role;
grant all on table email_events  to service_role;
grant all on table agent_runs    to service_role;
grant all on table daily_reports to service_role;
grant all on table outreach_log  to service_role;
grant all on table settings      to service_role;

-- Marker row so the app can tell the migration has been applied
insert into settings (key, value) values ('migration_2026_09_07', 'applied')
  on conflict (key) do update set value = 'applied', updated_at = now();
