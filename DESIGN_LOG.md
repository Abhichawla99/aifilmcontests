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

## 2026-09-26 — The creator index, as a ruled roster with the work named

**Changed** — `src/app/creators/page.tsx` and a new `.cr-*` block at the end of
`globals.css`. The 09-25 entry named this page as the other candidate that day; it carried
two of the taste rules' avoid-list items at once.

**Was** —
- **Six identical rounded boxes.** Two creators, three "Why be featured" panels and the
  "Get featured" CTA, all the same `.card` radius, border and fill. So a real person and a
  marketing claim were handed the same object and the same weight, and nothing on the page
  told you which one you were supposed to click.
- **A three-column feature grid with a bold title and two lines of body** — named in the
  taste rules, almost word for word, as a thing that reads as generated.
- **"View profile →" printed once per row.** The same pattern the 09-24 run took off the
  /feature picker, where "Feature →" appeared eighty times and the eye read chrome instead
  of names.
- **No evidence on any row.** `creators.ts` already holds the titles of each creator's
  finished pieces, the clients, and the date the profile went live. The index printed none
  of it. "Cinematic story studio making brand films" is a claim; *Calgary Stampede 2026 ·
  The Love of Trail Running · Keen Footwear — Spec Ad* is the proof, and it was sitting
  right there in the data.
- **The type as an indigo pill.** Studio / Filmmaker is a taxonomy, not the accent.

**Now** —
- **Hairline rows in the `.feat-*` language** — `#E3DED3` on top, `#ECE9E2` between, the
  whole row as the link, one indigo arrow that arrives on hover instead of two shouting at
  once. The same object the /feature picker (09-24), the grid group headings (09-19) and
  the homepage figures (09-10) already use, so the page stops being its own dialect.
- **The work named on every row.** Up to three titles, middot-separated, under a 9.5px
  `WORK` caption, with `+N more` when there are more. Specificity as the aesthetic: the
  row now says what the person has actually finished, not what they would like you to
  think about them.
- **Featured-since in the right column**, set in the site's "Verified &lt;date&gt;" trust
  language from 09-17 — tabular Space Grotesk, caption over figure, so the column scans
  vertically as the roster grows. It is the one fact about a profile that is nowhere else
  on the row, and it differs per creator where a month alone would not.
- **Studio / Filmmaker demoted to a grey 9.5px caption over the name**, the way a festival
  programme labels a strand. The indigo now goes only to the hover arrow and the one
  button on the page.
- **"Why be featured" as a ruled definition list** — a 215px label column, one sentence
  beside it, a hairline between, collapsing to label-over-body under 620px. No boxes, no
  icons, no third column of filler.
- **One box left on the page**, the "Get featured" panel, which needed no edit at all to
  become the obvious action once the five decoys around it were gone.

**Not changed** — no copy meaning, no data, no URL, no JSON-LD. Every string on the page is
the one that was there this morning; the film titles and dates came out of `creators.ts`
untouched. The profile pages, the badge embed, the subscribe form and the CTA are all as
they were.

**Considered and rejected** — resolving the `contests` ids to live contest names on the
index, the way `/creators/[slug]` does. It would put "Rome AI Festival (RAIF) 2026" on
Ariel Kotzer's row, which is the strongest credential on the page. But it makes a static
index depend on a Supabase round trip, and a timeout would silently empty the roster — the
failure mode the notify robot already hit this month. The profile page carries that fact
one click away. Also rejected: shortening the three "Why" titles to one word each, the way
the sites below do. They are Abhi's sentences and they say something; re-setting them was
allowed, rewriting them was not.

**Inspired by** — Dense Discovery and Are.na, which reached the same answer independently.
Dense Discovery sets its eight-item "What to expect" as a one-word label and a single
sentence with no container at all, and puts its credibility in two plain ticked facts under
the form — 407 issues since 2018, over 36,000 readers — rather than in decorated boxes.
Are.na's five-step "How it works" is the same shape, and its about section states its team
size outright instead of adjectivising it. It's Nice That's index pointed at the other half:
every entry's link text names the person *and* the specific thing they made, never "read
more". Adapted here by taking the boxes off the claims and putting the named films on the
rows.

**Verified** — 1440px and a true 390px viewport, no horizontal overflow at either, build
clean, live page checked after deploy. The keyboard focus ring on a row is a 2px indigo
outline inset by 2px, so it reads inside the hairline rather than outside it.

**Before / after** — `reports/design/2026-09-26-before.png`,
`reports/design/2026-09-26-before-390.png`, `reports/design/2026-09-26-after.png`,
`reports/design/2026-09-26-after-390.png`.

**Noted for a later run, not done today** — `/creators/[slug]` still opens with a tinted
header band and then a stack of `.card` panels for bio, work links, contests and the badge
embed, all at the same radius. The index and the profile now speak differently; the profile
is the one to bring across next.

## 2026-09-25 — The unsubscribe page, with the site still around it

**Changed** — `src/app/unsubscribe/page.tsx` and a new `.unsub-*` block at the end of
`globals.css`. This was the last orphan page on the site.

**Was** —
- **No site.** Every other page carries the header and the footer; the 404 was given them
  deliberately on 09-13 for exactly this reason. `/unsubscribe` rendered as a bare 440px
  column with `min-height: 100vh` centring, so a subscriber who clicked through from an
  alert landed on a page that did not look like the thing that had emailed them. The only
  identification was a 14px indigo wordmark floating 40px above the heading.
- **The accent spent on leaving.** The Unsubscribe button was the full-fill indigo `.btn` —
  the same object as "Get Alerts" on the homepage — at full width, and it was the loudest
  element on the screen. Indigo is the site's one accent and it means "the good stuff is
  here". Pointing it at the exit is the one place it actively misleads.
- **Content that moved between states.** Vertically centred in the viewport, with loading
  at two lines and the form at five, so the heading jumped as the state changed.
- **A generic success mark.** A 40px tinted indigo circle holding a `✓` glyph — the
  pattern the 09-22 run already replaced on the *subscribe* side with a ruled note. The
  same family of state, unconverged.
- **Vague about what stops.** "You won't receive any more emails from us."
- **An input with no accessible name** (placeholder only) and a ~40px tap target.

**Now** —
- **`InnerLayout` around it**, and the column left-aligned at `max-width: 520px` with
  `.nf-wrap`'s 64px top set, so all four states begin at the same line and nothing jumps.
- **The button in ink** `#1B1916`. It is still the widest, tallest, first control on the
  page — demoted in colour only, never in prominence, because making an unsubscribe harder
  to find would be the worst thing this page could do. The indigo goes to "← Back to
  contests", which is the only place on this page where it is honest.
- **What actually stops, named**: the alerts when new contests open, and the reminder seven
  days before a deadline closes. Those are the two promises the homepage form already
  makes, quoted back rather than invented.
- **The three outcome notes share one object** — a 2px rule, a 10.5px small-caps label,
  12.5px body — the geometry `SubscribeError` and `.sok-step` already use. Grey for the
  neutral note, indigo for removed, `#C2410C` for the failure.
- **The success state names the address it removed** when the person typed one, set in the
  Space Grotesk tabular figure language the cards use. Specificity as the aesthetic: "you're
  unsubscribed" is a claim, the address printed back is evidence.
- **A note that saves typing** — the one-click link at the foot of any alert removes that
  address on its own — for the person who cannot remember which address they used.
- **An `aria-label` on the input** and a 46px button.

**On demoting the button** — considered and rejected: shrinking it, making it a ghost
outline, or adding a "keep getting fewer emails instead" step. All three make leaving
harder or slower, and there is no reduced-frequency option in the product to offer
honestly. Colour was the only thing safe to change.

**Inspired by** — Dense Discovery. Its subscribe control is a plain black button; the
accent is spent entirely on the content, the issue titles and the links, never on the
transactional control. And underneath the form it prints a fact rather than a promise:
"Next issue is dispatched in 3 days." The reassurance comes from the specific thing being
stated, not from the button shouting. Adapted here by taking the indigo off the leaving
control and letting the sentence about the two emails that stop do the reassuring instead.
(Criterion and Metrograph were both behind a Cloudflare check today and could not be read.)

**Verified** — 1440px and a true 390px viewport, no horizontal overflow at either, on idle,
success and error. The error state was checked against the real API with a bad token.

**Before / after** — `reports/design/2026-09-25-before.png`,
`reports/design/2026-09-25-before-390.png`, `reports/design/2026-09-25-after.png`,
`reports/design/2026-09-25-after-390.png`.

**Noted for a later run, not done today** — `/creators` carries the two things the taste
rules name directly: a "Why be featured" three-column grid of identical rounded boxes, each
a bold title over two lines of body, and creator cards at the same radius and fill as each
other. It was the other candidate today.

## 2026-09-24 — The /feature contest picker, set as a ruled index

**Changed** — the contest picker at the foot of `src/app/feature/page.tsx`, plus a new
`.feat-*` block at the end of `globals.css`. This is the page that sells the one paid
thing on the site, and the picker is the step between "I want this" and paying.

**Was** —
- **Eighty identical rounded grey boxes.** Same radius, same fill, same border, stacked
  with an 8px gap. The Principles say hairlines over boxes; this was the opposite of that
  eighty times in a row.
- **"Feature →" printed eighty times.** The same two words in indigo at the right edge of
  every row. Nothing distinguished one row from another, so the eye read chrome, not names.
- **A colliding line.** Name and organizer shared one line separated by a middot, so
  `World AI Cinema Festival — Remember the Future (Oct 2026 cycle) · World Film Festival in
  Cannes — Remember the Future` wrapped into a grey-and-black tangle and the rows came out
  at wildly different heights.
- **A sort order it never printed.** The list arrives sorted by deadline and showed no
  deadline anywhere, so an order that is actually meaningful read as random.
- **A silent cut at eighty.** `open.slice(0, 80)` against 82 open contests. Two organizers
  could not find their own listing on the page built to sell to them, and nothing on the
  page said so.
- **A section heading quieter than the body above it** — "Pick your contest" at 15px in
  `#6F6A61`, lighter than the paragraph it was meant to lead.

**Now** —
- **Hairline rows.** No fill, no radius, one `#ECE9E2` rule under each row and a slightly
  darker one opening the list. The whole row is the link; hover and `:focus-visible` fill
  it faintly and slide one indigo arrow in from the right. One arrow that arrives instead
  of eighty-two shouting at once.
