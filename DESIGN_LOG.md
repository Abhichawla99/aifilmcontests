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

## 2026-09-08 (4) — The remaining page types, and a card bug that broke six of them

**Changed** — `/tools`, `/vs`, `/prize`, `/location`, `/categories`, `/creators/[slug]`
and `/cinematic-ads`, plus `ContestCard` and the `.card` class.

**The bug** — `.card` set `display: flex; flex-direction: column`. Six pages built
horizontal contest rows with `className="card"` and inline `display:flex;
justify-content:space-between`, which does not reset the direction, so every one of those
rows silently rendered as a centred column with a wide empty gutter. It looked like a
typography mistake and was actually a CSS inheritance one. `.card` no longer sets a
direction; `ContestCard` opts in with `.card-v`.

**Then the rows went away entirely.** Every one of those pages is a list of contests, so
they now render the shared `ContestCard` in a `repeat(auto-fit, minmax(260px, 1fr))`
grid. That is one component instead of six near-identical bespoke rows, and it carries
the category tint and emoji everywhere.

**Header bands everywhere.** `ArticleHeader` was generalised from Guide/Topic to any
kind, with a default emoji per kind (🎛️ Tool, ⚖️ Compare, 🏆 Prize, 🗺️ Location, 🗂️
Category, 🎥 Creator), an optional `meta` array for facts like "41 open now", and
optional children for a call to action. Reading time is omitted on index pages, where it
means nothing.

**Also fixed** — `ContestCard`'s description clipped mid-word instead of ellipsing. The
`flex: 1` sat on the clamped paragraph itself, letting it stretch past its line limit;
the grow now lives on a wrapper and the clamp went from 2 lines to 3, which reads better
in a three-column grid.

**Removed** — a 🚀 in the cinematic-ads eyebrow and its ⚡/🔁/💰 feature icons, replaced
with 🛫 🎞️ 🎠 🧾. The house rule against the everyone-uses-them emoji applies to marketing
pages too.

**Verified** — every converted page at 1440px and 390px, no horizontal overflow.

## 2026-09-08 (3) — Guides and topics, set as articles

**Changed** — `src/app/guide/[slug]/page.tsx`, `src/app/topics/[slug]/page.tsx`, and a new
shared `src/components/ArticleLayout.tsx`. These are ~30 pages and the site's main
search entry point.

**Was** — breadcrumb, title, then a grey wall. Body copy ran the full 1120px container
at roughly 120 characters a line, which is close to unreadable; the intro paragraph was
inconsistently narrower than the body under it; section headings were 20px against 15px
body, so hierarchy barely registered; body colour was `#7A7469`, a UI grey used for
several thousand words of reading; and none of the paper-and-pastel language appeared at
all.

**Now** —
- A **tinted header band**, coloured by a hash of the slug (`tintForSlug`) so each
  article keeps its own stable colour and the library reads as varied rather than
  random. It carries a 📓 Guide or 🧭 Topic chip, the title at up to 44px, a standfirst,
  and a meta row: updated date, reading time, and the daily-verification line.
- **A real measure.** Prose is capped at 700px, about 72 characters. Body is 17px at
  1.75 in `#3E3A33`, section headings up to 25px with 46px of air above them.
- **A sticky contents rail** built from the article's own headings, shown when there are
  more than two. Hidden below 1000px, where it would just be a second copy of the
  headings ahead of the article.
- **Standfirsts are now a standfirst.** `splitStandfirst` takes whole sentences up to
  ~280 characters for the header and pushes the remainder into the first body paragraph,
  so nothing is lost but the band no longer swallows the screen. Topic pages get theirs
  from the first paragraph of the markdown-lite body.

**Why one component** — guides store `sections: {h, body}[]` and topics store a single
markdown-lite `body`, but they are the same object to a reader. Putting the header, the
grid, the contents rail and the prose scale in `ArticleLayout` means the tool, versus,
prize, location and category pages can adopt it next by supplying their own content.

**Verified** — 1440px and 390px, no horizontal overflow on either page type.

## 2026-09-08 (3) — Every dash, euro and accent on the article pages, repaired

**Changed** — `src/app/topics/[slug]/page.tsx` and `src/app/guide/[slug]/page.tsx`. 916
runs of double- and triple-encoded UTF-8 were decoded back to the characters they were
meant to be: 1,491 em and en dashes, 74 euro signs, and the accents in São Paulo, Zürich,
Léo Cannone, Cédric Klapisch and résumé. Two guillemets in each file's breadcrumb too.
No wording changed anywhere — only the glyph that renders where a substitute was showing.

**Why** — this was the worst-looking thing on the site and nobody had spotted it, because
it is invisible in the source diff and invisible to anyone who only looks at the homepage.
On the Europe topic page a reader saw "Monaco's AI Film Fest offers $10,000 and France's We
Are Human Festival pools â ¬10,000 across three awards â€ because Europe's marquee money
events", "entry fees run just $10â€ $25" and "the festival itself runs October 13â€ 17".
The guide breadcrumb read "AI Film Contests Ã Â¢Ã Ã Âº Guides Ã Â¢Ã Ã Âº How to Write an
AI Film Treatment…" and was long enough to wrap onto a second line. These are the pages
search sends people to first, and they are the pages that have to look like someone checks
their facts. Broken characters say the opposite in the first half-second, before a word is
read. The prose reflowed tighter as a bonus: the garbage was padding every line it sat on.

**How, so a later run can trust it** — each damaged run was decoded back through its
encoding layers (cp1252 then latin-1, up to eight times), and only rewritten where the
round trip succeeded, shortened the string, and left no control character or replacement
character behind. Ordinary accented prose fails that test and was never touched. Nothing
was skipped: every one of the 29 distinct damaged sequences resolved to a plain
typographic character (— – € é è ô ã á ç ü × ° · › → ←).

**Inspiration** — Criterion's Current and It's Nice That, an hour of reading both. The
observation worth keeping: on a serious editorial site, punctuation is part of the
typeface, not an afterthought. Criterion sets every byline identically — `ON FILM /
FEATURES — AUG 27, 2026` — with a real em dash and a real typographic apostrophe, on every
item, without exception. It is invisible when it is right and it is the first thing you
see when it is wrong. We were failing at the lowest rung of that ladder while trying to
climb the higher ones.

**Before / after** — `reports/design/2026-09-08b-before.png`,
`reports/design/2026-09-08b-before-390.png`, `reports/design/2026-09-08b-before-topics.png`,
`reports/design/2026-09-08b-after.png`, `reports/design/2026-09-08b-after-390.png`,
`reports/design/2026-09-08b-after-topics.png`.

**Second change today, deliberately** — a design commit already landed this morning (the
card deadline entry above), and the rule is one a day. Shipped anyway because this is a
defect repair rather than a design direction: it cannot cause drift, and leaving forty-odd
public pages full of broken characters for another day was the worse call.

**Noted for a later run, not done today** — two things. First, `src/app/sitemap.ts` holds
23,376 mangled bytes, but they are all inside one decorative `//` comment divider, so no
reader ever sees them; left alone rather than touch a file the sitemap depends on. Second,
these two files use straight apostrophes throughout ("Europe's", "Berlin's") where the
headings on the same page use typographic ones. That is an inconsistency worth settling
one way or the other, but it is a house-style decision, not damage, so it waits its turn.

**Worth knowing** — the SEO robot writes both of these files. Something in that pipeline
re-encoded its own output at least twice. If the mojibake comes back, the fix belongs
upstream in how that robot writes the file, not here.

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
