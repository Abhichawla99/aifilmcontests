-- ============================================================
-- AI Film Contests — confirm before sending (2026-11-03)
-- Paste this ONCE into: Supabase Dashboard → SQL Editor → Run,
-- BEFORE deploying the code that asks new signups to confirm.
-- Safe to re-run.
-- ============================================================

-- A signup is now pending (confirmed = false, confirmed_at null) until they
-- click the link in the confirm email. Unsubscribing still sets confirmed =
-- false but keeps confirmed_at, which is how the two are told apart.
alter table subscribers add column if not exists confirmed_at        timestamptz;
alter table subscribers add column if not exists confirm_sent_at     timestamptz;  -- last confirm email, so a resubmit can't flood an inbox
alter table subscribers add column if not exists confirm_reminded_at timestamptz;  -- the one reminder a day later
alter table subscribers add column if not exists pack_sent_at        timestamptz;  -- the creator pack email went out

-- Everyone already on the list was confirmed the moment they signed up. New
-- signups always get confirm_sent_at, so a re-run leaves pending ones alone.
update subscribers set confirmed_at = created_at where confirmed_at is null and confirm_sent_at is null;

create index if not exists subscribers_pending_idx on subscribers (created_at) where confirmed_at is null;