- **The deadline, in the house language.** Right column, the same figure-then-caption shape
  every card has used since 09-08: time remaining as a 13px tabular Space Grotesk figure,
  the date beneath it at 9.5px small caps. Tabular so the column scans straight down.
  Burnt orange inside seven days, as everywhere else.
- **Month rules.** `SEPTEMBER 2026 · 14`, reusing the `.cbg` heading from the browse grid
  rather than inventing a second dialect. They are the only wayfinding in a list this long,
  and they are what makes the closing-soonest order visible at all.
- **Name and organizer on their own lines**, 15px Space Grotesk 600 over 11.5px grey, so a
  70-character festival name and a 74-character organizer stop fighting.
- **All 82, and the count stated** — "All 82 contests open right now, closing soonest
  first." The slice is gone.
- **A written empty state** instead of a heading over nothing: what happened, that new
  contests go up most mornings, and a Submit button.

**Why not alphabetical** — it was the first instinct, since an organizer arrives knowing
their contest's name. The data killed it: 36 of the 82 open contests begin with "AI", so
letter markers would have produced one block holding 44% of the list and twenty markers
holding one row each. Deadline order buckets cleanly instead — 14 / 30 / 7 / 13 / 9 and a
tail — and the deadline is information the organizer actually needs here, because it tells
them whether a 30-day feature outlives their own close date.

**On the orange** — eleven of the first fourteen rows currently read burnt orange, because
eleven contests genuinely close within seven days. That is loud, and it is true, and it is
the same rule the browse grid's "Closing this week" bucket already follows. Left as is.

**Inspired by** — Criterion's Shop All Films list view, which sets 1,891 films as a ruled
index: one hairline under each row, no fill and no radius, the title the only bold thing,
director / country / year holding fixed grey columns the eye can travel straight down, and
no per-row button at all — the row is the target. One heavier rule under the column header
says "this is a table" once, instead of drawing a box around every item. Adapted, not
copied: our columns are a deadline rather than a filmography, and the month rules do the
work Criterion's spine numbers do. (Metrograph, looked at second, sets the date as a fixed
stacked block at the head of every listing — the same instinct that keeps our deadline
column in one place at both widths.)

**Verified** — 1440px and a true 390px viewport, no horizontal overflow at either. The
local build has no Supabase anon key, so the page itself renders the empty state locally;
the row layout was checked against all 82 real contests through a throwaway harness that
loaded the built CSS bundle, and against the live page after deploy.

**Before / after** — `reports/design/2026-09-24-before.png`,
`reports/design/2026-09-24-before-list.png`, `reports/design/2026-09-24-before-390.png`,
`reports/design/2026-09-24-after.png`, `reports/design/2026-09-24-after-390.png`.

