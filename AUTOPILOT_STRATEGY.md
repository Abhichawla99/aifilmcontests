# AI Film Contests — Autopilot Strategy

## Goal
Turn `aifilmcontests.com` into the most complete, freshest, and most useful database of AI film contests worldwide — with email alerts that make it sticky.

## Core product promise
**Never miss an AI film contest worth entering.**

That means the site must win on:
- freshness
- completeness
- deadline accuracy
- urgency alerts
- low-noise email delivery

## Current repo reality
The repo already has a strong base:
- Next.js frontend
- Supabase contests + subscribers tables
- Resend email support
- scripts for seeding, updating, and notifying subscribers
- sitemap/robots already present

But it is **not yet true autopilot**.

## Main gaps found

### 1. Contest ingestion is still mostly hand-curated
`scripts/update-contests.mjs` is a manually maintained list of contests.
That is useful for a one-time update, but not durable automation.

### 2. No source-of-truth pipeline
There is no normalized source registry like:
- official site
- FilmFreeway page
- Festhome page
- organizer socials/news page
- last checked timestamp
- confidence score
- evidence snapshot

Without that, the site will drift stale.

### 3. No change-detection workflow
Right now there is no proper system to detect:
- newly opened contests
- changed deadlines
- updated prizes
- status flips to closed

### 4. Subscriber schema mismatch
The app code expects subscriber fields like `name`, but `supabase/schema.sql` currently defines only:
- id
- email
- confirmed
- created_at

This should be fixed before scaling email flows.

### 5. Email logic exists, but triggering is weak
The email scripts are decent, but the missing piece is reliable daily orchestration around:
- ingest
- verify
- diff
- notify
- log

### 6. No editorial / SEO expansion layer yet
The directory can rank, but the strongest growth path is also:
- /closing-soon
- /new-this-week
- /free-ai-film-contests
- /ai-film-contests-with-cash-prizes
- /student-ai-film-contests
- monthly roundup pages

## The autopilot architecture

## Layer 1 — Structured contest database
Expand the contest model to include fields like:
- `source_type` (official, filmfreeway, festhome, social, press release)
- `source_url`
- `source_urls` (array if multiple)
- `last_verified_at`
- `last_seen_at`
- `verification_notes`
- `confidence_score`
- `country`
- `region`
- `runtime_min`
- `runtime_max`
- `requires_subtitles`
- `student_only`
- `team_allowed`
- `cash_prize_amount`
- `currency`
- `fee_amount`
- `is_free`
- `closing_soon`
- `is_new`
- `slug`

This is what makes the site actually filterable and valuable.

## Layer 2 — Source registry
Create a new table: `contest_sources`

Each source row should track:
- source id
- contest id (nullable until matched)
- source url
- domain
- source type
- canonical organizer name
- fetched_at
- parse_status
- extracted deadline
- extracted prize
- extracted eligibility
- extracted title
- hash/content fingerprint
- change_detected
- raw snapshot path or JSON blob

This lets the system verify against evidence instead of vibes.

## Layer 3 — Daily ingest pipeline
Run daily in this order:

### Step A: Discover
Search and refresh known source pools:
- official festival sites
- FilmFreeway AI-related listings
- Festhome
- relevant organizer pages
- known AI creator communities
- AI film festival roundups

### Step B: Fetch
Pull the current page content for each source.

### Step C: Extract
Extract structured fields:
- name
- organizer
- deadline
- prize
- eligibility
- fees
- runtime
- location
- event date
- submission status

### Step D: Match / dedupe
Determine if this is:
- existing contest updated
- same contest on another source
- truly new contest

### Step E: Verify
Require either:
- official source confirmation, or
- multiple corroborating sources before public publish

### Step F: Upsert
Update Supabase cleanly.

### Step G: Diff
Create a change set:
- new contests
- contests closing in 7 days
- contests whose deadline changed
- contests newly closed

### Step H: Notify
Send:
- instant new-contest alert (optional same day)
- daily digest of newly added contests
- 7-day closing reminders
- weekly roundup

## Layer 4 — Email engine
Best email products:

### 1. New contests today
Short email.
Only truly new verified contests.

### 2. Closing soon
Send at:
- 7 days
- 3 days
- 1 day (optional later)

### 3. Weekly digest
Includes:
- newly added
- biggest prizes
- free entries
- deadlines this week

### 4. Personalized filters later
Allow subscribers to pick:
- free only
- under 5 min
- student eligible
- ads/commercials
- narrative shorts
- experimental
- region-specific

That makes the list much stickier.

## Layer 5 — SEO / growth layer
Autopilot should not just maintain the DB. It should also generate traffic pages.

Highest-value pages:
- `/contests/closing-soon`
- `/contests/new`
- `/contests/free`
- `/contests/cash-prizes`
- `/contests/student`
- `/contests/commercials`
- `/contests/experimental`
- `/blog/best-ai-film-contests-this-month`
- `/blog/ai-film-contests-closing-this-week`

Why this matters:
- directory pages capture filter intent
- blog pages capture roundup intent
- both feed email signup CTA

## Layer 6 — Trust / defensibility layer
To make this believable and useful, show freshness everywhere.

Every contest page/listing should show:
- last verified date
- official source link
- prize
- deadline
- status
- eligibility summary
- fee
- runtime

Optional but strong:
- “verified from official source” badge
- “deadline changed” badge
- “newly added” badge

## Recommended autopilot phases

## Phase 1 — Stabilize foundation
1. fix subscriber schema mismatch (`name`)
2. add missing contest normalization fields
3. create `contest_sources` table
4. create structured status/diff logging table
5. move hardcoded contest updates into source-driven ingestion

## Phase 2 — Reliable daily ops
1. build daily fetch/extract/verify pipeline
2. log changes every run
3. auto-send:
   - new contests
   - closing soon
   - weekly digest
4. add run summaries and failure alerts

## Phase 3 — Coverage expansion
1. build a canonical source list of every likely organizer/platform
2. add source tags by geography + contest type
3. expand the database worldwide
4. maintain dedupe rules and contest family matching across platforms

## Phase 4 — SEO + newsletter growth
1. launch filter pages
2. launch roundup pages
3. add stronger newsletter CTAs
4. add archive pages for old contests
5. add structured metadata per contest page

## Best way to actually run it on autopilot
Use two automations, not one.

### Automation A — Daily data run
Runs once every morning.
Tasks:
- fetch all tracked sources
- detect updates
- upsert verified contest records
- mark closed contests
- generate diff summary

### Automation B — Daily email run
Runs after the data run.
Tasks:
- send newly added contests
- send closing soon reminders
- optionally send editorial digest if enough changes happened

Optional:
### Automation C — Weekly editorial build
Generates:
- weekly roundup page
- weekly roundup email
- “best current contests” page refresh

## What I think the best version is
Do **not** try to index the whole world as unstructured text.
Instead:
- track the world through structured source coverage
- verify the important fields
- publish only normalized contest entries
- use email urgency as the retention engine

That becomes a real business/data asset.

## Highest-impact next actions
1. Fix the schema mismatch and normalize the DB model
2. Add a `contest_sources` table and daily source-based ingestion flow
3. Replace manual update scripts with a change-detection pipeline
4. Add `new`, `closing soon`, and `free` pages
5. Start sending daily / weekly email automatically from verified diffs

## My verdict
The idea is good **if it becomes a live intelligence product, not just a directory**.

The moat is:
- complete coverage
- verified deadlines
- fast updates
- useful email alerts

That is worth building.
