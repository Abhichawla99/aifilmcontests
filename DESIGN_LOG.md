# Design log

One small, visible change a day. Not a redesign. Read this whole file before choosing
the next one, so the site converges on one voice instead of drifting.

## Principles

*(Rewritten 2026-09-08 when the site moved from dark to paper. Entries above this date
describe the old dark theme; the reasoning still applies, the colours do not.)*

- **Ground:** warm paper `#FBFAF8`, never pure white. Ink `#1B1916` for headings,
  `#3E3A33` for body. Two ultra-soft pastel washes sit behind everything (BackgroundFX).
- **Colour carries meaning:** each contest category owns one pastel tint and one emoji,
  defined once in `src/lib/theme.ts`. A card is tinted by its first category, so the grid
  reads as a colour-coded index rather than 60 identical boxes. Closed contests go to a
  muted paper grey. Never introduce a tint outside that file.
- **Emoji as a private language:** 🎞️ short film, 📽️ feature, 🎠 animation, 🫧 experimental,
  🗺️ documentary, 🪩 music video, 🏮 commercial, 🎟️ advertising. Chosen because no other AI
  product uses them. Never 🚀 ✨ ⚡ 🔥 🎯, and never an emoji standing in for a UI icon.
- **Type:** Space Grotesk for display, headings and figures; Inter for body. Tabular
  figures wherever numbers stack — deadlines, prizes, counts.
- **Accent:** indigo `#4F46E5`, flat. No gradient buttons, no glow shadows: they were
  tuned for a dark ground and read as cheap on paper. Green means open, amber means
  coming soon, burnt orange `#C2410C` is reserved for a deadline inside seven days.
- **Structure:** hairlines over boxes, flat fills over blur and glass. Shadows only to
  lift a card a little on hover.
- **Illustration:** original hand-drawn line art in `src/components/Illustrations.tsx` —
  2px ink strokes, slight wobble, halftone shading, one pastel spot fill. Film subjects,
  never generic tech icons. If a new drawing is needed, draw it in that file in that
  style. Never trace or copy another site's artwork.
- **Density:** contest data set like a good festival programme. Specificity is the
  aesthetic — real deadlines, real prize figures, days-left counts.
- **Motion:** only with purpose. The ticker, the countdown, hover reveals, visible focus
  rings. Nothing that follows the cursor.
- **375px must look intentional**, never squeezed. Verify it, do not assume it.

---

## 2026-09-08 (2) — The contest page, rebuilt as a festival programme entry

**Changed** — `src/app/contests/[id]/page.tsx`, the site's second most important page
type and the one every SEO page links into.

**Was** — a title, a wide deadline banner, then six equal-weight boxes (Prize, AI Tools,
Eligibility, Entry Fee, Categories, Key Dates) in a two-column grid. Nothing led,
the boxes left large ragged gaps because their contents differ wildly in length, the
Apply button appeared twice, and the page dead-ended with no next step. It also dropped
the category colour and emoji entirely, so clicking a blue film-strip card landed you on
a page with no visible relationship to it.

**Now** —
- A **header band tinted with the contest's category**, carrying that category's emoji at
  40px, the status, the name and the organizer. The page and the card that led here are
  now visibly the same object.
- **Prose left, spec rail right.** The description gets a real measure at 17px, then
  Prize (the figure large, the breakdown as hairline-separated rows rather than bullets),
  Who can enter, and AI tools allowed as chips.
- **A sticky spec card** holding everything you decide with: days left as the hero
  figure, the date under it, one Apply button, then hairline rows for entry fee,
  submissions open, festival date, location, category chips, and a line saying the page
  is checked against the organizer's official page every morning. It follows you down
  the page, so Apply is never more than a glance away.
- **On a phone the rail moves above the description** (`order: -1`), because the
  deadline and Apply are the decision and should not sit below a thousand words of prize
  breakdown.
- **A reminder block and three related contests** at the foot, so the page offers a next
  step instead of ending. Related means still open, same first category, closing soonest.

**Why the sticky rail** — a contest listing is a job listing: long prose that earns
trust, next to hard facts that drive the decision. Splitting them lets each be set
properly instead of compromising into six identical boxes.

**Also** — a category that falls back to the generic style (`any genre`, `open`,
`hybrid`) no longer shows a chip reading just "Contest" beside a real one.