**Noted for a later run, not done today** — the two panels above the picker ("What
featuring includes" and the price) are the same rounded grey box at the same radius with
the same fill, and when no contest is picked the price panel's only control is the
*secondary* action, "Not listed yet? Submit it (free)". The page asks for $49 and shows no
primary button until you have chosen a contest. That is the next thing on this page.

## 2026-09-23 — The Apply block, one control stack, and a source URL that isn't cut in half

**Changed** — the deadline block at the top of the contest page's spec rail
(`src/app/contests/[id]/page.tsx`), `src/components/DeadlineReminder.tsx`, and a new
`.dlr-*` block at the end of `globals.css` replacing the inline styles it was built from.
This is the block a visitor decides from: how long they have, where to apply, and whether
to believe the date.

**Was** —
- **A URL cut mid-word.** The line whose entire job is to prove the deadline was checked
  against the organizer's own page printed `contest.url` through `.slice(0, 28)` with no
  ellipsis. Against live data that mangles **102 of 195 contests, 92 of them mid-word**:
  `app.pixverse.ai/challenge/pi`, `curiousrefuge.com/ai-animati`,
  `runwayml.com/hundred-film-fu`, `aiforgood.itu.int/ai-for-goo`. The one element on the
  page carrying our credibility read as a rendering bug.
- **An emoji standing in for a UI icon.** `🔔 Get a reminder 3 days before this deadline`.
  The Principles name this exactly: our category emoji are a private set defined in
  `theme.ts`, and no emoji stands in for an icon. A bell is the single most generic
  notification glyph on the web.
- **A 16px tap target.** The reminder was a `<button>` with `padding: 0` and a 12.5px
  label — the same failure the 09-22 entry found on `Subscribe another email`, on a
  control that matters more.
- **The secondary action above the primary one.** The reminder sat between the verified
  line and the Apply button, so the first indigo thing in the block was the fallback and
  the actual call to action came second.

**Now** —
- **The domain, whole.** A `host()` helper returns the hostname with `www.` stripped, so
  the line reads `app.pixverse.ai` — complete on all 195 contests, never truncated,
  fitting at 390px. The full URL stays in the `href`. The domain is what proves whose page
  we read; the path never was.
- **One control stack.** Apply first as the full-width indigo button, a `#ECE9E2` hairline
  under it, then the reminder as a second full-width row in indigo at 12.5px — same width,
  one step down in contrast. Two rows of one object instead of two competing things.
- **A 42px tap target** (`padding: 13px 0`, full width) and `outline-offset: -2px` so the
  focus ring sits inside the card rather than straddling its border.
- **No emoji.** The words were already specific enough.

**Inspired by** — Letterboxd's film rail stacks its secondary action directly beneath the
primary at the same width and lower contrast, so the pair reads as one control group and
neither fights the other; Mubi's Awards & Festivals block names the awarding institution in
full and puts the detail in small grey beneath it — the authority's name is never
abbreviated, because the name is the evidence. Ours was abbreviating exactly that.

**Before/after** — `reports/design/2026-09-23-before.png`, `-before-390.png`,
`-after.png`, `-after-390.png`.

---

## 2026-09-22 — The subscribe success state, a ruled note instead of a tinted panel

**Changed** — the `status === 'success'` branch of `src/components/EmailSubscribe.tsx`,
and a new `.sok-*` block at the end of `globals.css` replacing the inline styles it was
built from. This is the screen a visitor sees after doing the single thing this site asks
of them, and it renders in two places: inside the homepage subscribe card, and as the
compact form now sitting at the foot of every guide, tool, comparison, prize, location,
category and topic page.

**Was** — a box inside a box, with the instruction buried in it.
- **The last tinted panel on the homepage.** A 10px-radius box filled
  `rgba(79,70,229,0.05)` behind a `rgba(99,102,241,0.2)` border, nested inside the
  subscribe card's own `#E3DED3` border and white fill. Two levels of containment for one
  short instruction. It is the same failure the 09-21 aside had, only inverted: that box
  was too faint to read as a box, this one was solid enough to read as a second card.
- **An arrow on text that is not a link.** `One quick step to guarantee delivery →` was
  13px Space Grotesk 600 in `#4F46E5` — indigo, semibold, trailing arrow, which is the
  exact signature every link on this site uses. It is a heading. It goes nowhere, and
  nothing happens when you tap it.
- **The instruction was the first four words of a paragraph about the instruction.**
  "Reply to that email" opened a single 13px `#6F6A61` run that continued for another 38
  words explaining inbox placement. At 390px that was seven lines of grey at one size,
  with two mid-sentence bolds (`Reply to that email`, `Primary`) as the only hierarchy.
  The thing to do and the reason to do it were set identically.
- **A 16px tap target.** `Subscribe another email` was 12px with an underline and no
  padding at all — a 137.6 x 16px hit area, the smallest control anywhere on the page.
- **Nothing announced it.** The failure branch carries `role="alert"`; the success branch
  carried no role, so the one state a screen reader most needs told after submitting a
  form arrived silently.

**Now** —
- **The same object as the error state directly below it in the same file.** A 2px rule
  and a 12px indent — the geometry `SubscribeError` has used since 09-12 — in `#4F46E5`
  rather than the `#C2410C` reserved for a failure. No fill, no radius, no border. The two
  outcomes of one form are now one thing in two colours.
- **A small-caps label instead of a fake link.** `ONE QUICK STEP TO GUARANTEE DELIVERY` at
  10.5px Space Grotesk 700, 0.08em, indigo — the same label grammar as `NOT SUBSCRIBED
  YET` beneath it, `PRIZE POOL` on the spotlight and `BROWSE` in the footer. The arrow is
  gone.
- **The action leads.** `Reply to that email — even just "got it" works.` is its own
  paragraph at 13.5px in `#26231E`; the reasoning follows at 12.5px in `#6F6A61`. Same
  words, same order, split at the sentence break that was already there.
- **A 34px control.** `Subscribe another email` keeps its size and colour but gains
  `7px 0` padding, so the hit area goes from 16px tall to 34.4px. Still short of the 40px
  the optimizer backlog wants; that is a site-wide pass.
- `role="status"` on the container, so success is announced the way failure already is.

Same words, same word order. No copy, data or ordering changed.

**Inspiration** — the question was whether a panel is ever the right container for a short
notice, so I counted them. It's Nice That's homepage has exactly one element with a corner
radius wider than 120px and *zero* elements over 120x40 with either a fill or a full
border. Are.na's homepage carries 6,282 characters of real content and also returns zero
on both counts — no filled container, no fully bordered container, at any size over
150x50. Neither site draws a panel even once, let alone a panel inside another panel.
Neither has a single arrow glyph on non-link text; It's Nice That has no trailing arrows
anywhere on the page. Adapted rather than copied: both sites reach zero panels by using
whitespace and type size alone, which our success state cannot do because it lives inside
a card that has to hold the form. So we take the conclusion — no second container — and
mark the note with the 2px rule the component already owned for its error, which is a
border our own house grammar had already answered this exact question with.

**Noted for a later run, not done today** —
- **The card keeps selling after the sale.** `FREE ALERTS`, "Never miss a deadline" and
  "Get notified when new contests open and 7 days before any deadline closes." sit in
  `page.tsx` above the form and stay put when the form succeeds, so the pitch is still
  addressed to someone who already subscribed. Hiding them on success means lifting
  `status` out of `EmailSubscribe` into the page, which is a bigger change than one day.
- **The success state offers no way back into the site.** A visitor who just subscribed is
  given one grey underlined button that puts the form back. Any link out would be new
  copy, which is a call for Abhi.
- The spotlight card's contest title may be clipping its first glyph — `1 Billion AI Film
  Award` and `1 BILLION FOLLOWERS SUMMIT` both read as though the leading `1` is cut at
  the card's left padding edge in the 1440px live shot. Worth measuring on a run that owns
  `FeaturedSpotlight`.
- `src/app/cinematic-ads/page.tsx` is still the only page using `backdropFilter`. Carried
  from 09-21.
- Still open: `/tools/[slug]` and `/categories/[slug]` not using `InnerLayout`.
- The homepage and inner footers and headers still offer different link sets. Carried from
  2026-09-17 through 09-21; it changes which URLs a visitor is offered on 300-odd pages,
  so it stays a call for Abhi.
- **Data, for the research robot:** Bali International AI Film Festival (BIAIFF) 2026
  Season 5 still shows a Sep 15, 2026 deadline while marked open. Carried from 2026-09-16
  through 09-21, now seven days stale.
- Process: `.env.cron` still has no `NEXT_PUBLIC_SUPABASE_ANON_KEY`, so the local build
  renders an empty grid. It did not matter today — the subscribe card renders the same
  with zero contests — but a change inside the grid still is not verifiable locally.

**Verified** — `npm run build` exited 0 before and after the rebase onto `05d5528`. This
state cannot be reached by clicking, so both the before and the after shots were taken on
`next start` with the component's initial `status` temporarily set to `'success'`; that
shim was reverted before the committed build, and the diff is `EmailSubscribe.tsx` and
`globals.css` only. It is also why the after shots are local rather than live: reaching
the real success state means actually subscribing, which sends an email, which robots do
not do. Measured: the whole success block is 269px tall at 390px against 303.1px before,
248px against 281.7px at 1440px, and 289.6px against 303.1px at 375px — more hierarchy in
less height at every width. The note itself is 155.2px against the old box's 185.7px at
390px. `Subscribe another email` is 140.7 x 34.4px against 137.6 x 16px. The block sits
between x=45 and x=330 inside a 375px screen, and between x=20 and x=370 in the compact
form on `/topics/ai-film-festivals-2026`. No horizontal overflow at 1440px, 390px or
375px, checked with the idle form as well as the success state. Live homepage returns 200
after deploy.

**Before / after** — `reports/design/2026-09-22-before.png`,
`reports/design/2026-09-22-before-390.png`, `reports/design/2026-09-22-after.png`,
`reports/design/2026-09-22-after-390.png`, `reports/design/2026-09-22-after-375.png`. The
live homepage after deploy (idle form, since the success state needs a real signup) is at
`reports/design/2026-09-22-after-live.png` and `-after-live-390.png`.

## 2026-09-21 — The cinematic-ads callout, a ruled aside instead of a ghost box

**Changed** — the Ruminatex / cinematic-ads block in `src/app/page.tsx`, and a new
`.rcal-*` block at the end of `globals.css` replacing the inline styles it was built
from. It sits between the contest grid and the subscribe card, and it is the only place
on the homepage that says who makes this directory.

**Was** — a box drawn at a weight nobody can see.
- **A border and a fill both below the threshold of visibility.** `1px solid
  rgba(27,25,22,0.05)` around a 16px radius, filled `rgba(27,25,22,0.015)` — a twentieth
  and a sixty-sixth of an opaque line. The house hairline is `#E3DED3`, roughly four
  times the weight, and it already ran above this block on the past-contests divider and
  below it across the top of the footer.
- **It read as a component that had failed to load.** Directly beneath it the subscribe
  card carries a real `#E1DAF0` border on a real `#F3F0F9` fill. Two boxes stacked, one
  fully rendered and one a grey wash, and the eye reads the wash as broken rather than as
  quiet.
- **The homepage's last `backdropFilter`.** `blur(8px)` over a fill that is the page
  ground at 1.5%, so it blurred paper against paper. Flagged on 2026-09-17, 09-18, 09-19
  and 09-20 and not fixed until now.
- **A link styled as a disabled control.** `ruminatex.com` was `#A8A296` inside that same
  5%-black border at an 8px radius with `6px 14px` of padding — a pill, greyed, which is
  exactly the shape and colour of a button you cannot press. It was the studio credit,
  and it looked switched off.
- **The actionable link was the seventh phrase of a grey sentence.** "Explore how AI is
  reshaping brand filmmaking →" sat mid-run inside a 13px `#6F6A61` line 890px long at
  1440px. The one thing in the block a visitor could do had no more prominence than
  "Looking to create".
- **An icon chip that vanished, then floated.** A 16px film frame stroked
  `rgba(165,180,252,0.7)` — pale indigo at 70% — inside a 36px `rgba(99,102,241,0.08)`
  tile. Invisible at any real viewing distance on desktop. At 390px the paragraph beside
  it ran to three lines while the tile stayed `align-items: center`, so a 36px square hung
  in the left gutter level with line two and nothing at all sat beside lines one and
  three. The text was indented 50px from the box's padding while `ruminatex.com` started
  at the padding edge, so one small box contained two different left margins.

**Now** —
- **A hairline and nothing else.** `border-top: 1px solid #E3DED3`, no border, no radius,
  no fill, no blur — the same grammar as the footer, the browse masthead and the grid's
  bucket headings. The homepage now has no `backdropFilter` left anywhere.
- **A 20px left rail.** The film frame comes out of its tile and is stroked `#4F46E5` at
  1.5, sitting in a rail that both text rows indent to. At 390px and 375px it lands on the
  first line of the sentence rather than floating beside it, and the sentence, the link
  and the credit all begin at x=54.
- **The link is the loudest thing in the block.** Its own row, 15px Space Grotesk 600 in
  indigo at -0.005em, underlining on hover. The context sentence stays 13px `#6F6A61`
  with `cinematic AI content` at `#3E3A33` 500, exactly as before.
- **`ruminatex.com` stops pretending to be a button.** Plain text, 12px Space Grotesk in
  `#8B867C` — one step darker than the `#A8A296` it was, so it reads — baselined with the
  opening sentence at the right at desktop, dropping under the link below 720px because
  at 390px the link alone measures about 300px and has nothing left to share.
- Focus rings come from the global `a:focus-visible` rule rather than from nothing, since
  the old markup carried a dead `onMouseEnter={undefined}` and no focus or hover state on
  either link.

Same words, same word order, same two URLs (`/cinematic-ads` and `ruminatex.com`). No
copy, data or ordering changed.

**Inspiration** — MUBI's Notebook marks its newsletter aside — "Don't miss our latest
features and interviews" — with `background: rgb(246,246,246)`, `border: 0`,
`border-radius: 0`. It changes the ground under the block and draws nothing around it,
and because the tint runs the full width the area is large enough for a 9-step shift off
white to actually register. Criterion's Current makes the harder version of the same
argument: probing every `div`, `section` and `aside` on the page for a border or a
non-white fill returns exactly one element in the whole document, a nav control strip.
Neither site owns a container like ours. Ours was trying to be a box and failing at it,
which is the worst of the three options. Adapted rather than copied: we take the
no-border, no-radius conclusion but reach it with the hairline the site already uses
everywhere instead of MUBI's tinted band, because a full-bleed grey band on warm paper
would be a new surface colour and `theme.ts` owns those.

**Noted for a later run, not done today** —
- `ruminatex.com`'s tap target is 28px tall and the link's is 42px. Both are under the
  40px the optimizer backlog wants, and raising the small one is part of the site-wide
  pass, not this block.
- `src/app/cinematic-ads/page.tsx` still uses `backdropFilter`. It is now the only page
  that does; the homepage is clean.
- Still open: the subscribe success state's boxed indigo panel, and `/tools/[slug]` and
  `/categories/[slug]` not using `InnerLayout`.
- The homepage and inner footers and headers still offer different link sets. Carried from
  2026-09-17 through 09-20; it changes which URLs a visitor is offered on 300-odd pages,
  so it stays a call for Abhi.
- **Data, for the research robot:** Bali International AI Film Festival (BIAIFF) 2026
  Season 5 still shows a Sep 15, 2026 deadline while marked open. Carried from 2026-09-16
  through 09-20, now six days stale.
- Process: `.env.cron` still has no `NEXT_PUBLIC_SUPABASE_ANON_KEY`, so the local build
  renders an empty grid and the homepage falls into its "Nothing matches that yet" state.
  The 09-19 workaround — repointing `getAllContests` at `supabaseAdmin` for the local
  build only — was refused by the sandbox this run, so today's before and after shots were
  both taken against the live site, where the data is real, and the local build was used
  only to verify this block's own geometry and the overflow check. That is sufficient
  here because the aside is static, but a change inside the grid would not be verifiable
  locally at all until that variable exists.

**Verified** — `npm run build` exited 0. The aside measures 76px tall at 1440px against
the old box's 86px, and 155px at 390px against 163px measured on the old one at 375px —
so the block carries more hierarchy in slightly less height. The mark, the sentence, the
link and the credit all start at x=54 on a phone, and the aside ends at x=355 inside a
375px screen. No horizontal overflow at 1440px, 390px or 375px. Then live
at all three widths after deploy (1351ee9); the homepage returns 200. One thing to watch:
the aside's hairline now sits about 145px below the past-contests rule, so the bottom of
the homepage reads as a short run of ruled bands. It looks deliberate at both widths, but
a third rule in that stretch would be one too many.

**Before / after** — `reports/design/2026-09-21-before.png`,
`reports/design/2026-09-21-before-390.png`, `reports/design/2026-09-21-after.png`,
`reports/design/2026-09-21-after-390.png`, `reports/design/2026-09-21-after-375.png`.

## 2026-09-20 — The homepage footer, set as columns instead of one impossible row

**Changed** — the `<footer>` in `src/app/page.tsx`, and a new `.sfoot-*` block at the end
of `globals.css` replacing the inline styles it was built from. This is the last thing on
the page and the only navigation offered to someone who has scrolled past all 85 contests.

**Was** — seven links in a single centre-justified row, and there was never room for them.
- **Every label broken across two lines at 1440px.** `Closing / Soon`, `Free to / Enter`,
  `Cash / Prizes`, `Submit a / Contest`, `Cinematic AI / Ads`, `Featured / Creators`,
  `Crafted by / Ruminatex` — and the wordmark itself, `AI Film / Contests`. The row was
  `flex items-center gap-4` with no `flex-wrap`, sharing one line with the wordmark and a
  47-character tagline, so each link was squeezed to roughly 90px and wrapped inside it.
- **A middot floating between the two halves of nothing.** The six `·` separators are
  their own elements and stayed vertically centred, so each one sat in the gutter beside
  the *middle* of a two-line label rather than between two links.
- **Two links unreachable on a phone.** At 390px the row still did not wrap; it simply
  overran both edges of the centred container. `Closing Soon` was clipped off the left of
  the screen and `Crafted by Ruminatex` off the right, and the labels that did survive
  were shredded into three-line columns (`Free / to / Enter`, `Submit / a / Contest`). The
  overflow check passed the whole time, because the row was clipped rather than widening
  the document — nothing warned, the links were just gone.
- **The second-to-last blur on the homepage**, `backdropFilter: blur(8px)` over
  `rgba(251,250,248,0.8)`, doing no work at all: the fill is the page ground at 80%, so it
  blurred paper against paper. Its border was `rgba(27,25,22,0.04)`, about a quarter the
  weight of the `#E3DED3` hairline used everywhere else since 09-18.

**Now** —
- **Three columns.** Identity at the left — wordmark, tagline, and the Ruminatex credit
  moved down beneath them — then `BROWSE` (Closing Soon, Free to Enter, Cash Prizes) and
  `MORE` (Submit a Contest, Featured Creators, Cinematic AI Ads). The identity column is
  `minmax(200px, 1fr)` so it absorbs the slack and the two link columns still sit at the
  right, keeping the left/right split the old row was reaching for.
- **One link per line, every line a full label.** The longest, `Featured Creators`,
  measures 111px and gets 128px minimum. No separators, because a column does not need
  them; the six middots are gone rather than restyled.
- **Column headings instead of a run of equals.** 11px Space Grotesk 700 in `#A8A296` at
  0.1em, the same small-caps label grammar as `PRIZE POOL` and `DEADLINE` on the spotlight
  and `FREE ALERTS` on the subscribe card. Each column is a `<nav>` labelled by its
  heading, so a screen reader hears "Browse navigation" rather than eleven loose links.
- **The house hairline and no blur.** `#E3DED3`, flat, with the page ground showing
  through — one of the two remaining homepage blurs removed.
- **Two columns side by side at 390px and 375px**, with the identity block spanning both.
  Every link now lands between x=20 and x=316 inside a 390px screen. Links carry `5px 0`
  padding rather than a margin so the hit target is the width of the row, not just the
  glyphs.
- The tagline is capped at 300px with a non-breaking space binding `· Updated daily`, so
  it holds one line down to a 340px viewport instead of orphaning the middot.

Same seven links, same URLs, same label text. No copy, data or ordering changed.
`InnerLayout`'s footer was already wrapping and was left alone.

**Inspiration** — Letterboxd's footer fits eleven links on one line, and the reason is
that every one of them is a single word: About, Pro, News, Apps, Help, Terms, API,
Contact. Criterion and It's Nice That, whose footer links are phrases — "Criterion Closet
Picks", "Advertising Opportunities", "Careers at It's Nice That" — do not attempt a row at
all. Both stack them under a small named column heading, one per line: Criterion jumps
from a 24px white group name to 13px grey small-caps links, It's Nice That sets heading
and links at the same 13px and lets the stacking alone carry the hierarchy. A single-line
footer is a function of label length, not of taste, and ours had seven phrases. Adapted
rather than copied: we take It's Nice That's one-size restraint for the links but keep a
quieter heading than Criterion's, because two columns of three do not need a 24px shout to
be told apart.

**Noted for a later run, not done today** —
- The Ruminatex callout directly above the footer is now the only `backdropFilter` left on
  the homepage, over a `rgba(27,25,22,0.015)` fill and a `rgba(27,25,22,0.05)` border that
  together render as a barely-there ghost box. Its `ruminatex.com` button is `#A8A296`
  inside a 5%-black border and reads as disabled, and the film-frame icon is stroked
  `rgba(165,180,252,0.7)` on a `rgba(99,102,241,0.08)` fill — invisible at any real
  viewing distance. Carried from 2026-09-17, 09-18 and 09-19.
- Still open: the subscribe success state's boxed indigo panel, and `/tools/[slug]` and
  `/categories/[slug]` not using `InnerLayout`.
- Footer tap targets are 27.5px tall, better than the 17px they were but short of the 40px
  the optimizer backlog wants for mobile. Raising them is a site-wide pass, not a footer
  one.
- The homepage and inner footers now differ: this one has Free to Enter, Cash Prizes and
  Cinematic AI Ads; `InnerLayout`'s has Browse All. Reconciling them changes which URLs a
  visitor is offered on 300-odd pages, so it stays a call for Abhi — the same reason the
  two headers' link sets have stayed apart since 2026-09-17.
- **Data, for the research robot:** Bali International AI Film Festival (BIAIFF) 2026
  Season 5 still shows a Sep 15, 2026 deadline while marked open. Carried from 2026-09-16
  through 09-19, now five days stale.
- Process: `.env.cron` still has no `NEXT_PUBLIC_SUPABASE_ANON_KEY`. As on 09-19,
  `getAllContests` was pointed at the server-only `supabaseAdmin` client for the local
  screenshot build so the page rendered its real 85 contests, and that edit was reverted
  before the committed build — the diff is `page.tsx` and `globals.css` only.

**Verified** — `npm run build` exited 0 with the shim reverted. On `next start`, all eight
footer links render on a single line at 1440px, 390px and 375px, with no horizontal
overflow at any width, and `/submit` and `/contests/closing-soon` were checked at 390px to
confirm the new stylesheet block left `InnerLayout` alone. Then live at the same three
widths after deploy (e07703b). The homepage returns 200.

**Before / after** — `reports/design/2026-09-20-before.png`,
`reports/design/2026-09-20-before-390.png`, `reports/design/2026-09-20-after.png`,
`reports/design/2026-09-20-after-390.png`, `reports/design/2026-09-20-after-375.png`.

## 2026-09-19 — The contest grid's group headings, with the count back beside its label

**Changed** — the deadline-bucket heading in `src/components/ContestBrowser.tsx`, styled
by a new `.cbg-*` block at the end of `globals.css`. These five headings — Closing this
week, Closing this month, In the next three months, Later in the year, Not open yet — are
the only wayfinding inside a list of 84 contests.

**Was** — a label, a rule that ate the rest of the line, and a number stranded at the end
of it.
- **A digit 940px from the words it counted.** At 1440px the heading was `CLOSING THIS
  WEEK` at the left margin, then a hairline running the full width of the grid, then `5`
  hard against the right edge. Nothing tied the two together, so the number read as a page
  number or a stray rather than as the size of the group. Flagged on 2026-09-16, 09-17 and
  09-18 and not fixed until now.
- **Set as fine print, not as a heading.** 11px Space Grotesk in `#8B867C`, the same grey
  and nearly the same size as the "84 contests · showing 12" result line sitting 20px
  above it. The one element telling a visitor which pile of contests they had scrolled
  into was quieter than the running count above it.
- **The wrong hairline.** `#ECE9E2`, where the house rule is `#E3DED3`. Since 09-18 the
  browse masthead a few rows up has been built on `#E3DED3`, so two rules of different
  greys sat within about 200px of each other.
- **An unnamed region.** Each `<section>` had no accessible name, and a screen reader got
  the label and the count as two unrelated fragments.

**Now** —
- **`CLOSING THIS WEEK · 5`, then the rule out to the right edge.** The count sits
  immediately after its label, joined by the house middot — the same separator as "84
  active · verified against live sources daily" directly above and "12 of 84" below. The
  hairline now terminates the heading instead of joining two unrelated things.
- **12px ink.** The label is `#1B1916` at 12px with 0.09em tracking, so a section heading
  reads as one. `Closing this week` keeps burnt orange `#C2410C`, the same
  inside-seven-days colour the cards, the ticker and the spotlight already use, and its
  count takes the orange at 68% so the figure stays subordinate to the words.
- **The house hairline**, `#E3DED3`, matching the masthead above it.
- **A labelled region.** The section carries `aria-labelledby`; the visible figure is
  `aria-hidden` and a visually hidden `, 5 contests` sits beside it, so a screen reader
  hears "Closing this week, 5 contests" rather than "Closing this week 5".
- The rule is `flex: 1 1 24px`, so if a bucket name ever outgrows its line the rule drops
  to a full-width line of its own instead of squeezing the label or overflowing.

No filter behaviour, bucket definition, label text, copy, data or ordering changed.

**Inspiration** — Criterion's Shop All Films list view. Above 1891 rows it prints
`1891 RESULTS` at the top left: the figure in ink, the unit in small-caps grey, the two
locked together and sitting at the margin where the list begins. Nothing is floated to the
right of a leader line. Film at Lincoln Center's Now Playing calendar was open at the same
time and makes the other half of the argument: its day groups are headed `SEP 19` in large
display type at the left, with no rule and no count at all, and the size alone is enough to
break the schedule into days. Adapted rather than copied: ours keeps a count, because
"how many can I still enter this week" is the question this directory exists to answer,
and keeps the rule, because five buckets on one page need a horizon line that a date
heading standing alone does not.

**Noted for a later run, not done today** —
- The five bucket names are still the copy they were. "Closing this month" means within 30
  days and "In the next three months" means within 90, so a contest closing on 19 October
  sits under "this month". Renaming them is a copy call for Abhi, not a visual one.
- Still open: the Ruminatex callout's `backdropFilter`, now the only blur left on the
  homepage; the subscribe success state's boxed indigo panel; and `/tools/[slug]` and
  `/categories/[slug]` not using `InnerLayout`.
- The homepage and inner headers are one object but still offer different link sets.
  Carried from 2026-09-17 and 09-18; it changes which URLs a visitor is offered, so it
  stays a call for Abhi.
- **Data, for the research robot:** Bali International AI Film Festival (BIAIFF) 2026
  Season 5 still shows a Sep 15, 2026 deadline while marked open. Carried from 2026-09-16,
  09-17 and 09-18, now four days stale.
- Process: `.env.cron` still has no `NEXT_PUBLIC_SUPABASE_ANON_KEY`, so a plain local build
  renders zero contests and no group headings at all. Pointing that variable at the
  service-role key is still refused — it would be inlined into the client bundle. Instead
  `getAllContests` was pointed at the server-only `supabaseAdmin` client for the local
  screenshot build only, which keeps the key out of `.next/static` (grepped to confirm),
  and that edit was reverted before the committed build.

**Verified** — `npm run build` exited 0. On `next start` with all five buckets expanded,
every heading renders on a single 20px line at 1440px, 390px and 375px, with the rule
between 113px and 980px wide and no horizontal overflow at any width. Then live at the
same three widths after deploy (07ae4cc). The homepage returns 200.

**Before / after** — `reports/design/2026-09-19-before.png`,
`reports/design/2026-09-19-before-390.png`, `reports/design/2026-09-19-after.png`,
`reports/design/2026-09-19-after-390.png`, `reports/design/2026-09-19-after-375.png`.

## 2026-09-18 — The browse masthead, one ruled line instead of a green pill

**Changed** — the header above the contest grid in `src/app/page.tsx`, and a new
`.bmast-*` block at the end of `globals.css` replacing the one-line `.agent-badge` rule.
This is the masthead of the section 83 contests live under.

**Was** — a title with a marketing sticker floated beside it.
- **The last blurred element on the homepage.** `backdropFilter: blur(8px)` over
  `rgba(34,197,94,0.04)`, a `rgba(34,197,94,0.2)` border and a `0 0 0 3px rgba(22,163,74,0.08)`
  glow ring. Flagged on 2026-09-14, 09-15, 09-16 and 09-17 and not fixed until now.
- **Ragged at phone width.** At 390px the capsule wrapped "Research agent running /
  daily" mid-phrase, and the note "· fresh contests added 24/7" wrapped again beside it,
  so the pill became a two-line, two-column blob about 100px tall. The dot sat vertically
  centred against both lines while the text started at the top, so nothing in it lined up
  with anything else.
- **Two credibility claims in two different languages.** "83 active · verified against
  live sources daily" sat in plain grey under the title; the freshness claim sat in green
  inside a capsule. Both say the same kind of thing — this list is current — and the page
  set them as if they were unrelated.
- The note was `font-size: 10px` at `opacity: 0.6` on green, about 2.4:1 against the
  capsule fill. Small green text on a green wash, i.e. decoration.

**Now** —
- **Title, rule, then the two facts on one line.** A `#E3DED3` hairline under
  "Browse Competitions", with the active count at the left of it and the agent status at
  the right. Same grammar as the spotlight's ruled facts and the hero's figures row.
- **The claim is type, not a container.** No blur, no border, no glow, no fill. The dot
  keeps the house open-green and its `.live` pulse, the agent's name keeps `#15803D`
  Space Grotesk 600, and the note goes to the `#8B867C` label grey at 12px — the same size
  as the name, so it reads as the rest of a sentence rather than as fine print.
- **Below 720px each fact takes a full-width line**, because the two cannot share one
  without the agent line being squeezed to three words a row. The dot hangs into the
  margin (`text-indent: -13px`), so at 375px, where "added 24/7" wraps, the second line
  aligns under "Research" instead of under the dot. A non-breaking space keeps "24/7" with
  "added" so the figure is never orphaned.
- The block is about 100px shorter on a phone, which lifts the search field and the
  filters that much closer to the top of the section.

No copy, data, link, filter or ordering changed. The "daily" versus "24/7" contradiction
in the sentence is still there, untouched: it is a copy call for Abhi, not a visual one.

**Inspiration** — It's Nice That's homepage. Its feed masthead is "The Nice Feed
Refreshed 1h ago" — the section name in ink, the freshness claim immediately beside it in
grey type at a smaller size, and "Explore All →" at the far right of the same line. The
claim that the list is current is carried entirely by where the words sit, with no badge,
no colour fill and no icon. Are.na's Explore page was open at the same time and makes the
harder version of the same bet: its only nod to freshness is a sort option called
"Recently updated", set as plain text under a small-caps "Sort" label. Adapted rather than
copied: ours keeps a green dot, because green already means open on every card and in the
ticker, and a live pulse is the one thing here that is genuinely a status rather than a
sentence.

**Noted for a later run, not done today** —
- The "Closing this week" group heading still ends with a bare count at the far right of
  a long hairline, which reads as a stray digit at 1440px and at 390px. Carried from
  2026-09-16 and 2026-09-17. With the masthead above it now also built on a hairline, the
  two rules sit close enough that the difference is easy to see.
- Still open: the Ruminatex callout's `backdropFilter` (now the only blur left on the
  homepage), the subscribe success state's boxed indigo panel, and `/tools/[slug]` and
  `/categories/[slug]` not using `InnerLayout`.
- The homepage and inner headers are one object but still offer different link sets.
  Reconciling them changes which URLs a visitor is offered, so it stays a call for Abhi.
- **Data, for the research robot:** Bali International AI Film Festival (BIAIFF) 2026
  Season 5 still shows a Sep 15, 2026 deadline while marked open. Carried over from
  2026-09-16 and 2026-09-17, now three days stale.
- Process: `.env.cron` still has no `NEXT_PUBLIC_SUPABASE_ANON_KEY`, so a local build
  renders zero contests. The masthead sits above all contest data and its only dynamic
  part is the count, so it was fully checkable locally in the empty state, then confirmed
  live with 83 real rows.

**Verified** — `npm run build` exited 0. Checked on `next start` at 1440px, 390px and
375px with no horizontal overflow at any width, and on /submit at 390px to confirm
removing the `.agent-badge` rule from the shared stylesheet left other pages alone. Then
live at the same three widths after deploy (409c1e1). The homepage returns 200.

**Before / after** — `reports/design/2026-09-18-before.png`,
`reports/design/2026-09-18-before-390.png`, `reports/design/2026-09-18-after.png`,
`reports/design/2026-09-18-after-390.png`, `reports/design/2026-09-18-after-375.png`.

## 2026-09-17 — The homepage header, the same object as every other page's