**Verified** — 1440px and a true 390px viewport, no horizontal overflow.

## 2026-09-08 — Paper, pastel and a set of drawings

**Changed** — the whole surface, at Abhi's request: light instead of dark, Notion-ish
colour-coded cards, and hand-drawn illustrations. `globals.css` rewritten; every dark
value mapped to a paper equivalent across 23 files; `src/lib/theme.ts` added as the one
place category colour and emoji are defined; `ContestCard` rebuilt as a flat tinted tile
led by its category emoji; `Illustrations.tsx` added with four original line drawings;
a three-up illustrated row added to the homepage between the hero and the browse grid.

**Why** — the dark theme leaned on the things that make a site read as machine-made:
a WebGL nebula, animated film grain, cursor-chasing orbs, gradient text, glassmorphism,
glow shadows on every button. All of it was decoration doing no work. Paper with one
pastel per category does work: you can tell an animation contest from a documentary one
at a glance, down a long grid, without reading a word.

**Inspired by** — Notion's marketing pages, which Abhi sent: pastel cards each carrying a
single line drawing, generous white space, and type doing the hierarchy. The drawings
here are our own, in that spirit but film-subject and never traced.

**Removed** — `BackgroundFX` is now two static pastel washes instead of a WebGL shader
plus a per-frame grain canvas (two `requestAnimationFrame` loops gone). `MouseOrbs`
renders nothing. Card 3D tilt, mouse-tracked spotlight and shimmer sweep are gone.
The site got quieter and faster in the same change.

**Kept deliberately** — the three-up row is a three-column feature grid, which the
playbook warns against. It earns its place because the drawings are original, the copy
is specific, and the first card states live counts from the database rather than filler.
Do not replace it with icons and slogans; if it stops being true, delete it.

**Also fixed** — the prize total formatted as "$1999K+" and now reads "$2.0M+".
`normalizeCategory` folds the 140+ freeform category strings the research robot has
written into the eight canonical ones, so chips stay legible and deduplicated; the
research playbook now restricts `categories` to those eight and sends genres to `tags`.

**Verified** — 1440px and a true 390px iPhone viewport, via the CDP screenshot tool
described in the design playbook. `document.scrollWidth` equals `window.innerWidth` at
390, so there is no horizontal overflow.

## 2026-09-08 — One deadline, spoken the same way on every card

**Changed** — `src/components/ContestCard.tsx`. The deadline is now the primary figure on
the card: time remaining ("22 days left", "8 hours left") at 13px Space Grotesk 700 with
tabular figures, over the date it falls on ("SEP 30, 2026") as a 9.5px small-caps caption.
Contests that are not open yet, or are closed, take the same two-line shape with the date
as the figure and a `DEADLINE` caption. Prize figures got tabular numerals too. The
countdown no longer blinks — red is enough.

**Why** — the deadline column was speaking five languages at once. Down one screen of the
homepage grid you could read "9h left", "1d 9h", "5d 9h", "Sep 19, 2026" and "Sep 26,
2026" — five formats for one fact, all at 11px, all unlabelled, all quieter than the PRIZE
block underneath them. The single thing that decides whether a filmmaker enters could not
be scanned or compared. Relative time is the decision ("can I still make this?"), the
absolute date is the proof; showing both, always in the same order, makes the column
legible and makes the site look like it verifies what it publishes.

**Inspiration** — Metrograph's showtimes page. Time is the primary navigation axis and it
is formatted identically everywhere: a fixed band of day abbreviations across the top,
every listing led by the same date shape. Nothing is rephrased or re-abbreviated between
items, so the eye can move down the column without re-reading. Adapted, not copied: our
listings are deadlines rather than showtimes, so the figure is what remains and the date
is the caption beneath it. (Mubi blocked the fetch; Are.na and Metrograph read fine.)

**Before / after** — `reports/design/2026-09-08-before.png`,
`reports/design/2026-09-08-before-375.png`, `reports/design/2026-09-08-after.png`,
`reports/design/2026-09-08-after-375.png`.

**Noted for a later run, not done today** — the hero stat strip renders the prize total as
`$1999K+` (`src/app/page.tsx`, `(totalPrize / 1000).toFixed(0)`). It reads as a bug and
undercuts the credibility of every other number on the page; `$2.0M+` is the honest form.
One change a day, so it waits.