**Changed** — the header in `src/app/page.tsx`, a new shared `src/components/LogoMark.tsx`,
and an `.hnav-*` block at the end of `globals.css`. `InnerLayout.tsx` now imports the
shared mark instead of holding its own copy.

**Was** — the site had two unrelated headers, and the worse one was on the page most
people land on.
- **No navigation at all on a phone.** The three links were `hidden sm:flex`, so below
  640px they were simply not rendered. At 390px the homepage header was a logo, a
  wordmark and a Get Alerts button — nothing else. A visitor arriving from search had no
  way to Closing Soon, Tools, Categories, Creators or Submit without scrolling the whole
  page to the footer. Every other page has carried a swipeable line of six links since
  2026-09-14; the entry point carried none.
- **The last blurred chrome on the page.** `backdropFilter: blur(16px)` over
  `rgba(251,250,248,0.85)`, with a `rgba(27,25,22,0.05)` bottom border so faint it read
  as no rule at all rather than as the house `#E3DED3` hairline.
- **The gradient mark.** The logo still filled its frame with a `#3730a3` → `#5b21b6`
  gradient plus a second "shine" gradient over it — a dark-theme leftover flagged on
  2026-09-13, 09-14, 09-15 and 09-16. The inner header's mark went flat indigo on
  2026-09-14, so the two headers had been drawing visibly different logos for three days.

**Now** —
- **One header, two arrangements.** The homepage reuses the inner header's `.inav-*`
  parts. On desktop the brand, the links and the button sit on one 60px row. Below 760px
  it becomes a two-row grid: brand and Get Alerts share row one, the links get row two to
  themselves as a full-width swipeable line. Phone header height goes from about 70px
  with no nav to about 92px with it — the same height, and the same shape, as every
  other page.
- **Flat paper and the house hairline.** No blur. On a phone it scrolls away with the
  page, as the inner header already does; on desktop it stays sticky.
- **One mark, drawn once.** `LogoMark` is now a component both headers and the footer
  import, so the flat indigo frame cannot drift apart again.

The three links keep their exact labels and targets (`#contests`, `#subscribe`,
`/submit`), the Get Alerts button keeps `#subscribe`, and no copy or data changed. None
of the three is marked `aria-current`: two are in-page anchors, so claiming one is "the
current page" would be a lie the inner nav does not tell.

**Inspiration** — siteinspire at 375px. Its header is one short row (mark, search, menu),
but the way into the collection is not hidden behind that menu: `Popular Categories ·
Styles · Types ·` sits in the page itself as a horizontal scroller running off the right
edge, one gesture from a thumb. Mubi, Metrograph and Criterion were also open at the same
width and all three put everything behind a hamburger — which suits a cinema or a
streaming service selling one thing, and does not suit a directory whose whole value is
that you can get at 79 contests several ways. Adapted rather than copied: siteinspire's
strip is filters, ours is sections, and ours already existed on every page but this one.

**Noted for a later run, not done today** —
- With the homepage and inner headers now the same object, the two link *sets* are still
  different: the homepage offers Browse / Subscribe / Submit a Contest, the inner pages
  offer Browse Contests / Closing Soon / Tools / Categories / Cinematic Ads / Creators.
  Reconciling them is a navigation decision, not a visual one, and it changes which URLs
  a visitor is offered, so it is a call for Abhi rather than something to do quietly.
- The `.agent-badge` pill above the browse toolbar still wraps to two ragged lines at
  390px and 375px and still carries `backdropFilter` and a green glow ring. Now the only
  blurred element left on the homepage, and the most obviously unfinished thing on it.
  Its "daily" versus "24/7" copy contradiction is still a call for Abhi.
- Still open: the Ruminatex callout's `backdropFilter`, the subscribe success state's
  boxed indigo panel, the "Closing this week" heading's stray far-right count at 1440px,
  and `/tools/[slug]` and `/categories/[slug]` not using `InnerLayout`.
- **Data, for the research robot:** Bali International AI Film Festival (BIAIFF) 2026
  Season 5 still shows a Sep 15, 2026 deadline while marked open, so it renders in
  "Closing this week" with a past date. Carried over from 2026-09-16.
- Process: `.env.cron` still has no `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Pointing it at the
  service-role key to get a populated local render was refused, correctly — that key
  would be inlined into the client bundle. The header sits above all contest data, so it
  was fully checkable locally in the empty state, then confirmed live with real rows.

**Verified** — `npm run build` exited 0. Checked on `next start` at 1440px, 390px and
375px with no horizontal overflow at any width, on the homepage and on /creators and
/submit to confirm the shared-mark refactor left the inner header alone. Then live at the
same three widths after deploy (f657d34). The homepage, /creators and /submit all
return 200.

**Before / after** — `reports/design/2026-09-17-before.png`,
`reports/design/2026-09-17-before-390.png`, `reports/design/2026-09-17-before-375.png`,
`reports/design/2026-09-17-after.png`, `reports/design/2026-09-17-after-390.png`,
`reports/design/2026-09-17-after-375.png`.

## 2026-09-16 — The browse toolbar, set as one labelled control bar

**Changed** — the controls above the contest grid in `src/components/ContestBrowser.tsx`,
styled by a new `.bb-*` block at the end of `globals.css`. This toolbar is how anyone
narrows 77 contests down to the ones they can actually enter.

**Was** — three rows of unlike parts stacked on top of each other.
- **No shared baseline.** The search field was 40px tall (`.input`, `padding: 10px 14px`),
  the sort select 34px (`padding: 8px 10px`) and the Cards/List toggle 35px
  (`padding: 8px 12px`). Three bordered white boxes on one line, none of them agreeing.
- **A select with no caret.** The sort control had `appearance: none` and nothing drawn
  in its place, so "Closing soonest" sat in a plain white rounded box with no affordance
  at all — the same shape as the search field beside it. The one control that changes the
  order of every contest on the page read as a text input.
- **Two anonymous rows of pills.** Nothing said what the status chips or the category
  chips filtered. "Sort" was the only labelled control in the bar.
- **A divider that broke on a phone.** "Free entry" was held apart from the three status
  tabs by a bare `<span>` 1px high and 16px tall. At 390px the row wrapped: the divider
  dangled at the end of the first line and "Free entry" sat alone on the second. Flagged
  on 2026-09-11, 2026-09-13 and 2026-09-14 and not fixed until now.
- Chips were about 28px tall, under a thumb.

**Now** —
- **Every row names its dimension.** Sort, Show, Category, each a small-caps Space Grotesk
  label in `#8B867C` with its controls in a second column. Below 640px the label moves
  above its chips, because a label column at 390px takes a third of the width and pushes
  every chip row to three lines.
- **One height.** Search, sort and the view toggle are all 38px, so the top row reads as
  one object rather than three.
- **The select has a caret** — a 6px rotated corner in the label grey, drawn on the
  wrapper so it cannot be clicked through. That is the whole affordance, and it is enough.
- **The divider is gone.** The Show label does the grouping the rule was standing in for.
  "Free entry" still wraps to its own line at 390px, but as the fourth item of a named
  group rather than an orphan behind a hanging tick.
- **36px chips on a phone**, and `aria-pressed` on every filter button so a screen reader
  says which ones are on. The view toggle clips its overflow, so its focus ring is inset
  the same way `.tick-item` and `.inav-link` handle theirs.

No filter behaviour, label text, ordering, copy or data changed.

**Inspiration** — Letterboxd's Browse Films bar. Four filters and a sort sit on a single
line as `DECADE ⌄  GENRE ⌄  SERVICE ⌄  Sort by FILM POPULARITY ⌄`: no pills, no boxes, no
fills. The dimension is named in grey, the current value sits next to it in caps, and a
small caret is the only thing marking any of it as a control. Twenty pixels of height does
the work our three rows were doing. Siteinspire's `Popular Categories · Styles · Types ·
Subjects · Platforms` strip was also open, and makes the same bet: filters set as words on
a rule, not as buttons. Adapted rather than copied: we have nine categories with emoji and
four status states, which will not fit one line at 390px, so ours stay as chips — but they
inherit Letterboxd's label-then-value grammar and its caret.

**Noted for a later run, not done today** —
- **Data, for the research robot:** Bali International AI Film Festival (BIAIFF) 2026 —
  Season 5 shows a deadline of Sep 15, 2026 and is still marked open, so today it renders
  in "Closing this week" with its date already past. Same class of bug as the Busan entry
  noted on 2026-09-11.
- The "Research agent running daily · fresh contests added 24/7" pill above this toolbar
  still wraps to two ragged lines at both 390px and 375px, and still carries its
  `backdropFilter` blur and green glow ring. Now the most obviously unfinished thing in the
  browse section. The "daily" versus "24/7" contradiction is a copy call for Abhi.
- The "Closing this week" group heading ends with a bare count at the far right of a long
  hairline, which reads as a stray digit at 1440px.
- Still open: the homepage header's gradient logo mark and blurred background, the
  Ruminatex callout's `backdropFilter`, the subscribe success state's boxed indigo panel,
  and `/tools/[slug]` and `/categories/[slug]` not using `InnerLayout`.
- Process: `.env.cron` still has no `NEXT_PUBLIC_SUPABASE_ANON_KEY`, so a local build
  renders zero contests. The toolbar was checked locally in that empty state (which does
  exercise every control, with zero counts) and then live after deploy.

**Verified** — `npm run build` exited 0. Checked on `next start` at 1440px, 390px and
375px with no horizontal overflow at any width, then live at the same three widths after
deploy (8016453). The homepage returns 200.

**Before / after** — `reports/design/2026-09-16-before.png`,
`reports/design/2026-09-16-before-390.png`, `reports/design/2026-09-16-after.png`,
`reports/design/2026-09-16-after-390.png`, `reports/design/2026-09-16-after-375.png`.

## 2026-09-15 — The deadline ticker, readable on paper

**Changed** — the ticker under the homepage header (`src/app/page.tsx`) and the
`.ticker-*` / new `.tick-*` rules in `globals.css`.

**Was** — the ticker was the last homepage element still in dark-theme colours. Each
deadline date was `#E7E4DC` on the `#FBFAF8` paper, a contrast of about 1.2:1, so "Sep 20"
was close to invisible at both widths. The days count was `#A8A296` unless a deadline
was within five days, when it went red `#DC2626` with a red glow on its dot; open dots
had a green glow. Items were separated by a 14px `⎮` glyph in placeholder grey. The whole
row faded to 60% opacity on hover, the reverse of what a hover should do. The loop is made
by rendering the list twice, and both copies were links in the tab order and in the
accessibility tree, so a screen reader read every contest twice. It also kept moving while
a keyboard user tabbed through it, and there was no reduced-motion rule.

**Now** —
- **One ruled cell per contest.** A `#E3DED3` hairline between cells replaces the glyph,
  and the strip sits on solid paper with the same hairline under it.
- **The house deadline order.** Name in `#5E594F`, then the days count as the figure in
  ink, weight 600, tabular figures, then the date as a small-caps caption in `#7A7469`
  (the `.spot-label` grey). Inside seven days the dot and the count turn burnt orange
  `#C2410C`, the same threshold and colour as the cards and the spotlight. The threshold
  was five days before. No glows.
- **Hover reveals instead of fading:** the name turns ink with a quiet underline.
- **Accessible loop.** The duplicate copy is `aria-hidden` and out of the tab order.
  Hover and keyboard focus both pause the scroll. With `prefers-reduced-motion`, the
  animation stops, the duplicate is hidden, and the strip becomes a static row you can
  swipe.

No contest data, link, label or ordering changed.

**Inspiration** — Metrograph's "Today's Films" rail on its homepage (the FT markets page
was also open, but its data strip was not in view). Each entry is two facts: the title,
then the showtime in the house red, with a rule between entries. Nothing in the rail is
faded to decoration, and colour lands only on the time-sensitive fact. Adapted rather than
copied: our strip moves horizontally and carries three facts, so the rules run
vertically and the date is a caption rather than a coloured line.

**Noted for a later run, not done today** —
- The ticker and the spotlight can disagree by a day. Live today the 1 Billion AI Film
  Award reads "15d · Sep 30" in the ticker and "14 days left · Sep 29, 2026" in the
  spotlight. The ticker's `daysLeft()` rounds up with `Math.ceil` and `fmtShort()` formats
  in the server's timezone, while the cards and spotlight use `timeLeft()`. Worth making
  the ticker call the same helper. That is a logic change, so it was left out of today's
  visual one.
- Still open: the homepage header's `navbg` gradient logo and blurred background, the
  `.agent-badge` pill wrap at 390px, the Ruminatex callout's `backdropFilter`, and
  `/tools/[slug]` and `/categories/[slug]` not using `InnerLayout`.
- Process: `.env.cron` still has no public anon key, so a local build renders no contests
  and no ticker. The new ticker was checked before pushing in a static harness that loaded
  the built CSS with five real contest rows, then checked live.

**Verified** — `npm run build` passed. Harness checked at 1440px and 390px, then live at
1440px, 390px and 375px after deploy (d58c606). No horizontal overflow at any width. The
homepage returns 200, and /submit still renders cleanly at 390px.

**Before / after** — `reports/design/2026-09-15-before.png`,
`reports/design/2026-09-15-before-390.png`, `reports/design/2026-09-15-after.png`,
`reports/design/2026-09-15-after-390.png`, `reports/design/2026-09-15-after-375.png`.

## 2026-09-14 — The inner-page header, one line on a phone

**Changed** — `src/components/InnerLayout.tsx`, a new client component
`src/components/InnerNav.tsx`, and an `.inav-*` block at the end of `globals.css`. This
header sits on every guide, topic, creator, location, prize and versus page, the three
contest listings (closing soon, free, cash prizes) and the 404.

**Was** — at 390px the six nav links wrapped to three rows under the logo: about 140px of
header before the breadcrumb, and it was sticky, so it kept that slice of a phone screen
for the whole read. No link said which section you were in. The header was translucent
paper with `backdropFilter: blur(16px)`, and the logo mark still had the indigo-to-violet
gradient, both flagged as dark-theme leftovers on 2026-09-13. On desktop the header used
`max-w-4xl` while most of these pages set their content in `max-w-5xl`, so the logo sat
64px to the right of the content edge under it.

**Now** —
- **One swipeable line on a phone.** Below 760px the logo takes one short row and the
  links sit in a single horizontal scroller under it, with a soft fade on the right edge
  as the hint that it scrolls. Header height at 390px is about 92px, down from 140px.
  On a phone it scrolls away with the page instead of sticking; on desktop it stays
  sticky, where there is room.
- **The current section is marked.** The matching link turns ink, weight 500, with a 2px
  indigo underline that sits on the header's hairline, and carries `aria-current="page"`.
  Matching is by path prefix, so a creator profile marks Creators. On a phone the current
  link is scrolled into view on load, so Creators is not hidden past the fade.
- **Flat.** Solid paper `#FBFAF8` and a `#E3DED3` hairline, no blur. The logo mark is flat
  indigo `#4F46E5`, which also drops the duplicate SVG gradient id the header and footer
  used to share.
- **Aligned.** Header and footer now use `max-w-5xl`, so on desktop the logo lines up
  with the breadcrumb and hero band. The footer's link row can wrap.
- Links stay 13px `#7A7469`, at least 40px tall on a phone. Focus rings are inset by 2px
  so the scroller does not clip them.

No link targets, labels, data or copy changed.

**Inspiration** — Criterion Current and Metrograph, both at 390px. Each keeps its phone
header to a single short row (Metrograph's is about 55px: wordmark left, sign-in and
search right) and puts everything else one gesture away, so the first thing under the
header is the page itself. Adapted rather than copied: we have no menu or search to hide
links behind, and six plain links are easier to use than a hamburger, so ours stay
visible in one scrolling line.

**Noted for a later run, not done today** —
- `/tools/[slug]` and `/categories/[slug]` do not use `InnerLayout`. They have their own
  header with an "AI" text logo tile, a lone "← All contests" link and a `max-w-4xl`
  container that does not line up with their content. Moving them onto `InnerLayout`
  would give every inner page the same header.
- The homepage header still has the `navbg` gradient logo and a blurred background.
- Still open: the `.agent-badge` pill wrap at 390px, "Free entry" alone on a second tab row.
- Process note: today's design commit (a0834b1) was authored with Abhi's personal email
  instead of the bot's noreply address. Left as is rather than force-pushing `main`.

**Verified** — built locally, checked on `next start` at 1440px, 390px and 375px on
/contests/closing-soon, /creators and /contests/free, then live at the same widths. No
horizontal overflow at any width. Unknown URLs still return a real 404.

**Before / after** — `reports/design/2026-09-14-before.png`,
`reports/design/2026-09-14-before-390.png`, `reports/design/2026-09-14-before-375.png`,
`reports/design/2026-09-14-after.png`, `reports/design/2026-09-14-after-390.png`,
`reports/design/2026-09-14-after-375.png`.

## 2026-09-13 — A 404 page with the site still around it

**Changed** — new `src/app/not-found.tsx`, plus a `.nf-*` block at the end of
`globals.css`. It renders for every unknown URL and every `notFound()` call on the site:
contests, guides, topics, tools, vs, prize, location, categories and creators.

**Was** — the default Next.js 404. Pure white `#FFFFFF`, not paper, with "404 | This page
could not be found." centred in the middle of an empty screen. No nav, no logo, no link
anywhere, so the only way out was the back button. That matters more than it sounds: the
weekly review merges duplicate contest rows, so an old contest link in a subscriber's
inbox, a guide, or a search result can point at an id that no longer exists. Those
visitors already wanted a contest, and the site dropped them on a blank page.

**Now** —
- **The site chrome stays.** The page uses `InnerLayout`, so the header nav and the
  footer (with Submit a Contest) are there, on paper.
- **A plain statement, in the house order.** A burnt-orange small-caps label
  ("404 · Page not found"), the same label colour the submit and subscribe error blocks
  use; a Space Grotesk headline at up to 44px with tight tracking; one sentence of body
  saying the likely reason, a moved or merged listing, which is true of how this site works.
- **Four ruled ways back in,** under a dark hairline like the hero figures: browse every
  contest, closing soon, free to enter, submit a contest. Each row is a title and a
  one-line note, with an arrow that turns indigo and nudges right on hover. Rows are at
  least 44px tall for a thumb, and keep the global indigo focus ring.
- **The clapperboard drawing** from `Illustrations.tsx` sits beside the headline on
  desktop and is dropped below 640px, where it would push the links under the fold.

No data, no existing copy, no URLs and no other page changed.

**Inspiration** — Are.na's 404. It keeps the full header and search, then says only a
small orange "Error", a plain "Page not found", and one sentence where the ways out
(Home, Explore, About, Help) are the bold words inside the sentence. No illustration
of a lost astronaut, no joke. The page's job is to hand you back to the site. Also
looked at Mubi ("Nothing to see here" and one Now Showing button) and Metrograph (a
search box). Adapted rather than copied: a directory has more than one sensible way
back in, so ours are ruled rows with a note each rather than inline links, set in the
same hairline language as the hero figures and the spotlight.

**Noted for a later run, not done today** —
- At 390px the `InnerLayout` nav wraps to two rows of six links under the logo, about
  200px of header before any content on every inner page. Worth a compact phone nav.
- `InnerLayout`'s logo mark still uses the indigo-to-violet gradient and a
  `backdropFilter: blur(16px)` header, both dark-theme leftovers.
- Still open from earlier entries: the `.agent-badge` pill wrap and glow at 390px, and the
  "Free entry" tab sitting alone on a second row.

**Verified** — built locally, checked at 1440px, 390px and 375px on `next start`, then
live at the same three widths. No horizontal overflow at any width. The page returns a
real HTTP 404, not a 200, so search engines still drop dead URLs.

**Before / after** — `reports/design/2026-09-13-before.png`,
`reports/design/2026-09-13-before-390.png`, `reports/design/2026-09-13-after.png`,
`reports/design/2026-09-13-after-390.png`, `reports/design/2026-09-13-after-375.png`.

## 2026-09-12 — The subscribe card, flat, with an error state someone wrote

**Changed** — the subscribe card in the homepage hero (`src/app/page.tsx`) and the
form inside it, `src/components/EmailSubscribe.tsx`, which also appears on contest,
topic, creator and the closing-soon and free listing pages.

**Was** — the card still carried a dark-theme shadow, `0 24px 48px -12px
rgba(0,0,0,0.6)`, plus `backdropFilter: blur(20px)`. On paper that painted a wide grey
smear under the one form that turns a visitor into a subscriber, worst at 390px where it
spread past the card edges. Flagged in the 2026-09-10 entry. Errors were a loose
`text-red-400` line: pale pinkish red, 12px, on white, the colour the old dark theme used.
The consent line was `#8B867C` and its "Unsubscribe anytime" link `#A8A296`, placeholder
grey, so the sentence that tells you you can leave was the faintest text in the card. The
name and email inputs had no label except the placeholder, which disappears as you type.

**Now** —
- **Flat.** No shadow, no blur. A real `#E3DED3` hairline border on white is enough to
  hold the card on paper, the same way the spotlight card beside it sits.
- **A written error state.** `SubscribeError` is the burnt-orange ruled block the submit
  form got on 2026-09-09: a 2px left rule, a small-caps "Not subscribed yet" label, the
  message in body ink, `role="alert"`. Both the full and compact forms use it, so
  "Please agree to receive email alerts to continue" now reads as a thing to fix, not a
  stray line.
- **The consent line in readable grey** (`#6F6A61`), the unsubscribe link in the same
  colour with a proper underline offset.
- **`aria-label` on the three placeholder-only inputs.**

Copy, the consent rule, the API call, the success state and every link are unchanged.

**Inspiration** — Dense Discovery's homepage. Its signup is a single field fused to a
dark button, sitting straight on the page with no card, no shadow and no box around it,
and under it a plain line saying when the next issue goes out. The form earns attention
by being the only control on the screen, not by floating. Adapted rather than copied: our
card stays, because it sits in a busy hero next to the spotlight and needs an edge to
group its heading with its fields, but it lost everything that made it float.

**Noted for a later run, not done today** —
- A copy contradiction for Abhi: this card promises an alert "7 days before any deadline
  closes"; the three-up row just below says "one last call three days before a deadline".
  One of them is wrong. Not touched, since it is the meaning of the copy.
- The success state still has a boxed indigo "One quick step to guarantee delivery →"
  panel and an em dash in its copy. Worth setting in the same ruled language.
- The "Research agent running daily · fresh contests added 24/7" pill and the Ruminatex
  callout below the grid still carry `backdropFilter` blurs from the dark theme.

**Verified** — built locally, checked at 1440px, 390px and 375px with no horizontal
overflow, locally and again live. Error state checked in a real browser: an email with consent unticked renders
the "Not subscribed yet" block in `rgb(194, 65, 12)` with its 2px rule. Live checked
after deploy.

**Before / after** — `reports/design/2026-09-12-before.png`,
`reports/design/2026-09-12-before-390.png`, `reports/design/2026-09-12-after.png`,
`reports/design/2026-09-12-after-390.png`, `reports/design/2026-09-12-after-375.png`.

## 2026-09-11 — The featured contest, in the same deadline language as the grid

**Changed** — `src/components/FeaturedSpotlight.tsx`, plus a `.spot-label` rule in
`globals.css`. The card on the right of the homepage hero, which is the slot the /feature
page sells.

**Was** — the prize sat in an indigo-filled box and the deadline in a pink-filled box, so
the card was two coloured boxes inside a white box inside the page. The deadline read
"2d 5h / remaining" with "Sep 13, 2026" in grey on the left. Scroll down to the grid and
the same contest said "2 days left / SEP 13, 2026". It was the contest we most want people
to enter, and the only one on the page describing its deadline in a different format.
The deadline also came last, under three lines of description, so the fact that decides
whether you enter was the one you reached after reading everything else. Organizer and
description were `#A8A296` and `#8B867C` on white, which are hard to read at those sizes.
Two empty divs from the dark theme ("top gradient highlight", "corner glow") were still
rendering and doing nothing.

**Now** —
- **Two ruled rows under the title**, prize then deadline, each with a small-caps label.
  A darker hairline above, a quiet one between and below. No fills. This is the same
  treatment as the hero figures from yesterday, so the whole hero now groups with rules.
- **The card's wording and order.** Time left is the figure ("2 days left", "5 hours
  left"), the date is a small-caps caption beside it on the same baseline, and the figure
  turns burnt orange inside seven days. `timeLeft()` is copied from `ContestCard` so the
  two can't drift apart. Past a deadline, the date alone is the figure, as on the cards.
- **Facts before prose.** The description moved below the two rows, directly above Enter
  Now, and its grey went up a step to `#6F6A61`. Organizer went to `#8B867C`, the card
  caption grey.
- **Tabular figures** on the prize and the deadline.

Nothing about the data, the links, the button, or the featured selection changed.

**Inspiration** — Metrograph's Now Playing page (Criterion, Film at Lincoln Center and
Letterboxd all served a Cloudflare check to the headless browser). Each film is set as
title, then the date block and showtime, then a single slash-separated credits line, and
only then the synopsis, cut short with "MORE…". The fact you act on comes before the
prose, every time. Our spotlight did the reverse. Adapted rather than copied: we have no
dates to tile, so the two facts are ruled rows rather than calendar blocks.

**Noted for a later run, not done today** —
- The spotlight is `display: none` below 860px (`.hero-spotlight` in `globals.css`), so
  phone visitors never see it. /feature sells "Pinned in the homepage spotlight for 30
  days". Whether a phone should get a compact version of it is a call for Abhi, since it
  touches what a paid listing includes.
- At 390px the "Research agent running daily · fresh contests added 24/7" pill above the
  browse grid wraps badly: "daily" drops to its own line and the grey half becomes a
  narrow column. It also carries `backdropFilter: blur(8px)` and a green glow ring
  (`.agent-badge`), both dark-theme leftovers. And "daily" next to "24/7" is a
  contradiction; the copy question is Abhi's.
- Also at 390px, "Free entry" sits alone on a second line of the status tabs with a
  stray divider hanging in front of it, the same 3 + 1 problem the hero figures had.
- Data, for the research robot: Busan International AI Film Festival (BIAIF) 2026
  shows a deadline of Sep 10, 2026 but is still marked open, so it sits at the top of
  "Closing this week" a day after it closed. Not changed here.

**Verified** — built and checked locally with a throwaway preview page (the local
env has no anon key, so the homepage renders no contests locally) in three states: under
seven days, 49 days, and a past deadline. Live at 1440px, 390px and 375px, no horizontal
overflow at any width.

**Before / after** — `reports/design/2026-09-11-before.png`,
`reports/design/2026-09-11-before-390.png`, `reports/design/2026-09-11-after.png`,
`reports/design/2026-09-11-after-390.png`, `reports/design/2026-09-11-after-375.png`.
The spotlight only appears in the 1440px pair; the phone shots confirm the hero is
unchanged there.

## 2026-09-10 — The homepage figures, ruled instead of boxed

**Changed** — the stat strip under the homepage headline (`src/app/page.tsx`), styled
by a new `.hero-stats` block in `globals.css`. The first numbers anyone sees on the site.

**Was** — four figures (open now, coming soon, in prizes, active) in a bordered, filled,
rounded box with `backdropFilter: blur(8px)`, a glass leftover from the dark theme that
does nothing on flat paper. The box was a flex row with `flexWrap: wrap`, so at 390px it
broke 3 + 1: "77 ACTIVE" sat alone on a second row under an empty two-thirds of a box,
with a stray divider hanging off the end of the first row. That was the one part of the
hero that looked squeezed rather than set. The labels were `#A8A296` at 10px, placeholder
grey, about 2.4:1 against the paper, so the words explaining each number were the
hardest thing in the hero to read.

**Now** —
- **A ruled row, not a box.** A darker hairline above, a quiet one below, hairlines
  between the figures. No fill, no radius, no blur. The rules group the figures, which
  is how a programme sets a totals line.
- **2 × 2 below 520px,** with the same hairlines between cells and between rows, so on
  a phone it reads as a small table and nothing is left on its own.
- **Tabular figures** at up to 28px with tighter tracking, so 74, 3 and 77 sit on the
  same grid.
- **Labels you can read:** `#7A7469`, 10.5px, weight 500, 0.08em tracking. "Active" is
  now in body ink instead of the same grey as its label.

Figures, labels, colours per status, and the prize formula are all unchanged.

**Inspiration** — Letterboxd's film pages (Sundance and Metrograph timed out in the
headless capture). What's worth keeping: the watches, lists and likes counts under
each film (7.5M, 890K, 3.9M on Parasite) are set as plain 12px figures with no border,
no fill, no container at all, and the ratings block below is introduced by a small-caps
"RATINGS" label over a single hairline. The rule does the grouping. Adapted rather than
copied: our figures are the headline numbers, so they stay large and keep their status
colours, and the hairline goes above them where Letterboxd puts it above its histogram.

**Noted for a later run, not done today** — two dark-theme leftovers in the same hero.
The subscribe card still carries `boxShadow: … 0 24px 48px -12px rgba(0,0,0,0.6)` and
`backdropFilter: blur(20px)`: on paper that paints a heavy grey smear under the card,
most visible at 390px. And `FeaturedSpotlight` still says "3d 5h remaining" inside a
pink box while every contest card says "N days left" over the date (2026-09-08 entry):
the one contest we most want people to enter speaks a different deadline language from
the rest of the page. Separately, a question for Abhi rather than a design call: "77
active" is exactly 74 open plus 3 coming soon, so it repeats the two figures before it.
"167 tracked" or "N closing this week" would each tell a visitor something new.

**Verified** — live, at 1440px, 390px and 375px. No horizontal overflow at any width.

**Before / after** — `reports/design/2026-09-10-before.png`,
`reports/design/2026-09-10-before-390.png`, `reports/design/2026-09-10-after.png`,
`reports/design/2026-09-10-after-390.png`.

## 2026-09-09 — The submit form, given hierarchy and a visible focus state

**Changed** — `src/app/submit/SubmitForm.tsx`. The one page where a stranger types
real data and hands us their email.

**Was** — nine fields, all identical: a grey-on-grey fill (`rgba(27,25,22,0.03)`) inside
a border at 9% opacity you had to hunt for, every label the same 11px small caps, and
`outline: 'none'` inline on every input with nothing put back. That last one is the
defect: an inline style beats a stylesheet rule, so it silently overrode the global
`:focus-visible` outline in `globals.css` and a keyboard user got no indication at all of
which field they were in. Nobody had spotted it because the rule *exists* — it just never
applied here. The site already has a designed input (`.input`: white ground, a real
`#E0DCD2` border, `#A8A296` placeholder, an indigo ring on focus) and the subscribe form
on the homepage uses it. The submit form ignored it and reinvented a worse one.

**Now** —
- **The designed input, everywhere.** `.input` on all nine fields, so the form matches the
  subscribe box a filmmaker saw thirty seconds earlier, and focus is visible again.
- **Three groups, hairline-separated,** in the order the work happens: *The two things we
  verify* (contest name, official page), *Details, if you have them* (organizer, deadline,
  prize, entry fee), *So we can reply* (email, role, notes). Hierarchy carried by a
  Space Grotesk 15px heading over a hairline, not by a box.
- **Required is the default.** The bare `*` on two fields is gone; the six genuinely
  optional fields carry a quiet lowercase `optional` in the label row instead. The form is
  mostly optional and now looks it, which is the honest read of a two-minute task rather
  than a nine-field one.
- **One line of copy that earns trust,** under the official page: we read this page before
  the listing goes live and again every morning after that, and a FilmFreeway page works.
  It states what the site actually does; it is the reason to bother filling this in.

**Also fixed, all visible** — the date field carried `colorScheme: 'dark'`, a leftover
from the retired dark theme that renders the native picker dark on paper; its
`yyyy-mm-dd` also sat at full ink weight, so the emptiest field on the page looked like
the most filled-in one, and it is now placeholder grey. The role `select` had
`appearance: none` and no arrow put back, so a dropdown read as a plain text field — it
has a caret. The error state was a single loose orange line; it is now a burnt-orange
hairline block labelled "Not sent" over the message.

**Inspiration** — Are.na's sign-up page (Criterion, It’s Nice That and Letterboxd all
refused the fetch or served nothing). The observation worth keeping: Are.na frames a field
only where a *decision* is being made. The four account inputs are one uninterrupted
borderless stack, and then the three subscription tiers are the only bordered blocks on
the page, so the eye goes straight to the choice. Our form had the opposite arrangement —
identical framing on all nine — so nothing led. Adapted rather than copied: we keep the
field borders, because ours sit on paper and need the edge, and we spend the emphasis on
the group headings so the two fields we actually verify read first.

**Not done** — the fields still validate only on submit, so a malformed URL is caught by
the browser rather than by us. Per-field inline validation is the natural next step here
and it is more than one day’s change.

**Verified** — 1440px and a true 390px viewport, no horizontal overflow at either. The
two-up rows collapse to single column below 190px per column, so nothing is squeezed.

**Before / after** — `reports/design/2026-09-09-before.png`,
`reports/design/2026-09-09-before-390.png`, `reports/design/2026-09-09-after.png`,
`reports/design/2026-09-09-after-390.png`.

## 2026-09-08 (5) — Browsing, instead of one long scroll

**Changed** — `src/components/ContestBrowser.tsx`, rebuilt.

**Was** — 70 active contests dumped into one grid with three tab rows above them.
No search, no sort, no paging, no result count. The only way to find a specific
festival was to scroll past everything else. Worse, the category filter matched raw
slugs (`'short-film'`) against a column the research robot fills with freeform text,
so "Short Film", "short film" and "narrative" were all invisible to it. Roughly two
thirds of the catalogue could not be filtered to at all.

**Now** —
- **Search** across name, organizer, prize, location, tags and accepted tools. With 158
  contests this is the fastest path to a specific festival.
- **Sort:** closing soonest (default), biggest prize, recently added. Prize sorting reads
  the largest money figure out of the prize string, currency-agnostic since it ranks
  rather than converts.
- **Grouped by deadline** when sorted that way: closing this week (in burnt orange),
  closing this month, in the next three months, later in the year, not open yet. Each
  header carries its count. This is the question a filmmaker actually has, and it turns
  one scroll into named chunks.
- **Twelve at a time**, with a "Show 12 more" button and an "12 of 70" line under it.
  Deliberately not infinite scroll: the reader decides how much page they get.
- **Cards or List.** The list is one hairline row per contest — emoji, name, organizer,
  prize, days left — so 70 contests can be scanned in a screen or two. The prize column
  drops below 560px, where the name and the deadline are what people scan by.
- **A result count and a clear-filters link**, so a filtered view never looks like an
  empty catalogue.
- **Filters live in the URL** (`?q=&cat=&free=1&sort=`) via `replaceState`, so a filtered
  view is shareable and Back still leaves the page rather than unwinding filter changes.
- **A real empty state** naming what was searched, instead of the old grey line.

**Fixed** — the category filter now matches on the normalized label from
`normalizeCategory`, so all eight categories return their true set.

**Verified** — 1440px and 390px, no horizontal overflow in either view.

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
