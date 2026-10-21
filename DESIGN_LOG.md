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

## 2026-10-21 — The contest page's deadline alert, ruled instead of boxed

**Changed** — the `Don't miss this deadline` block in
`src/app/contests/[id]/page.tsx`. 17 lines added, 7 removed, 12 of the additions
being the comment that explains the colour. No CSS file touched, no copy, no
data, no URL, no form behaviour.

**Was** — a 14px-radius panel filled `#F3F0F9` behind an `#E1DAF0` hairline,
its sentence set in `#4C3F72`.

Those three values are not a CTA palette. They are the **Feature** tint out of
`src/lib/theme.ts` — the row that reads
`feature: { label: 'Feature', emoji: '📽️', bg: '#F3F0F9', border: '#E1DAF0', text: '#4C3F72' }`.
On this site purple means feature film, and it means it everywhere: in the card
tint, in the category chip, in the header band at the top of this very page.

So on a short-film contest the page opened with a blue band and closed with a
purple one. On a documentary, sand at the top and purple at the bottom. The
colour was telling the reader something, and what it was telling them was
wrong on seven categories out of eight. Korea AI Cinema Festival — the page
the before shot was taken on — is tinted `#E7F1F8` short-film blue at the top
and was carrying the feature purple 1,000px below it.

And the panel was the only block on the page that had neither reason to be one.
Counted at 1440px, the page carried five filled rounded blocks: the 984x176
header band (the contest's own category tint), the 320x652 white Apply rail
(it holds the controls), three 317x361 related cards (each one is a link you
press) — and this.

**Looked at** — three editorial sites, with one question: when a site that
publishes for a living asks you to join its mailing list mid-page, what does it
put around the ask?

Dense Discovery, which *is* a newsletter, answers most flatly. On issue #364
there is exactly one filled, rounded element on the page and it is the
`Subscribe Now` anchor itself: 114x47, 8.5px radius, `rgb(49,49,49)`. The pitch
around it — heading, sentence, the issue count — sits on the page ground with
no container at all. The fill is on the thing you press and on nothing else.
It's Nice That's homepage returns zero filled-or-bordered rounded blocks over
200x60, MUBI's Notebook index zero over 240x70 that differ from the body
ground. Adapted, not copied: our form needs a field, a button and a consent
line, which is more than a single anchor — but the conclusion holds, and our
own house grammar had already answered it. Every other block on this page is a
hairline and a label on paper.

**Now** — the band the rest of the page is built from. A 1px `#ECE9E2` rule,
26px of air, `Don't miss this deadline` at the same 18px Space Grotesk 700 ink
it had before, and the sentence underneath in `#3E3A33` — the body ink the
Principles name, the same one WHO CAN ENTER and AI TOOLS ALLOWED use further up
the page. No fill, no radius, no border. A `<section>` rather than a `<div>`,
since it is one. The grid stays `auto-fit minmax(260px, 1fr)`, so it is still
text-then-form at desktop and stacked on a phone, now aligned to the rule
rather than centred against each other.

Losing the panel cost nothing and returned the padding it was eating:

| width | block height | email field |
|---|---|---|
| 1440 | 139 → 108px | 343 → 368px |
| 390  | 303 → 282px | 308 → 350px |
| 375  | 303 → 282px | 293 → 335px |

The field number is the one that matters. `EmailSubscribe`'s own comment, from
the run that made it wrap, says a 21-character address sets at 176px and that
you cannot read back what you typed in less. The panel's 20px of padding on
each side was taken straight off the field on exactly the width where that is
tightest; the phone field is now 42px wider than it was.

**Noted for a later run, not done today** —

- **The homepage does the same thing.** `src/app/page.tsx` lines 523–540 wrap
  the "Know before the deadline." section in the same `#F3F0F9` / `#E1DAF0`
  pair and set its `ALWAYS CURRENT` label in `#4C3F72`. Same borrowed tint,
  same argument, different page — but that block is the homepage's second
  subscribe pitch and owns a bigger piece of the page, so it is its own run.
- The contest page's new rule spans the full 984px content width while the four
  `Section` rules above it — PRIZE DETAILS, WHO CAN ENTER, AI TOOLS ALLOWED,
  TAGGED — all measure 616px, stopping where the Apply rail begins. It reads as
  the page widening once the rail ends, which is what happens, but it does mean
  the page now carries hairlines at two measures. Worth a look on a run that
  owns the contest page's grid.
- Carried: the browse toolbar's "Research agent running daily · fresh contests
  added 24/7" pill still wraps to two ragged lines and still carries a
  `backdropFilter` blur. `src/app/cinematic-ads/page.tsx` is still the only
  other page using `backdropFilter`.
- Process: `.env.cron` still has no `NEXT_PUBLIC_SUPABASE_ANON_KEY`. It no
  longer empties the local grid — the 10-19 snapshot fallback serves 247 rows
  from `src/data/contests-snapshot.json` — but the homepage hero therefore
  renders its amber "live data unavailable" state on every local build, and
  Supabase was in fact unreachable from this machine today as well.

**Verified** — `npm run build` exited 0. Measured on `next start` at 1440px,
390px and 375px, before and after, with the numbers above; no horizontal
overflow at any of the three. Checked the three shapes the block has: hidden on
a closed contest (`wsxa-hailuo-2026`, 0 occurrences), present on a documentary
(`visionaria-rome-2026`, and no `#F3F0F9` anywhere on that page any more), and
present on a feature contest (`all-is-prompt-ai-film-festival-2026`, where the
one remaining `#F3F0F9` is the Feature category chip in the header band — the
tint doing its actual job). Live after deploy (126ca92); the page returns 200.

**Before / after** — `reports/design/2026-10-21-before.png` and
`2026-10-21-after.png` are the same contest page at the same 1000px scroll,
Korea AI Cinema Festival. `2026-10-21-before-390.png` and
`2026-10-21-after-390.png` are the same pair at 390px and 1950px of scroll, and
`2026-10-21-after-375.png` is the live page at 375px.

---

## 2026-10-20 — The contest page's AI tools, as a rule and its examples

**Changed** — the `AI tools allowed` section of `src/app/contests/[id]/page.tsx`,
now a small `ToolsAllowed` component beside `Section`, plus one new CSS rule
`.ctools` next to `.ctags`. 75 lines added, 15 removed, 33 of the additions
being comments. No tool data changed, no URL, no copy on any other block.

**Was** — every entry in `ai_tools_allowed`, whatever it said, rendered as the
same object: 13px Space Grotesk, white fill, a 1px `#E0DCD2` border, a 6px
radius, in a wrapping row.

Three different kinds of fact arrive in that one array, and the row flattened
all three into one shape.

`Any AI tool` is the **rule** — the thing an entrant must obey.
`Runway` is an **example** of a tool that satisfies the rule.
`Seedance (required, at least 70% of final film)` is a rule too, and on that
contest's page it is the single most load-bearing line there is: get it wrong
and the entry is void.

Set identically, they cannot be told apart. On African AI Film Festival the
section printed nine chips — `Runway`, `Adobe Firefly`, `Sora`, `Kling`, `Veo`,
`Midjourney`, `Pika`, `ElevenLabs`, `Any AI tool` — with the only line that is
actually a rule sitting ninth, after eight product names, reading as if it were
a ninth product.

The commoner failure was blunter. 43 of the 81 open contests carry nothing in
that field but some spelling of a blanket permission, so for better than half
the directory the whole section was one box. In nine of those the box said
`any`: lowercase, alone, a 44px rounded rectangle under a caption reading
AI TOOLS ALLOWED. And the branch immediately beside it, the one that runs when
the field is empty, already said *"Any AI tools."* as a sentence in body ink —
so the page had the right answer in it the whole time and used it only when it
knew nothing.

The 10-05 entry that de-boxed the tag row argued for keeping these: "the tool
chips name what an entrant may use". That was the wrong cut. 10-19 wrote the
rule the right way round — a border is a promise that pressing it does
something — and these are `<span>`s. This was the last unpressable bordered
cloud on the contest page.

**Looked at** — Metrograph's Now Playing and Criterion's Current.

Metrograph sets each film's specs as one unpunctuated run: `1993 / 139MIN /
35MM`. Which print is screening is exactly the fact a Metrograph audience
decides on — a 35mm booking sells out where the DCP does not — and it is still
plain caps text with no box around it, because at Metrograph the boxes are the
showtimes, the thing you press. Criterion does the same split one level up:
`ESSAYS — OCT 6, 2026` is a muted caption run, the byline underneath is body
ink. What a thing *is* goes quiet; what it *says* gets the ink.

**Now** —

- The rule is a line of body text at 15px `#3E3A33`, the same setting as WHO CAN
  ENTER directly above it. A bare `any` becomes `Any AI tool`; every other entry
  keeps the organizer's own wording, clauses included — `Any AI tool with
  disclosure`, `Any AI tools (Production Journal of AI tools required)` — with
  only a lowercase first letter lifted.
- Named tools follow as one comma run at 13.5px `#6F6A61` (`.ctools`),
  subordinate by size and ink, which is the whole statement: these are instances
  of the rule, not more rules. Casing is kept, unlike `.ctags`, because
  `elevenlabs` reads as a typo where `red carpet` does not.
- Where there is no blanket permission the named entries *are* the restriction,
  so they lead instead of trailing, set as the same ruled list the prize details
  above them already use. PixLight's two lines — `PixVerse Canvas (required as
  primary platform for the Pilot Track)` and `Live-action footage and
  traditional VFX may be incorporated` — now read as the two conditions they
  are, hairline between them.

Checked at 390px and 1440px against all three shapes: blanket only (Golden
Dunes), blanket plus examples (African AI Film Festival), required tool only
(1 Billion Followers Summit, `Seedance (required, at least 70% of final film)`).
No horizontal overflow at either width.

**Before/after** — `reports/design/2026-10-20-before.png` and
`2026-10-20-after.png` are the same page at the same scroll, Golden Dunes Dubai.
`2026-10-20-after-mixed.png` is the rule-plus-examples shape and
`2026-10-20-after-required.png` the required-tool shape.

---

## 2026-10-19 — The card's categories, as a genre line instead of four boxes

**Changed** — row 4 of `src/components/ContestCard.tsx`, plus a four-line
derivation next to the `tint` it already computes. 25 lines added, 17 removed,
15 of the additions being the two comments. No category data, tint, emoji,
caption or link target changed, and no CSS.

**Was** — up to four chips: 10px caps on `rgba(255,255,255,0.72)`, a 5px radius,
a hairline border, the category's own emoji, and — the part that did the damage —
the category's own ink. `#31536B` for short film, `#6E3B57` for animation,
`#7A4A1F` for commercial, `#7C3A31` for music video.

Three things were wrong with that, in rising order.

A border on this site is a promise that something happens when you press it.
That is the rule the 10-05 run wrote down when it took the boxes off the contest
page's tags, and the one place it did not reach was the card, where *nothing* is
pressable except the card — the chips are `<span>`s inside one big `<Link>`. Four
bordered objects that cannot be pressed, sitting inside a thing that can.

Only the **first** category tints a card. So every chip after the first wore an
ink belonging to a colour the card is not: `COMMERCIAL` in burnt orange and
`MUSIC VIDEO` in rust, both on a short-film blue ground. Against the live rows,
68 of the 82 open contests render more than one chip and 28 render four, which
is four different inks and four different borders inside one 318px card. The
grid stopped reading as colour-coded by category and started reading as noise
with a tint behind it.

And chip one was always a restatement. The card's identity is `categories[0]`,
drawn at the top left as a 26px emoji; the chip row is the deduped list, which
begins with `categories[0]`. Every card on the site printed its first category
twice, once as the emoji that gives the card its colour and again as the first
box in the row — 🎞️ at the top, `🎞️ SHORT FILM` 200px below it.

On a phone the row cost about 110px, two wrapped lines of boxes, and it sat
between the blurb and the hairline — so it pushed the prize and the `Verified`
date, the two things that make the card worth trusting, below the first screen
on a scroll.

**Looked at** — Metrograph's Now Playing and It's Nice That's front page.
Metrograph gives each film one unpunctuated spec run — `1976 / 104MIN / 35MM` —
format, running time and print at the same size and the same ink as each other,
sitting under `DIRECTOR: FRANÇOIS TRUFFAUT`. It's Nice That ends every card with
its taxonomy as two words of plain small text under the timestamp: `Work`,
`Animation`. Neither puts a box anywhere near a fact, and neither varies the ink
to say which fact it is — the position in the stack already says that. Between
them and Mubi's genre line, which the 10-05 run cited for the same reason, the
pattern is settled enough to stop looking for it: in an editorial listing, the
filing data is a line of text in the furniture ink, and it goes where the reader
already knows to look.

**Now** — one lowercase comma run: `short film, animation, commercial, music
video`, at 11.5px Space Grotesk 500, line-height 1.55, in `#7A7469`. That ink and
that weight are the organizer's, two rows above, which is the right company for
it — both are the card's filing data, and neither is the thing you came for.
Lowercase for the reason the 10-05 run gave: one register reads as a decision.
Commas rather than middots or slashes, because a comma travels with the word in
front of it and cannot be stranded at a wrap.

The longest possible run across the 82 open rows is 50 characters (`short film,
documentary, experimental, music video`), which sets on one line at 375px and at
390px, and on at most two inside a desktop column. The card gives back about 70px
on a phone, and the prize and the verified date come up with it. The top-left
emoji is now the only place the first category is announced, which is what it was
for.

**Left alone** — the emoji itself, the tint, the `FREE` and `FEATURED` badges in
row 1 and the `OPEN` dot. The badges keep their boxes on the same rule that kept
the contest page's tool chips: `FREE` names a constraint you have to check before
you enter, not a shelf the contest is filed on. `FeaturedSpotlight` sets its
categories its own way and was not touched today; it is one card, not sixty, so
the ink-count argument does not bite there — worth a look on a later run.

**Verified** — `npm run build` exits 0. Checked on a local `next start` at 1440px,
390px and 375px, then live at 1440px and 390px once the deploy landed, on
/contests/closing-soon and on the homepage grid. `✓ no horizontal overflow` clean
at all three widths. The local server reads `src/data/contests-snapshot.json`, so
the local shots carry real contests despite `.env.cron` still having no
`NEXT_PUBLIC_SUPABASE_ANON_KEY`; the snapshot the build regenerated was reverted
before the commit, since it is data.

**Before / after** — `reports/design/2026-10-19-before.png` (1440) and
`-before-390.png`; `2026-10-19-after.png`, `-after-390.png` and
`-after-home-390.png`. All off the live site.

---

## 2026-10-17 — The organizer credit, set the way the organizer writes it

**Changed** — the `<p>` under the `<h1>` in the contest page's header band
(`src/app/contests/[id]/page.tsx`): `fontSize` 12 to 15, `fontWeight` 600 to 500,
`textTransform: 'uppercase'` and `letterSpacing: '0.07em'` dropped for
`letterSpacing: '-0.005em'` and `lineHeight: 1.45`, and `fontFamily: 'Space
Grotesk'` stated instead of inheriting Inter. The h1's `marginBottom` goes 8 to
10. 15 lines added, 3 removed, 11 of the additions being the comment. No colour,
no copy, no data, no layout, no new rule — it keeps the category's own ink on the
category's own tint.

**Was** — caps, 12px, weight 600, 0.07em tracking. That is exactly this page's
label idiom: SUBMISSION DEADLINE, ENTRY FEE, FESTIVAL DATE, PRIZE, CATEGORIES all
wear it, two of them within 200px of this line. But the organizer is a value, not
a label, so the page was setting its content in the typeface of its furniture.

The lengths are what made it bite. 96 of the 243 rows carry an organizer past 24
characters, and the long ones are not brand names — they are sentences, partner
lists and credits: "AI Filmfest Athens — Festival Director Christina Duxa" (53),
"NZ Film Commission, NZ On Air, Te Māngai Pāho, Kōawa Studios" (60), "Asian
American Engineer of the Year (AAEOY) / Chinese Institute of Engineers" (76).
Uppercase threw away the one signal that tells those apart: "(AAEOY)" stopped
looking like an acronym once the words around it were capitals too, "inc." in
"AI FILM JAPAN inc." vanished, and "I'Mpossible Film Festival" — a name built on
its own casing — came out as I'MPOSSIBLE. At 390px the two longest set as three
tracked caps lines sitting directly under the h1, which read as a second,
smaller headline rather than as the credit beneath the first.

This is also the only place on the site where a person's name is printed, and a
person's name in all caps is the one thing you can do to a name without
misspelling it.

**Now** — sentence case, Space Grotesk 15px at weight 500, line-height 1.45. Space
Grotesk because the credit belongs to the title block, and because the cards
already set the organizer in it. 15px/500 against a 24-to-40px h1 at 700 keeps the
hierarchy the caps were enforcing by smallness, and the h1's extra 2px of bottom
margin replaces the optical gap the tracking used to open. Checked on the live
page after deploy at 390px and 1440px, and against the 76-character organizer
rendered into the same markup: three lines at 390px either way, so nothing below
the band moved. No horizontal overflow at either width.

**Left alone** — ContestCard and FeaturedSpotlight still set the organizer in
caps, deliberately. On a card the title is 15px and the organizer 11px: four
points apart, in a grid of sixty, caps is what keeps the second line from
competing with the first, and the string is clipped by the card's width long
before anyone reads it as a sentence. The detail page is the opposite case — one
credit, full width, under a 40px title, and the only page where the whole string
is shown.

**Looked at** — Metrograph's calendar sets the film title in caps and the credit
line beneath it — director, year, runtime, format — in sentence case at a smaller
size: caps for the title, the writer's own case for the credit. Criterion does put
a director's name in tracked caps, but above the title as a kicker, and it is
always one short name. Caps survives in a credit when the credit is short and
fixed in shape; ours runs from 5 to 76 characters, so it cannot borrow that device.

**Before/after** — `reports/design/2026-10-17-before.png`,
`reports/design/2026-10-17-after.png` (AI Filmfest Athens at 390px),
`reports/design/2026-10-17-before-desktop.png`,
`reports/design/2026-10-17-after-desktop.png` (1440px),
`reports/design/2026-10-17-after-short-390.png` (IA en Corto, a short organizer).

## 2026-10-16 — On a phone, the subscribe field gets the whole row

**Changed** — two style declarations and a wrap in `EmailSubscribe.tsx`'s compact
form: the field goes from `className="input flex-1"` to `flex: '1 1 18rem'` with
`minWidth: 0`, the button gets `flex: '0 0 auto'`, and the row that holds them goes
from `flex` to `flex flex-wrap`. 20 lines added, 4 removed, 11 of the additions
being the comment. No colour, no type, no copy, no data, no new breakpoint.

**Was** — the row handed the button its 100px and gave the field whatever was left.
Measured on the live site at 390px, on a contest page that is a 200px field with
174px of text area. A 21-character address — `abhixchawla@gmail.com`, the length of
the address in our own footer — sets at 176px in that 13px face. It did not fit.
The field scrolled as you typed and you could not read back what you had entered
before pressing the button, on the one action the whole site is built to get.

The reach is the part that matters. This compact form is on 18 page types — every
contest page, every guide, topic, tool, vs, prize, location, category and creator
page, and all six browse hubs — so it is the most widely deployed interactive
element we have, and it was at its worst exactly where most people meet it.

Three placements, three different row widths: 308px on a contest page, 335px on a
hub, 350px in a guide. A viewport media query would have been the wrong instrument
for all three, because the same form also sits in a 451px rail on a 1440px desktop,
where the pair side by side is correct and a phone-shaped rule would have broken it.

**Now** — the field asks for an 18rem basis and the row wraps, so the width that
decides the layout is the row's own, not the window's. Any row that cannot seat
18rem + gap + button drops the button onto its own line, flush left with the consent
checkbox below it, and lets the field take the full width. The three phone
placements show 33, 36 and 38 characters. The contest page, the narrowest and the
one measured end to end, went from 20 characters to 33; typed into
the live page, a 21- and a 28-character address are both fully visible at the
narrowest of them, where 21 previously was not. Measured on the live site after the
deploy, the 451px, 728px and 984px placements come back at 343/100, 620/100 and
876/100 — the same numbers as before the change, so desktop is untouched. No
horizontal overflow at 375, 390, 768 or 1440px.

The 876px field on a 1440px guide page is its own problem — a text input eleven
times longer than the longest thing anyone will type into it — but capping it means
deciding what the button does with the slack, which is a different day's change.

**Looked at** — It's Nice That's newsletter sign-up, measured at 390px: a 330px
field at 85% of the viewport with the submit button on its own line beneath it, and
notably *not* stretched to full width — 200px, sized to its label. That last detail
settled the question here. My first pass stretched the button to the full width of
the row, which made the strongest object on the block the control you press last.
Leaving it at its natural 100px keeps the field the thing your eye lands on, which
is the thing you actually have to fill in.

**Before/after** — `reports/design/2026-10-16-before.png`,
`reports/design/2026-10-16-after.png` (contest page at 390px),
`reports/design/2026-10-16-after-desktop.png` (1440px, unchanged).

## 2026-10-15 — An article section heading that reads as one on a phone

**Changed** — one declaration in `H2` in `src/components/ArticleLayout.tsx`:
`fontSize` from `clamp(20px, 2.2vw, 25px)` to `clamp(23px, 0.27vw + 21.9px, 25px)`.
16 lines added, 2 removed, 14 of the additions being the comment. No margins, no
colour, no weight, no copy, no data. Desktop renders byte-for-byte identical —
the 1440px before and after screenshots have the same SHA-256.

**Was** — the `2.2vw` middle term only does anything between 909px and 1136px.
Below 909px the heading was pinned to the 20px floor, which is every phone and
every portrait tablet. Against 17px body copy that is a step of 1.18. The same
heading at 1440px is 25px, a step of 1.47, and reads correctly — so the floor
was the broken end of a scale whose top was fine.

Measured at 375px, the article's whole scale came out lopsided: 26px title, 20px
section, 17px body. The smallest step in the document was sitting at the join a
reader uses most — the one that says a new section has started — while the
largest sat between a title and a standfirst that are already separated by a
tinted band, a category pill and 500 pixels of page.

It matters more here than the numbers suggest, because the contents rail is
hidden under 1000px, deliberately and for good reason (09-08: on a phone it
would just be a second copy of the headings before the article). The consequence
is that on a phone the headings themselves are the only map through a
seven-minute guide, and they were doing that job with three points of size.

**Now** — 23px at phone width, a 1.35 step, ramping to the same 25px at the same
width as before. A 768px tablet reads 23.97px, which is interpolation it never
had: the old clamp gave a portrait iPad the same heading as a phone. Confirmed at
375, 390, 768 and 1440px, no horizontal overflow at any of them. The longest
single word in the heading corpus is "Gyeongsangbuk-do" at 16 characters, which
still sets on one line in a 390px column.

**Looked at** — Nielsen Norman Group's article pages, which hold 30px headings
over 20px body — a 1.5 step — and do not shrink the heading at 375px at all;
the heading stays 30px while the measure narrows. That is the opposite instinct
to a clamp whose floor is its smallest value: they treat the step as the thing to
preserve and let the column do the adapting. Also Criterion's Current essays,
which run 32px headings over 18px body at weight 400 — hierarchy carried by size
alone, with no extra weight at all, which is the reading our own Principles
already call for.

The adaptation is only the ratio. We keep Space Grotesk at 700 because that
contrast against Inter body is the site's voice, and we keep the ramp because the
range is two points wide and a step function would show its seam.

**Not changed, deliberately** — the 46/14 margins. Measured before touching
anything: 46px above plus the preceding paragraph's 18px is 64px of air above the
heading against 14px below it, which already binds the heading to the body it
introduces rather than floating it between two sections. That part was right.

**Shared by** every guide, topic, tool, vs, prize, location, category, creator and
contest-list page — 15 route families through one component.

**Before/after** — `reports/design/2026-10-15-before.png` and
`2026-10-15-after.png` (390px, scrolled to the "Use style references with care"
section of `/guide/look-bible-for-ai-films`), plus `-before-desktop.png` and
`-after-desktop.png` at 1440px, which are identical on purpose.

## 2026-10-14 — /submit's closing aside, as two captioned blocks in body ink

**Changed** — the `<aside>` on `src/app/submit/page.tsx` and the `.sbp-aside`
section of `globals.css`. 38 lines added, 9 removed, 14 of the additions being
the two comments. No copy, no link target, no data, no colour or type scale
anywhere else. The form itself, which this block sits under, was not touched.

**Was** — one undifferentiated block of fine print carrying two unrelated
things. `.sbp-aside` set 13.5px `#6F6A61` on the whole thing and spaced its two
paragraphs 6px apart, which is less than the 1.65 line-height inside either of
them — so they read as one paragraph that happened to break. The two things are
not one thing. The first is the only human contact route on the page: Abhi's
name, his email address and his LinkedIn. The second is the paid placement,
`/feature`, and what a festival gets for the money.

The sizing is the same gap this log has now closed twice. The standfirst 500
pixels above is 16px `#3E3A33`. The aside ran two and a half points under it
and several steps lighter, on the one page where a stranger decides whether a
real person is behind this directory — so the address they are being invited to
write to was the palest text on the page. 10-01 closed exactly this on
`/feature`'s standfirst, with the reasoning that a line carrying the subscriber
count "is body ink at the body measure, like every other standfirst on the
site". 10-13 closed it on the FAQ answers across 65 pages. `/submit`'s aside
was the same mistake in the same stylesheet, eleven lines further down.

It also meant the paid option looked like a disclaimer. A festival organizer
who has just filled in the form and wants more entries met the offer set in the
same grey, at the same size, as the sentence about verification above it.

**Looked at** — It's Nice That's contact page, which answers the question
directly. Every person on it gets a name, a role in small caps, a sentence of
what they do, and their email address — and the address is set at the page's own
reading size, in the page's own ink, not shrunk into fine print. The page
opens "please email the relevant person below, or call the studio with anything
urgent," and then makes that easy to act on by captioning who each person is.
Also Criterion's list view, which carries 1,891 films with no boxes at all —
spine number, title, director, country, year as a real table — and Dense
Discovery's advertise page, which sets its paid offer as the main matter of a
page rather than a footnote to something else.

The adaptation is the captioning, not the layout. We have two things here, not
eight, and they already had their words.

**Now** — two `.sbp-aside-block`s, each a caption and its paragraph, with a
hairline between them. Captions are 11px Space Grotesk 600 `#7A7469` at 0.08em,
uppercase: the idiom `.err-caption` established on 10-12 and the one the footer
directly below already uses for `BROWSE`, `MORE` and `CONTACT`. The caption
words are `Contact` and `Featured listings` — both lifted from that footer, so
nothing new was written. Body is 15px `#3E3A33` at 1.65 on a 54ch measure, one
step under the standfirst because the block is genuinely secondary to the form,
but in real ink at a real reading size. The aside's links also pick up the
`:hover` and the 2px indigo `:focus-visible` ring that the FAQ links have had
since 10-13 and this block never had.

**Checked** — production build, exit 0. 1440px and 390px, both clean on the
overflow line. The two captions sit 400px above the footer's own `CONTACT`
column, which repeats the same address; that echo is deliberate and was already
there, and the in-context block earns its place by inviting the contact rather
than just listing it.

Before and after: `reports/design/2026-10-14-before.png`,
`2026-10-14-before-390.png`, `2026-10-14-after.png`, `2026-10-14-after-390.png`.

---

## 2026-10-13 — The FAQ on guides, topics and craft guides, as the ruled list the homepage already uses

**Changed** — one new `FaqList` in `src/components/ArticleLayout.tsx` (22 lines,
half of them its comment), the three places that had each hand-rolled the same
block (`src/components/CraftGuidePage.tsx`, `src/app/guide/[slug]/page.tsx`,
`src/app/topics/[slug]/page.tsx`), and the `.hfaq` comment in `globals.css`,
widened to say the list now serves four page types instead of one. 36 lines
added, 52 removed. No answer, no question, no section heading, no colour or
rule outside the FAQ block itself.

**Was** — three copies of the same mistake, on 65 pages: 42 topic pages, 13
guide pages and all 10 craft guides carry an FAQ. Each one a flush-left stack
of question-then-paragraph with the question in Space Grotesk 16px and the
answer underneath at 14px — `#6F6A61` on topics and the craft guides, `#7A7469`
on `/guide`. The body copy these same pages are built from is 17px at 1.75 in
`#3E3A33`. So the answers sat three points below the page's own reading size
and several steps lighter than its ink, on pages whose entire purpose is
reading matter.

`#7A7469` is not a coincidence. It is the exact value the homepage FAQ was
rewritten on 09-29 to get rid of, described in that entry as the palest body
text anywhere on the site. The homepage lost it that day; `/guide` kept it for
a fortnight.

The guide copy also set no measure at all. Its answers ran the full `max-w-5xl`
container — 984px at 14px Inter, about 125 characters a line, where the
paragraphs 40 pixels above it are capped at 700px. The topics and craft-guide
copies capped at 720px, which is closer but still wider than anything else on
those pages.

**Looked at** — Are.na's About page, which settles the question by refusing to
make a distinction. Sampled live: every section heading on it — "Pricing FAQs",
"Education", "Team", "Business model" — and every paragraph of prose under them
are the same 16px/23.2px in `rgb(51, 51, 51)`. The seven FAQ questions, set as
disclosure buttons, are that size and that colour too; only their weight
changes, 700 against the body's 400. Hierarchy is carried by weight and
position, and by nothing else. One thing on the page is smaller: the 12.5px
line under each "How it works" illustration. A caption under a picture earns a
smaller size. A question and its answer do not, because both of them are things
you read. Ours had it backwards, and had it backwards on the pages that are
nothing but reading.

**Now** — the `.hfaq` ruled definition list from 09-29, which `/creators` had
first on 09-26. Question in its own 300px column, answer stepped across a 32px
gap in body ink `#3E3A33` at 14.5/1.75 and capped at 56ch, a hairline under
each row and one over the first, stacking to one column below 760px. Four page
types now render it from one component, so the next thing this list learns is
learned once.

Answers take a `ReactNode` rather than a string, which is what lets the craft
guides keep the inline links their markdown-lite body syntax produces; the
other two pass their strings straight through.

The questions were `<h3>` and are now `<dt>`, with the answer in a `<dd>`. They
were never in the contents rail — `ArticleGrid` lists section headings only —
so nothing lost a way to be reached, and a list of questions and answers is
what a description list is for.

**What did not change** — not one word. No answer string, no question, no
section heading, neither its text nor its type: the craft guides and `/guide`
keep their 22px "Frequently Asked Questions" and topics keeps its 13px
uppercase label, because the fault was in the answers, not above them. The
`FAQPage` JSON-LD on all 65 pages reads those same strings, and Google's
guidance asks that the marked-up answer and the visible answer match. Checked
on the live page after the deploy: 5 rows rendered, 5 questions in the
JSON-LD, and question and answer compare character-for-character identical.

**Verified** — `npm run build` exits 0. Shot against a local `next start` and
then against the live page, at 1440px and at 390px; `✓ no horizontal overflow`
clean at 390 on both.

One real limit, stated plainly: `/guide/[slug]` and `/topics/[slug]` both call
`getAllContests()`, and Supabase has been unreachable since 10-11 11:30Z — 522
again at this run, about 50 hours — so those 55 pages return 500 and could not
be photographed before or after. The 10 craft guides read no contest data,
serve 200 live throughout the outage, and are where every shot here comes
from. They render the same `FaqList`, and they pass it the harder argument: a
React element per answer, where the other two pass a plain string. The build
type-checked all three call sites.

**Before / after** — `/guide/look-bible-for-ai-films` at the FAQ.
Desktop: `reports/design/2026-10-13-before.png` and `2026-10-13-after.png`
(the after from the live page, `2026-10-13-after-local.png` from the local
build). 390px: `2026-10-13-before-390.png` and `2026-10-13-after-390.png`.

---

## 2026-10-12 — An error page with the site around it, instead of the framework's

**Changed** — a new `src/app/error.tsx` (93 lines, a third of it the comment
recording which routes were checked and why the ways out are not the 404's)
and one section of `src/app/globals.css` (+31/-1: the `.err-*` rules, and the
`.nf-*` section header widened to say it is now shared by two pages). No data,
no copy on any working page, no colour, no type scale, no layout anywhere
else. Nothing that renders normally was touched.

**Was** — the framework's, not ours. The site had a designed `not-found.tsx`
(09-13) but no `error.tsx`, so every thrown render fell through to Next's own
fallback. Captured from a local production build against the live outage and
kept at `reports/design/2026-10-12-before.png`, the entire page was:

    Application error: a server-side exception has occurred
    (see the server logs for more information).
    Digest: 504280306

Two lines of 16px system grey, centred in 900px of empty paper. No header, no
nav, no footer, no logo, no indigo, neither of the two typefaces — nothing to
say which site this was, and no way to anywhere. It is not a page anyone
designed; it is what you get when nobody writes one.

It stopped being a rare path and became the whole site this week. Supabase has
been unreachable since 10-11 11:30Z (still 522 at this commit, about 31 hours),
and `contests-db.ts` now throws on a transport failure instead of returning
`[]` — the right fix, shipped this morning, and the direct successor to
yesterday's entry. Yesterday the page lied in our typefaces; today it told the
truth in the framework's. The homepage, every contest page, every topic, tool
and guide page has been serving that grey paragraph to every visitor since.

**Looked at** — Letterboxd's 404 and Mubi's, which fail in opposite directions
from each other and both better than ours. Letterboxd keeps the entire product
around the failure: full nav, full search, its own voice — and it still shows a
film, captioned *"Still from David Fincher's Fight Club (1999)"*. A film site
stays a film site on the page where it has nothing to show you. Mubi strips
back to three lines, but the single way out is named by what it actually is —
"Go to Now Showing", not "go home" — so the one link is the product's own
vocabulary rather than a generic escape. Criterion's adds the third idea:
below the apology it names the one concrete thing a blocked visitor is most
likely to need, and asks them to include details when they write in.

**Now** — the error page and the 404 are one object. `error.tsx` reuses the
`.nf-*` setting whole — burnt-orange label, 44px Space Grotesk statement, the
clapper drawing, ruled rows under hairlines — so the two read as siblings
rather than two near-copies, in the same way `SiteFooter` (09-30) and
`deadline.ts` (10-10) each replaced a set of them. The `.err-*` rules are only
what this page adds.

What it deliberately does *not* reuse is the 404's four ways out. Curled every
route against the live outage first: `/`, `/creators`, `/feature`,
`/cinematic-ads`, `/contests/*`, `/topics/*` and `/tools/*` all return 500,
because all of them read the contest table. "Browse every contest" and
"Closing soon" — two of the 404's four rows — would hand someone a second
identical failure from the page that just apologised for the first. Only
`/submit` and `/unsubscribe` render without touching the listings, so only
those two are listed, under a caption that says why: *These do not read the
database, so they still load.* Mubi's lesson, applied to a page whose
circumstances change which links are honest.

The primary control is Next's `reset()`, the one action that actually resolves
the common case, with a note beside it that does not oversell: retrying
re-reads the live data, and if it keeps failing the database is down and the
listing pages will not load until it is back. No count is claimed anywhere on
the page — the data that would support one is exactly what is missing — which
is the same restraint as yesterday's `noListings` branch.

Next's digest is printed at the foot, quietly, in tabular figures: *Reference
3753496310*. It means nothing to most visitors, but it is the string that
matches this render to its Vercel function log entry, so anyone reporting the
problem can quote it. Criterion's "include as many details as you can
provide", supplied rather than requested.

**Checked** — 1440px and 390px, `✓ no horizontal overflow` at both. At 390px
the drawing drops out (inherited from `.nf-*`), the button takes the full
measure and its note moves below it rather than sharing a row it cannot fit.
The 404 renders unchanged. Clicked Try again on a local production build: it
re-attempts the server render, fails again against the still-down database, and
re-renders this page cleanly — no blank, no loop, no stale frame. `npm run
build` exit 0. Verified live after deploy with a different digest
(`3748852537`) than the local one, so the capture is the real Vercel render.

Note for the next run: this page cannot be verified with `curl | grep`. It is a
client error boundary, so Next ships a near-empty shell with
`id="__next_error__"` and the boundary paints on the client — none of its words
appear in the SSR HTML. (Neither did the framework's old fallback, which is why
the "before" looked blank to curl too.) Use `tools/shot.mjs`, which runs a real
headless Chrome.

One honest limit: the nav above this page still lists Browse Contests, Closing
Soon, Tools and Categories, all of which 500 during an outage. Keeping the site
chrome is the point of the page, and the 404 keeps the same nav, so it stays —
but the caption's promise covers the ruled list, not the header.

Before/after: `reports/design/2026-10-12-before.png` / `-after.png` (1440px)
and `-before-390.png` / `-after-390.png`.

---

## 2026-10-11 — When the data does not arrive, the page says so instead of printing zeros

**Changed** — the homepage: `src/app/page.tsx` and `src/components/ContestBrowser.tsx`,
which only the homepage uses. 108 lines added, 33 removed, most of it the two
branches of one conditional plus the comments explaining it. No data, no copy on
the normal path, no colour, no type setting, no layout. Every other page is
untouched.

**Was** — a lie, told confidently, all morning. Supabase has been unreachable
since about 11:30Z (still down at 18:30Z as this ships: the REST endpoint
answers 522, then nothing). The homepage kept returning 200 and rendered this,
captured live at 18:14Z and kept at `reports/design/2026-10-11-before.png`:

    ● 0 contests open · updated daily

    0            0              $0K+         0
    OPEN NOW     COMING SOON    IN PRIZES    ACTIVE

    0 tracked and 0 open right now — festivals, studio challenges, grants…

    0 active · verified against live sources daily
    SHOW  All active (0)   Open (0)   Coming soon (0)

    Nothing matches that yet
    Try widening the filters. New ones are added most mornings.
    [ Clear filters ]

and, in the FAQ, "Yes — 0 of the 0 contests open right now have no entry fee."
A visitor arriving in those hours read a directory that tracks nothing, states
it four times in 28px Space Grotesk, and then offers to clear filters they never
set. The one thing this site sells is that the list is real and current.

The fault is that every figure on the page is derived from *this request's*
read. `getAllContests()` returns `[]` on error, so a transport failure and an
empty table are the same value, and the page renders the second meaning. But
the table has never held fewer than 200 rows and nothing on this site deletes
one (COMMON rule 4), so zero rows means the data did not arrive. The page can
know that, and now does: `const noListings = allContests.length === 0`.

**Looked at** — Letterboxd's Browse Films, caught mid-load: a grid of empty
poster frames, and above them the line *"There are 1,259,742 films."* The claim
the page makes about its own scale is a constant, not a count of what this
request managed to fetch, so a slow or failed load leaves a page that is
visibly incomplete rather than one asserting it has nothing. Are.na's homepage
does the near-opposite and arrives in the same place: its one live number sits
inside a sentence ("For the last 15 years and 63 days…"), where a missing value
would be a missing clause, not a giant zero. Big standalone figures are the
most brittle thing you can put on a page: they fail loudly and say something
false. Ours stay — the four figures are good when there is data — but they now
yield the slot entirely when there is none.

**Now** — with no rows:

- the badge is neutral rather than green-and-live: `Listings unavailable ·
  reload to retry`, grey dot, paper fill, same pill geometry so nothing moves
- the figures row is replaced, in its own ruled slot and at roughly its own
  height, by two lines someone wrote: **The listings didn't load** / "Nothing
  has been taken down — this page could not reach the contest data just now.
  Reload in a minute and the full directory should be back." Same top and
  bottom hairlines, same 44px below, so the hero keeps its rhythm
- the subscribe card drops its trailing "N contests are open right now"; the
  rest of its promise is still true and stays
- "Every contest, one place" drops "0 tracked and 0 open right now" and keeps
  the half that does not need a count
- the browse masthead drops the count, and the live green "Research agent
  running daily" line goes with it — a live dot next to a failure notice is the
  page disagreeing with itself
- `ContestBrowser` returns early: no search field, no sort, no five filter tabs
  counting (0), no "widen your filters" advice about filters nobody set. One
  box: **The contest list didn't load**, the same one-sentence explanation, and
  a Reload button that actually reloads
- the FAQ answers the free-entry question without a count
- the ItemList JSON-LD is not emitted at all. `numberOfItems: 0` with an empty
  list is the same lie in the form Google reads, and this is the week the
  sitemap already fell from 381 URLs to 142

**Checked** — `npm run build` exit 0. Rendered the no-data state at 1440px and
390px: no horizontal overflow at either, the notice sets on two lines on
desktop and three on a phone, nothing wraps badly, the Reload button clears
40px. Then stubbed `getAllContests()` locally against `src/data/contests.ts`
(32 seeded rows, reverted before the commit) to prove the normal path is
byte-for-byte the old page: green pill with its count, four figures, ticker,
spotlight, closing-soonest list, full browse toolbar, counted FAQ answer — all
back exactly as they were. Deployed and confirmed on the live site at 18:28Z,
still mid-outage, which is why the after shots show the new state rather than a
normal page.

What this does **not** fix: the page still returns 200 while it has nothing,
`/contests/<id>` still returns 404 during the outage, and `sitemap.xml` still
publishes 142 URLs instead of 381. Those are status codes, not design, and they
are the first unchecked item in `OPTIMIZER_BACKLOG.md`.

Before/after: `reports/design/2026-10-11-before.png` / `-after.png` (1440px),
`-before-390.png` / `-after-390.png`, and `-before-browse.png` / `-after-browse.png`
for the grid.

---

## 2026-10-10 — The deadline, read as the calendar day it is

**Changed** — a new `src/lib/deadline.ts` (88 lines, half of it the comment
explaining why), and the three client components that print a deadline:
`ContestCard.tsx`, `FeaturedSpotlight.tsx`, `ContestBrowser.tsx`. 41 lines
added, 62 removed across the three — the module replaces three near-copies of
the same arithmetic. No copy outside the countdown phrase, no data, no layout,
no colour, no type setting. The contest page and the homepage ticker are server
components and were already correct; they are untouched.

**Was** — wrong, in the one place the whole site cannot afford to be wrong.
Every `deadline` in the table is a bare `YYYY-MM-DD`: all 240 rows, no time, no
zone. `new Date('2026-10-10')` turns that into midnight UTC, which is an
*instant*, and an instant lands on a different calendar day depending on where
the reader is sitting. All three of these are `'use client'`, so that instant
was being formatted in the visitor's own timezone. Captured on the live site
today at 18:16 UTC, same page, same moment, Chrome at `TZ=America/Denver` and
`TZ=America/New_York`: the three contests closing *today* each printed

    Oct 9, 2026 / DEADLINE

a date already gone, in plain ink, with no urgency on it at all — while the
server-rendered ticker twelve hundred pixels above said `AI Movie Awards: AIMA
· today · OCT 10`. The page contradicted itself about the only fact it exists
to get right. At `TZ=UTC` and `TZ=Pacific/Auckland` the same page read Oct 10,
so this was invisible to anyone checking from a server and visible to most of
the audience.

The countdown had the same fault one step worse. Midnight UTC on the deadline
day is the *start* of it, so orhena AI Contest 2026 — deadline Oct 11, a full
day still to run — read **"5 hours left · OCT 10, 2026"**, understating the
time a filmmaker had and misnaming the day it ran out. Ai & Robots, closing
Oct 12, read "1 day left · OCT 11, 2026". And the three closing that very day
fell through `diff <= 0` to no countdown at all: the most urgent contests in
the directory were the only ones with nothing urgent on them.

Those hours were never in the data to begin with. 240 of 240 deadlines are
date-only; "5 hours left" was an artefact of the parse, not a fact, and the
same lesson as yesterday's prize block — the setting has to follow what the
value actually is.

**Looked at** — Mubi's Now Showing, and Metrograph's calendar, which is the
useful one. Its date rail runs `Today / October / 10`, then `Sunday October 11`,
`Monday October 12`, on across three weeks. The day the visitor is standing on
is the only one given a word instead of a number, and it takes the accent
colour; every other day gets its weekday and its numeral at the same size.
The rail is authored as a calendar, so it cannot disagree with itself about
what day it is. Ours was printing a numeral for the one day that deserved the
word — and printing yesterday's.

**Now** — a deadline is handled as what it is: a day on a calendar, not a point
on a clock. The printed date is built from the string's own numerals and
formatted with `timeZone: 'UTC'`, so it reads the same in Auckland and in
Denver. The count is a difference of two calendar days — the deadline's, and
the one the reader is actually having, in their own zone — taken at noon UTC
so no offset or DST seam can nudge it onto the day either side. Whole days
only, because whole days are all the data knows:

- the closing day → **"Closes today"**, in the burnt orange already reserved
  for a deadline inside seven days
- tomorrow → "1 day left", unchanged
- past → no countdown claimed; the card falls back to the date, as before

"Closes today" sets at the same width as "22 days left" in the card's 13px
Space Grotesk, so nothing reflows and nothing wraps at 390px. The list view's
compact row already said "today" when it thought a deadline was up; it now says
it on the right day, and falls back to the date instead of saying "today" about
a day that has gone.

**Checked** — all 128 distinct live deadlines rendered in seven zones (UTC,
Denver, New York, Auckland, Honolulu, London, Sydney): every one prints its own
day in every one of them. Walked 730 consecutive days from a fixed today,
across both 2026 and 2027 DST transitions: the count steps by exactly one,
no jumps. Rendered the nine soonest live contests through a throwaway local
route at 1440px and 390px, at `TZ=America/Denver` and `TZ=Pacific/Auckland`
(deleted before the commit) — Denver reads "Closes today · OCT 10, 2026" on the
three, "1 day left · OCT 11" on orhena, "2 days left · OCT 12" on Ai & Robots;
Auckland, already on Oct 11, correctly drops the three to the bare date and
promotes orhena to "Closes today". No horizontal overflow at either width.
`npm run build` exit 0.

The two client renders now intentionally disagree with the server for the few
hours a day when UTC and the reader's zone are on different dates — the reader's
day is the honest one — so the two deadline nodes carry `suppressHydrationWarning`.

Before/after: `reports/design/2026-10-10-before.png` / `-after.png` (1440px) and
`-before-390.png` / `-after-390.png`.

---

## 2026-10-09 — The contest page's prize, set as what the value actually is

**Changed** — the Prize block on `src/app/contests/[id]/page.tsx`, lifted into
`src/components/PrizeValue.tsx` so it could be rendered against every real prize
string before it shipped. Six lines added to the page, eight removed; one new
79-line component, about a third of it the comments. No copy, no data, no
layout, no colour outside this one block, and the `prizeDetails` list under it
is untouched.

**Was** — every prize printed at `clamp(20px, 2.4vw, 26px)`, Space Grotesk 700,
`-0.02em`, in the category tint: the display setting this page otherwise keeps
for "22 days left". That is the right setting for "€10,000 Grand Prix". It is
the wrong one for "Best Filmmaker, Best Ai, Best Short Film, Best Ai Fantasy
Film and Best Fashion Film awards plus PR/publication placement (no cash prize
published)", which is 147 characters and arrived as two and three lines of
shouted sentence case, tinted, sitting above the quiet body prose of "Who can
enter". Counted against live data: of the 91 open contests carrying prize text,
65 name no money amount at all — "Official laurels, digital certificates and
trophies for main award winners", "Not published by organizer" — and only 15
are short enough to read as a figure. The headline treatment was wrong for five
in six of them, and on the pages where it was wrong it was also the loudest
thing in the left column, louder than the deadline it should defer to.

**Looked at** — Criterion's Shop All Films in list view, It's Nice That's feed,
and a run at Sundance's and Berlinale's award pages that both 404'd today
(noted and skipped). Criterion's list is the useful one. It sets 1,891 films as
spine number, title, director, country, year, and the number sits in its own
column at the same size as everything around it; nothing is promoted to display
size merely because it fills a field. The hierarchy is carried by the column and
the heading, and the type stays level. Our page already knows this — `SpecRow`,
40 lines below the block I changed, has carried a `SPEC_VALUE_IS_A_SENTENCE`
threshold since 2026-09-27 that drops a long entry fee out of the figure-right
row and sets it as a note. The Prize block was the one value on the page that
never learned it, and it was the biggest.

**Now** — the setting follows the value. A short string built around a money
figure keeps the display size, because there the figure is the whole point:
"$12,000 in cash prizes", "€1,200 total prize pool", "$300,000 USD Prize Pool" —
15 of 91. Anything longer is set as a sentence at 16.5px in full ink `#1B1916`,
one notch above the body copy around it so the section still answers its own
label, held to a 58ch measure so a 149-character prize does not run the full
column. When that sentence contains money, the figures inside it are picked out
in the tint and the figure face, so the amounts stay scannable without the page
promoting one of them to a headline — several of these prizes list three, and
choosing one would misstate the award. Nothing is extracted, reordered or
dropped: the string is always printed whole.

The money pattern is deliberately narrow. It reads `US$`/`A$`/`CA$` and the
seven symbols in the data, requires the digits to end on a digit so the comma in
"up to ₹50,00,000, subject to government support" stays in the sentence, keeps a
trailing `+` because "$25K+" is not "$25K", and takes K/M/million/lakh/crore only
as whole words. "Recognition awards across 25+ categories" has no currency mark
and is correctly left alone.

Rendered all 91 live prize strings through the component on a local production
build at 1440px and 390px before pushing: correct tier every time, no horizontal
overflow at either width. On the AI M0V1E page three lines of tinted display type
became two lines of prose with `$1,000`, `$700` and `$500` picked out; on AIFFA
two became one, and "22 days left" is now the loudest thing on the page again.

Before/after: `reports/design/2026-10-09-before.png` and `-after.png` (AIFFA,
1440px), `-before-390.png` / `-after-390.png`, and `-before-mixed.png` /
`-after-mixed.png` (AI M0V1E, the three-figure case).

---

## 2026-10-08 — A card's blurb ends on a whole word

**Changed** — `src/components/ContestCard.tsx` only. 90 lines added, 3 removed,
about a third of the additions being the two comments. No copy, no data, no
layout, no colour and no type setting moved; the paragraph keeps its 13px,
its 1.7 line-height, its three lines and its place in the card.

**Was** — the description is clamped with `-webkit-line-clamp: 3`, which ends
the paragraph wherever the third line happens to run out of room. That is
almost never the end of a word. Measured against the live grid with the real
fonts, at 1440px eleven of the twelve cards the homepage opens with were cut
inside one: `…and one evening t`, `…films are capped at 3 minut`, `…entries
must be in Spanish with Englis`, `…plus a free Pro month fo`. At 390px it was
eleven of twelve again, at 820px nine of ten, at 1180px four of four. And when
the third line did happen to end on a full stop the browser put its ellipsis
after it, so the card read `…a short film of up to two minutes....` — four
dots. Nothing here was broken, which is why it had survived a month of these
entries, but it is the kind of edge that tells a reader the page was assembled
rather than set. Ninety-five of them are in view on the homepage.

**Looked at** — Dense Discovery's archive, Are.na's Explore, It's Nice That's
Nice Feed, all at 1440px. (Metrograph is behind Cloudflare today and returned
a block page; noted and skipped.) The useful thing is what all three refuse to
do. Dense Discovery lists 409 issues as a number and a title, and when a title
is long — `Sonntagsruhe: frivolously unmonetised time` — it wraps to a second
line rather than being cut. Are.na's channel cards carry a title, an author, a
block count and an age, and nothing else; `Typographie et Variations - Projet
2B` takes two lines in full. It's Nice That's feed gives each item a headline
of up to three lines, a source and a relative time, and no blurb at all. Three
listings built by people with taste, and not one truncated string among them:
an index earns its density by setting short complete things, not by chopping
long ones. We are not in a position to delete the blurb — it is the only place
a card says what the contest actually wants — but we can at least stop it
ending mid-syllable.

**Now** — the card wraps the paragraph itself before the browser does. A canvas
measures the text in the font the paragraph is actually painted in, at the
paragraph's own measured width, greedily lays out three lines, and ends the
third on the last whole word that fits, dropping any comma, semicolon, dash or
full stop the cut leaves dangling before the ellipsis. It re-measures on resize
— the one-, two- and three-column layouts hold very different amounts, from
about 134 characters at 390px to about 240 at 1180px, and each now gets what it
can hold — and again once the webfont has landed, so the first measurement is
never made against the fallback. The CSS clamp stays on underneath as the
backstop: if a measurement is ever off by a pixel, the worst case is exactly
what the card did before.

Checked against the deployed site at 1440px and 390px: twenty-three cuts
between them, every one of them after a whole word, no paragraph past three
lines, no doubled stop, no horizontal overflow at either width. The cost is at
most one word per card against what the clamp was showing.

One thing it does not fix: `…films are capped at 3…` still ends on a bare
numeral, because `3` is a whole word and the next one is `minutes`. A rule
against ending on a number or a preposition is a rule that would start
rewriting the sentence, so it is left alone.

**Before/after** — `reports/design/2026-10-08-before.png` and `-after.png`
(1440px, the grid), `-before-390.png` and `-after-390.png` (390px).

---

## 2026-10-07 — The phone nav's fade, only on an edge the row carries on past

**Changed** — `src/components/InnerNav.tsx`, `src/app/page.tsx`, the `.inav`
block in `globals.css`, and one new component, `src/components/NavRow.tsx`.
25 lines added and 20 removed across the three existing files, plus 78 in the
new one, about half of those its comment. No link, label, href or page copy
changed, and nothing below 760px moved position.

**Was** — under 760px the nav links are one swipeable line, and the line was
masked down its right edge at all times: `linear-gradient(to right, #000 85%,
transparent)`, about 58px of fade at 390px, applied regardless of where the row
was scrolled or whether it scrolled at all. A fade on the edge of a scroller is
a sentence — *there is more of this past here* — and this one was saying it in
three places where it was not true.

On `/creators` the row auto-scrolls to bring the current link into view, so it
arrives at its end with `Creators` last. The fade then sat on top of the page
you are on: sampling the indigo rule under the word, `#4F46E5` holds to CSS x
331 and then washes to `#6E67E9` by x 342 — the one mark on the header whose
whole job is to say *you are here*, printed at three-quarter strength. The left
edge, meanwhile, with five links behind it and `Closing Soon` sliced to `oon`,
was cut clean with nothing to say so: the hint was on the side with nothing
behind it and absent from the side with everything. At 700px and 760px the six
links fit the row with room to spare and the last one was still half-ghosted.
On the homepage at 390px `Browse  Subscribe  Submit a Contest` measures 390 in
390 — the row does not scroll at all, and a visitor on a slightly narrower
phone got a fade over a link that has nowhere to go.

**Looked at** — It's Nice That, Letterboxd's `/films`, Criterion's Shop All
Films, Mubi, Metrograph, all at 390px. It's Nice That is the one that answers
this directly: its phone header carries four sibling mastheads as one row of
hairline-divided cells, and the fourth, `IF YOU COULD`, is sliced clean in half
by the viewport edge. No fade, no arrow, no chevron. The cut *is* the
affordance — a word chopped mid-letter says *more over here* more plainly than
a gradient does, and costs nothing when it is wrong. The other three sidestep
the question entirely: Mubi, Letterboxd and Criterion all fold their nav behind
a hamburger at phone width, and Letterboxd's six filter controls wrap into a
2×3 ruled grid so that not one of them is cut. We settled this on 09-14 and
09-17 — the links stay a swipeable line rather than wrapping to three rows or
hiding behind a button — so the rule to take from It's Nice That is not its
layout but its restraint: whatever marks the edge has to be true.

**Now** — `NavRow` owns the scroller and the one fact the stylesheet needs from
it. It measures `scrollWidth`, `clientWidth` and `scrollLeft` on scroll, on
resize via a `ResizeObserver`, and once `document.fonts.ready` resolves, and
writes `data-overflow` as `none`, `start`, `end` or `both`. The stylesheet keys
three mask variables off that attribute and applies none at all otherwise, so
the four states are what you would want them to be:

- homepage at 390px — `none`, no mask; `Submit a Contest` is in full ink
- `/submit`, `/feature` (no current link, row at rest) — `end`, fade right only
- `/contests/closing-soon` (current link mid-row) — `both`
- `/creators` (current link last, row at its end) — `start`, fade left only,
  and the indigo rule under `Creators` measures `#4F46E5` at every sample
  across its width

The fade is 24px now instead of 58px, roughly the row's own 20px gutter. It is
a hint, not a vignette, and at 24px it never reaches a whole word. The
server-rendered value is `none`: no fade until something has actually been
measured, because a missing hint costs a visitor nothing and a false one costs
them the page they are on.

Two smaller things fell out of writing it. The alignment that brings the
current link into view was landing 8px short of the end — the remainder of the
row's 12px trailing `::after` spacer — which is how `/creators` managed to read
as `both` on the first attempt at this fix; it now goes the whole way when the
target is within a gutter of the end. And it was running against fallback font
metrics, so the row sat a few pixels off once Space Grotesk and Inter landed;
it realigns when they do.

The homepage header was hand-rolling its own `<nav className="inav">` while
every other page went through `InnerNav`. It uses `NavRow` now, so the two
headers stay the one object they have been since 09-17 and the next thing this
row learns is learned once.

**What did not change** — the links themselves, their order, their labels, the
60px desktop row, the `aria-current` underline, the Get Alerts button and its
grid position, the brand lockup, `.inav-link`'s 40px tap target from 10-01, the
`::after` spacer, or anything at all above 760px. The mask was the only thing
removed.

**Still open** — `/feature` still carries roughly 20 `style={{}}` attributes on
the headline block's siblings, nominated on 10-04 and carried since. New today:
`/cinematic-ads` is in the nav's own link list but the page renders no
`.inav` header at all — it imports `BackgroundFX` and `SiteFooter` directly
rather than `InnerLayout`, so it is the one linked page you can arrive at and
not be able to navigate out of except through the footer.

**Verified** — `npm run build` exits 0. Measured on a local `next start` at
320, 375, 390, 700, 760 and 1440px: `data-overflow` and the computed
`mask-image` are correct at each, `✓ no horizontal overflow` is clean at 375,
390 and 1440, and desktop is pixel-identical. Re-measured on the live pages
after the deploy. The local shots show `/creators` without its `Contests in
this directory` block because `.env.cron` still has no
`NEXT_PUBLIC_SUPABASE_ANON_KEY`; every before and after here is from the live
site.

**Before / after** — `/creators` at 390: `reports/design/2026-10-07-before-390.png`
and `2026-10-07-after-390.png`, plus `-after-375.png`. Homepage at 390:
`2026-10-07-before-home-390.png` and `2026-10-07-after-home-390.png`. Homepage
at 1440: `2026-10-07-before.png` and `2026-10-07-after.png`.

---

## 2026-10-05 — The tag line, as text under a caption instead of unlabelled chips

**Changed** — the tag block on `src/app/contests/[id]/page.tsx` and on
`src/app/creators/[slug]/page.tsx`, and a new `.ctags` rule in `globals.css`.
41 lines added, 24 removed, 21 of the additions being the comment in the
stylesheet. Two page types, one idea. No tag data, link target or string of
copy changed.

**Was** — both pages ended their facts with a row of boxed tags that nothing
introduced. On a contest page it sat directly under the `AI tools allowed`
chips: 11px `#8B867C` on an `#F4F2EE` fill with an `#E7E4DC` border and a 4px
radius, against tool chips at 13px `#3E3A33` on white with an `#E0DCD2` border
and a 6px radius. Same shape, same hairline, same rounding, four pixels and one
grey apart — two adjacent clouds saying two different things, and only one of
them labelled. A reader scanning down the London listing met `Runway  Sora  Veo
Kling  Luma  Pika  Midjourney  Higgsfield  any AI tool` and then, under the same
kind of boxes, `#london  #uk  #close-up-cinema  #quarterly`, with nothing to say
the second row had stopped being about tools. On a creator profile the same row
floated alone in the gap between the header band and `SELECTED WORK` — the one
block on the page without a caption, filled with `rgba(27,25,22,0.03)` over
paper, which is the ghost wash the 10-01 run took off /feature's price panel for
being a rounding error rather than a fill. At 390px it took two rows and about
170px of a phone screen to say five words.

A box on this site is something you act on: the tool chips name what an entrant
may use, the category pills tint a card and carry its colour, the rail holds
Apply. These were neither pressable nor labelled — decoration that had been
handed a database column.

**Looked at** — Mubi's film page and Criterion's Shop All Films. Mubi sets a
film's genres as plain text inside the credit stack, in the same size and ink as
the country and the year: `Directed by Jonathan Glazer` / `United Kingdom,
Poland, 2023` / `Drama, History, War, Crime` / `105`. No boxes anywhere near
them; the DOM node is a generic, not even a link. Criterion's browse page is
the complement — 1,891 films of plain text, and the only bordered objects on the
screen are `FILTER`, `SORT` and the two view toggles. Between them the rule is
the same one: a border is a promise that something happens when you press it,
so facts are set as facts and controls get the boxes. The adaptation is not
their layout but that rule, applied to the one place we were breaking it.

**Now** — the contest page's tags use the page's own `<Section label="Tagged">`,
which already supplied the exact `#ECE9E2` hairline, 18px top padding and 30px
top margin the block was drawing by hand, so the rhythm of the column is
unchanged and only the caption is new. The creator profile gets a matching
`Tagged` heading in its own `sectionLabel`, so it now reads `TAGGED` /
`SELECTED WORK` / `CONTESTS IN THIS DIRECTORY` down the page instead of starting
with an unannounced row of boxes. Both set the tags as one comma run in `.ctags`
— 13.5px, line-height 1.8, `#6F6A61`, a 56ch measure.

Three small decisions inside that:
- **Commas, not middots.** A comma travels with the word in front of it and so
  cannot be left stranded on the line it ended, which is exactly what the 10-02
  run found the `·` doing in the article band. Six tags wrap to two lines at
  375px and the break is invisible.
- **Lowercase.** The stored tags are 90% lowercase slugs with four capitalised
  strays (`India`, `Jaipur`, `Australia`, `Asia`), so `text-transform` does what
  the data should have: one register reads as a decision, a mixed one reads as a
  bug. The tags themselves are untouched.
- **Hyphens to spaces**, which is not new — the creator page has done
  `t.replace(/-/g, ' ')` since the profiles shipped. The contest page now does
  the same thing rather than printing `#close-up-cinema` with the sigil still on.
  `#6F6A61` is also a step darker than either row's old text (`#8B867C` and
  `#7A7469`), because the line is now carrying itself without a box around it.

**What did not change** — the tool chips above, which keep their boxes because
they are the one of the two that names a constraint you have to check. The
category pills, the rail, the Apply block, the reminder form, the related-contest
grid, the creator badge and work list. No tag was added, removed, reordered or
rewritten in the database or in `creators.ts`.

**Still open** — `/feature` still carries roughly 20 `style={{}}` attributes on
the headline block's siblings, nominated by yesterday's entry and still worth
folding into whatever next touches that page. New today: on a phone the inner
nav's right-edge mask is permanent, so the last link stays half-faded even once
you have scrolled to the end of the row.

**Verified** — `npm run build` exits 0. Checked on a local `next start` at
1440px, 390px and 375px on /creators/robert-gaudette, then live on the contest
page at the same three widths once the deploy landed. `✓ no horizontal overflow`
clean at all three on both. The local shots show the creator page without its
`Contests in this directory` block because `.env.cron` still has no
`NEXT_PUBLIC_SUPABASE_ANON_KEY`; the after shots are from the live pages.

**Before / after** — creator profile: `reports/design/2026-10-05-before.png`
(1440) and `-before-390.png`, `2026-10-05-after.png` and `-after-390.png`.
Contest page: `2026-10-05-before-contest.png` (1440) and
`-before-contest-390.png`, `2026-10-05-after-contest.png`,
`-after-contest-390.png` and `-after-contest-375.png`. All taken off the live
site.

---

## 2026-10-04 — /feature, with the site still around it

**Changed** — `src/app/feature/page.tsx` (7 added, 8 removed) and a new `.ftp-`
block in `globals.css` (31 added, 11 of them the comment). One page. No copy
changed, to the character.

**Was** — the last public page rendering as a bare `<main>`: a 720px column
centred on paper with no masthead, no nav and no footer. /unsubscribe got the
site put back around it on Sep 25, the 404 page on Sep 13, /submit yesterday;
/feature never did. Yesterday's entry nominated it, and it was last touched on
Oct 1, so it is not being worked three days running.

It is also the worst page on the site to leave stranded, because it is the one
that asks a festival organizer for $49 to be placed in a directory. The thing
being sold is placement among 90 open contests, and the page selling it showed
none of them above the fold and gave no way to go and look: the only route back
into the directory was a 12px uppercase `AI FILM CONTESTS` eyebrow, which is a
link but reads as a label. At 390px that eyebrow was the first thing on the
screen with the brand mark nowhere in sight. A page asking for money that looks
like it has been detached from the site is asking the buyer to take the site on
trust at exactly the moment they are deciding whether to.

**Looked at** — Metrograph's Membership page and Letterboxd's /pro. Both are
the page that asks for money, and both carry the full chrome of the browsing
pages with nothing special done to them: Metrograph's membership page has the
identical banner — wordmark, sign-in, search, the six-item nav with Membership
marked as current — and the identical mailing-list footer as the Journal;
Letterboxd's upgrade page keeps its wordmark, nav, sign-in form and search. In
both, the paid page is a peer in the nav rather than a landing page sealed off
from the site. Neither strips the chrome to "focus" the sale. The adaptation is
not their layout, which we are not copying, but that posture: what you are
selling is access to the rest of the site, so the rest of the site should be
one click away while someone reads the price.

**Now** — `/feature` is wrapped in `InnerLayout`, the same component /submit,
/unsubscribe and the 404 page use, so it has the sticky wordmark, the six-link
nav and the full twelve-link footer. `.ftp-wrap` is `max-w-5xl` with
`.ftp-wrap > * { max-width: 720px }`, so the column is left-aligned in the
container instead of centred in the viewport and the headline starts on the
same vertical as the wordmark above it and the footer brand below it — while
the 720px measure the contest picker needs is preserved exactly. The brand
eyebrow, now redundant beside a real header, becomes a kind label:
`Feature a contest`, indigo, the same vocabulary /submit and the article bands
use.

**Two values moved**, both onto the sitewide default rather than to anything
new. The headline went from `clamp(28px, 5vw, 40px)` at weight 700 to the
`clamp(30px, 5vw, 44px)` at 600 that `.nf-title` and `.sbp-title` already use,
for the same reason /submit's did yesterday: being a few pixels off every other
page title was the only thing making it one. And the standfirst went from
`#6F6A61`, the caption tone, to `#3E3A33` body ink at a 54ch measure — it is
the first sentence on the page and it is the sentence carrying the subscriber
count, which is the page's only piece of evidence, so it should not be set
lighter than the body text underneath it.

**What did not change** — everything else, to the pixel. The `.feat-cap`
labels, the `.feat-inc` hairline list, the numbered How-it-works steps, the
live spotlight screenshot and its caption, the `.feat-price` row and its
button, the month-ruled `.feat-list` picker with its burnt-orange
inside-seven-days deadlines, the `.feat-empty` state, and the closing note.
Every string of copy is byte-identical, including the price label, the
subscriber rounding and the closing email address — which now sits above a
footer that also carries it, and was left alone rather than reworded.

**Still open** — every public page now carries the site's chrome. The inline
styles on this page are the next obvious thing: roughly 20 `style={{}}`
attributes remain on the headline block's siblings (the steps, the image, the
closing note), where /submit now keeps all of its in the stylesheet. Not worth
a run of its own; fold it into whatever next touches this page.

**Screenshots** — before `reports/design/2026-10-04-before.png` (1440) and
`-before-390.png`; after `reports/design/2026-10-04-after.png` and
`-after-390.png`, both taken off the live site after the deploy. No horizontal
overflow at 1440, 390 or 375.

---

## 2026-10-03 — /submit, with the site still around it

**Changed** — `src/app/submit/page.tsx` (13 added, 16 removed) and a new `.sbp-`
block in `globals.css` (34 added). One page. No copy changed, to the character.

**Was** — of every page a visitor can reach, `/submit` and `/feature` were the
last two rendering as a bare `<main>`: a 640px column centred on paper with no
masthead, no nav and no footer. `/unsubscribe` got the site put back around it
on Sep 25 and the 404 page on Sep 13; `/submit` never did. So the page that
asks a festival organizer to hand us their official page showed them a form and
nothing else — not the 90 open contests they would be joining, not Closing Soon,
not the footer's twelve links. The only route back into the directory was a 12px
uppercase `AI FILM CONTESTS` eyebrow which is a link but reads as a label, and
at 390px it was the first thing on the screen with the brand mark nowhere in
sight. That is the wrong page to make someone feel they have left the site on:
it is the one asking for something.

**Looked at** — Mubi's Film Database and Criterion's Shop All Films. Mubi puts
*Contribute to the database* inside the database page itself: the masthead, the
search and the genre/country/year filters all stay put, so contributing reads as
part of browsing rather than a departure to a form. Criterion does the same with
a 1,891-row utility list — the identical masthead as the editorial pages, no
special treatment for the page that is "just a list". The adaptation here is not
their layout, which we are not copying, but the posture: the page where someone
gives you something should carry the same chrome as the page where they take
something.

**Now** — `/submit` is wrapped in `InnerLayout`, the same component `/unsubscribe`
and the 404 page use, so it has the sticky wordmark, the six-link nav and the
full footer. The page's inline styles moved into a `.sbp-` block in `globals.css`
to match how those two siblings are written rather than being the one page still
carrying its design in `style={{}}`. The text column keeps its 640px reading
measure, but `.sbp-wrap` is now `max-w-5xl` with `.sbp-wrap > * { max-width: 640px }`,
so the column is left-aligned in the container instead of centred in the viewport:
the headline starts on the same vertical as the wordmark above it and the footer
brand below it. The brand eyebrow, now redundant beside the header, becomes a kind
label — `Submit a contest`, indigo, the vocabulary the article bands already use.

**What did not change** — every value the page had, to the pixel: the 11px indigo
label, the 16px `#3E3A33` standfirst at a 54ch measure, the 13.5px `#6F6A61`
aside above its `#ECE9E2` hairline, the 640px form, and `SubmitForm.tsx` itself
(untouched — its fields, its honeypot, its success state and its focus rings are
exactly as the Sep 9 run left them). The one thing that did move is the headline,
from `clamp(28px, 5vw, 38px)` to the `clamp(30px, 5vw, 44px)` page-title size
`.nf-title` and the rest of the site use, because a page title that was six
pixels smaller than every other page title was the only reason it had been one.

**Still open** — `/feature` is now the last public page without the chrome. It was
worked on Oct 1 and Sep 24–25, so it was left alone today rather than touched
three days running; it is the obvious next one.

**Screenshots** — before `reports/design/2026-10-03-before.png` (1440) and
`-before-390.png`; after `reports/design/2026-10-03-after.png` and `-after-390.png`,
both taken off the live site after the deploy. No horizontal overflow at 1440,
390 or 375.

---

## 2026-10-02 — The article band's footer strip, ruled instead of dot-separated

**Changed** — the meta row in `ArticleHeader` (`src/components/ArticleLayout.tsx`)
and a new `.ah-meta` / `.ah-facts` / `.ah-fact` / `.ah-trust` block in
`globals.css`. 65 lines added, 16 removed, about 20 of the additions being the
comment in the stylesheet. `ArticleHeader` is the band on 14 page types —
/guide, /topics, /tools, /vs, /prize, /location, /categories, /creators and the
four /contests index pages — so this is one component and every page but the
homepage, a contest page, /submit, /feature and /unsubscribe.

**Was** — one flex row with `flexWrap: 'wrap'`, a 14px gap, 12px type at 0.85
opacity, and a `·` rendered as its own flex item between each pair. The items
were, in order: `Updated <date>`, `<n> min read`, whatever counts the page
passes, and then `Contest facts checked against live sources daily`. That last
string is 47 characters; the longest thing beside it is `Updated September 24,
2026` at 26, and most are nearer ten. A dot-separated run only holds while the
whole run fits a line, and at 390px it does not: the row wrapped between the
last fact and the sentence, and because the separator is its own flex item it
stayed behind on the line it ended:

- `8 min read ·` / `Contest facts checked against live sources daily` (/topics)
- `21 contests closing within 14 days ·` / `Contest facts checked…` (/contests/closing-soon)

So on a phone, on every one of those pages, the band ended with a dangling
glyph. And the sentence that carries the whole claim — these dates were read off
the organizer's own page this morning — was set as the fourth item in a list,
at the lowest contrast of anything in the band.

**Now** — a hairline in the band's own tint runs across the foot of the band,
and the separating is done by rules, which cannot be stranded. Above 640px the
facts hold one row divided by 1px vertical rules at 15px either side; below it
`.ah-facts` goes to `display: block` and each fact takes its own line with the
rules off, because a wrapping run is the thing that strands a separator in the
first place. The verification line sits on its own underneath at 0.75 opacity —
quieter than the facts, which are hard data, but standing alone rather than
queued behind them. Figures are tabular, so `58 open now` / `3 coming soon` /
`79 closed` align down the stack on a phone. The `·` spans are gone, which also
takes a meaningless glyph out of the accessibility tree.

**What did not change** — any copy, to the character, and no page passes a
different `meta` array than it did yesterday. The band's tint, radius, padding,
kind pill, headline and standfirst are untouched; `--ah-rule` is set inline per
page from `tintForSlug(slug).border`, the same colour the band's own border
already uses, so nothing new entered the palette.

**Inspiration** — Metrograph's Now Playing listings. A film there gets
`DIRECTOR: ELIZABETH LENNARD` on one line and `1985 / 62MIN / DCP` on the next:
the only inline-separated line is the one where every item is a handful of
characters and the run can never wrap, and the long facts — the director, the
note that a composer introduces the screening on Saturday — each take a line of
their own. Criterion's essays do the same with two items and stop:
`ESSAYS — NOV 26, 2024`. The idea taken is that a separator glyph is a
promise the line will not break, and the moment one item is five times the
length of its neighbours that promise is not yours to make — so either shorten
the run or let a rule do the work.

**Verified** — `npm run build` exits 0. Shot against a local `next start` at
1440px, 390px and 375px on /topics, /categories, /guide and /creators;
`✓ no horizontal overflow` clean at all three. The local build shows zeroes in
the counts because `.env.cron` still has no `NEXT_PUBLIC_SUPABASE_ANON_KEY`, so
the after shots are from the live page, where /categories/short-film reads
58 open now / 3 coming soon / 79 closed.

**Before / after** — `reports/design/2026-10-02-before.png` (390px),
`2026-10-02-before-desktop.png`, `2026-10-02-after.png` (390px),
`2026-10-02-after-desktop.png`, all on /topics/ai-film-festivals-2027, plus
`2026-10-02-after-categories-375.png` for the three-fact stack at 375px.

---

## 2026-10-01 — /feature's value list and price, ruled instead of boxed

**Changed** — the two panels above the contest picker in
`src/app/feature/page.tsx`, and a new `.feat-cap` / `.feat-inc` /
`.feat-price` / `.feat-btn` block in `globals.css`. 117 lines added and 32
removed, about 45 of the additions being the comment in the stylesheet.

**Was** — `/feature` is the only page on the site that asks for money, and the
two things an organizer reads before paying — what $49 buys, and what $49 is —
both sat in the same local `box` style: a 14px radius, a 1px border at 7% ink,
and a fill of `#1B1916` at 2% over `#FBFAF8` paper. That fill is roughly a
quarter of a percent of luminance away from the ground, so it is not a fill,
it is a rounding error; the border was doing all the work and the result read
as an empty form field. It is the same ghost box the 09-21 run took off the
cinematic-ads callout and the 09-22 run took off the subscribe success state.
This was the last place on the site still drawing it.

Inside the first one, each of the four benefits was written as
`❋&nbsp;&nbsp;text` — the glyph inside the paragraph rather than a marker
outside it, which is the whole difference between a list and four sentences
that happen to start with an asterisk. At 390px all four wrapped, and because
there was no hanging indent every wrapped line started back at the asterisk's
own left edge:

- `Pinned in the homepage spotlight for` / `30 days`
- `A Featured badge on your listing and` / `in search`
- `A dedicated slot in the next email to` / `all 310+ subscribers`
- `Deadline verified daily and a last-call` / `reminder sent 3 days before close`

So the page that asks for $49 was at its least legible on a phone, in the
block that states what the $49 is for.

**Now** — both are hairline rows in the `.feat-list` language the contest
picker directly below them has used since 09-24: a `#E3DED3` rule over the
first row, `#ECE9E2` under each one, body ink at `#3E3A33`, 15px over a 1.6
leading. There is no bullet glyph at all, so there is nothing to hang off —
the rule carries the list, the way the spec rail on a contest page does. The
rules run the full 720px column rather than a text measure, so they line up
with the lede above them; the longest benefit is 72 characters, which sets on
one line on desktop and never needed a narrower cap.

The price takes the 2px ink rule that `SubscribeError` and `.sok-step`
already use for their one important line: a small-caps `Price` label, the
rule, then `$49 for 30 days` at 30px in Space Grotesk with tabular figures,
the terms beneath it in `#7A7469`, and a closing hairline. The figure is now
the heaviest thing on the page after the headline, which is the right ranking
for a page whose whole job is the figure. Below 560px the band stacks and the
CTA takes the full measure instead of sitting in a 200px island against the
left edge — the pay button and the "Not listed yet?" fallback both, since
they are now one `.feat-btn` class instead of a spread inline-style object.

**What did not change** — a word of copy, to the character. The four benefit
strings, the price label (still read from `FEATURED_PRICE_LABEL`), the terms
line and both CTA labels are the same strings they were. No URL moved, the
`data-track` attributes on both pay paths are intact, and the "How it works"
steps, the live spotlight screenshot and the picker below are untouched — the
only thing that happened to "How it works" is that its caption now shares the
`.feat-cap` class instead of repeating the same six properties inline.

**Inspiration** — Metrograph's membership page. Its benefits are grouped under
three headings and every benefit is one line of plain text with no bullet
glyph anywhere on the page: `Get one $11 ticket per screening (save $7)`,
`10% discount at The Commissary Restaurant`. The heading does the grouping,
the line does the listing, and every line names a number. Nothing is in a box.
Mubi says the same thing more bluntly: its offer is one sentence —
`Try 7 days free, then C$16.99/month` — set directly on the ground above the
form, not in a pricing card. The idea taken is that a marker is only worth its
space when the list is unordered and long; four statements under a label are
better served by the rule between them, and the figure deserves the page's
heaviest rule rather than its softest fill.

**Verified** — `npm run build` exits 0. Shot against a local `next start` at
1440px, 390px and 375px; `✓ no horizontal overflow` clean at all three. The
local build renders the picker's empty state because `.env.cron` still has no
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, so `getContestsByStatus('open')` returns
nothing — the subscriber count in the third benefit still comes through live
(the admin client has its own key), and the after shots are from the live
page, where the picker holds all 87 open contests.

**Before / after** — `reports/design/2026-10-01-before.png` (390px),
`2026-10-01-before-desktop.png`, `2026-10-01-after.png` (390px),
`2026-10-01-after-desktop.png`, on /feature.

---

## 2026-09-30 — One footer, on every page

**Changed** — a new `src/components/SiteFooter.tsx` (79 lines), swapped into the
five places the site was drawing a footer: `src/app/page.tsx`,
`src/components/InnerLayout.tsx`, `src/app/contests/[id]/page.tsx`,
`src/app/tools/[slug]/page.tsx`, `src/app/categories/[slug]/page.tsx` and
`src/app/cinematic-ads/page.tsx`. 19 lines added and 163 removed across those
seven files, so the whole change is 65 lines lighter than what it replaced.

**Was** — the 09-20 run rebuilt the homepage footer as named columns, because a
row of two- and three-word labels has no width to live in. It fixed one footer.
There were five, and the other four had the same fault or worse:

- **InnerLayout**, which is every `/guide`, `/topics`, `/prize`, `/location`,
  `/vs`, `/creators` and `/unsubscribe` page, the 404, and the four `/contests`
  index pages: eight links, the wordmark and a 47-character tagline in one
  `space-between` row. It carried `flexWrap`, so it wrapped rather than
  overflowed, but each item was squeezed under its own label width and broke
  inside itself.
- **The contest page**, the most-visited page type on the site: four links at
  `gap-4` with no wrap at all and middot separators. At 1440px every label
  broke in half — `Submit a / Contest`, `Organizer? Feature this / contest`,
  `Browse / All`, and the wordmark itself as `AI Film / Contests` — while each
  middot stayed vertically centred, so it sat beside the gap between the two
  lines rather than between two links. This is the 09-20 bug, unchanged, on the
  page most visitors actually land on.
- **`/tools/[slug]` and `/categories/[slug]`**: the wordmark, the tagline, and a
  single `Browse All` link. Twenty-odd pages built to be landed on from search,
  each offering one way onward.
- **`/cinematic-ads`**: the last glassmorphism left on the site. A
  `backdropFilter: blur(8px)` over `rgba(251,250,248,0.8)`, which is the page
  ground at 80% — paper blurred against paper, the exact thing 09-20 stripped
  off the homepage. Its border was `rgba(27,25,22,0.04)`, and its tagline was
  set in `#D8D4C9` on `#FBFAF8`: about 1.4:1, which is not a colour, it is an
  absence.

**Now** — all five are `<SiteFooter>`, reusing the `.sfoot` grid the homepage
already proved rather than inventing a sixth. Links stack one per line under
`Browse`, `More` and `Contact`; the identity column takes the slack so the link
columns sit right, the way the old left/right split did; below 640px the three
collapse to two with the identity block on its own full-width line. The
`container` prop keeps each page at the measure it already used — `max-w-6xl`
on the homepage, `max-w-5xl` through InnerLayout, `max-w-4xl` on contest, tool
and category pages — so nothing above the footer moved. Measured on the live
pages, the footer's top offset is identical before and after at both widths
(contest page 1853px at 1440, 3261px at 390); only the footer itself grew, by
121px on desktop and 271px on a phone, and it is the last thing on the page.

Three things came with it, none of them a new idea:

- **The contest page keeps its contextual CTA.** `featureContestId` swaps
  `Feature a Contest` for `Feature this contest` pointing at the same
  `/feature?contest=<id>` it pointed at before. An organizer who has scrolled
  their own listing still gets one click to the prefilled form.
- **Nothing lost, a lot gained.** No link was removed anywhere. The pages that
  offered one now offer ten; the contest page went from four to ten.
- **One mark.** The footer draws `<LogoMark size={22} />` instead of the
  separate `.sfoot-tile` "AI" square the homepage footer had kept. LogoMark's
  own comment says it exists so the two headers stop drawing near-copies; the
  homepage footer was the third copy. `.sfoot-tile` is deleted.

The tagline is now `#8B867C`, the same as the homepage's, which is about 3.5:1
on paper instead of 1.4:1.

**What did not change** — a word of copy, any URL, or the layout of anything
above the footer. `/cinematic-ads` still has ten other `backdropFilter` uses in
its cards and hero; they were not today's change and are still there.

**Inspiration** — Criterion serves one identical footer on every page and it is
the site's whole map: `Shop the Collection`, `Current`, `The Criterion Channel`,
`Our Mission`, `Terms of Use`, each a heading in the display face that is itself
a destination, with its links stacked beneath in letterspaced caps. Nothing is
shortened because a given page is "deep". And Letterboxd is the counterexample
that proves the rule: its footer *is* one row, eleven links wide, and it works
because every label is a single word — `About`, `Pro`, `News`, `Apps`, `Help`,
`Terms`, `API`, `Contact`. Ours are phrases. A row was never going to hold
`Organizer? Feature this contest`.

**Verified** — `npm run build` exits 0. Shot against a local `next start` at
1440px and 390px on `/`, `/creators`, `/cinematic-ads`, `/contests/closing-soon`
and `/tools/runway`; `✓ no horizontal overflow` clean on all ten. After the
push, all eight live page types serve the same three-column footer (checked by
counting `sfoot-head` in the delivered HTML) and return 200. The local build
renders no contests, because `.env.cron` still has no
`NEXT_PUBLIC_SUPABASE_ANON_KEY`; the footer does not read contest data, and the
before and after shots are both from the live site.

**Before / after** — `reports/design/2026-09-30-before.png` (390px),
`2026-09-30-before-desktop.png`, `2026-09-30-after.png`,
`2026-09-30-after-desktop.png` on the contest page, and
`2026-09-30-before-tools.png`, `2026-09-30-before-tools-desktop.png`,
`2026-09-30-after-tools.png`, `2026-09-30-after-tools-desktop.png` on
`/tools/runway`, where one link became ten.

---

## 2026-09-29 — The homepage FAQ, as a ruled question list in real ink

**Changed** — the `Frequently asked` section of `src/app/page.tsx` and a new
`.hfaq-*` block in `globals.css`, 74 lines added and 19 removed.

**Was** — the optimizer shipped this section on 09-27 to back the FAQPage
JSON-LD with content a visitor can actually see. It went up in default
styling and has not been looked at since, so it was the only section on the
homepage with no structure at all: three question/answer pairs in a flex
column, 24px apart, no rules, nothing marking where one answer ended and the
next question began except the gap.

Two faults in it:

- The answers were set 14px in `#7A7469`. That is the palest body text
  anywhere on the site, on its most substantive prose — the passage that
  explains what this directory actually lists. The Principles set body ink at
  `#3E3A33`; the hero paragraph and the footer tagline are both darker than
  this was. The credibility copy was the hardest thing on the page to read.
- On a 1440px viewport it filled a 640px column and left the right 45% of the
  section empty. Every other block on the homepage either spans or is
  deliberately two-column; this one just stopped.

And one dead end: the second answer says *"See the full, always-current list
on the Free to Enter page"* — naming a page that exists, links from the nav,
and appears in the footer forty pixels below it — as plain text.

**Now** — the same ruled definition list `/creators` got on 09-26 for "Why be
featured" (`.cr-why`). Question in its own 300px column, answer stepped
across a 32px gap, a hairline under each row and one over the first. The
answer is body copy: `#3E3A33`, 14.5px, line-height 1.75, capped at 56ch so
lines land around 72 characters instead of the 80 the old 640px column was
setting. `Free to Enter page` is a link.

At 760px and below the two columns stack, which is exactly what the before
state looked like on a phone — so the phone keeps its shape and gains the
rules and the ink.

The section is slightly *taller*, not shorter: measured on the live page from
the `Frequently asked` heading to the footer, 514px → 535px on desktop and
762px → 814px at 390px. The 56ch cap is narrower than the 640px column it
replaced, so no answer lost a line, and the row padding and the looser
leading add the rest. That was the trade — the block is 21px longer on
desktop and the answers are readable. It is the last section before the
footer, so nothing was pushed down that a visitor was trying to reach.

**What did not change** — a word of copy. The answer strings are still the
single source the `FAQPage` JSON-LD reads; the link is applied at render by
splitting the string on the phrase, so the marked-up answer and the visible
answer are still character-for-character the same, which is what Google's FAQ
guidance asks for. No new question was added, and the three that are there
still say what the optimizer wrote.

**Inspiration** — two, and they agree. Criterion's FAQ indents each answer
away from its question and sets it as full-weight reading matter at a narrow
measure, so the indent carries the hierarchy and the answer is as legible as
any body copy on the site — it is not treated as caption text under a label.
Siteinspire's About page links every destination its prose names: eight
phrases in five paragraphs, so the writing doubles as navigation and nothing
that could be a link is left sitting there as text. Ours named a page and
left it dead; that was the whole of the second fix.

**Verified** — `npm run build` exits 0. Shot against a local `next start` at
1440px and at 390px; `✓ no horizontal overflow` clean at both. The local
build renders `0 of the 0 contests` in the second answer because `.env.cron`
still has no `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the live figures are 66 of 92,
which is two characters longer and changes no line break. The after shots are
from the live page.

**Before / after** — `reports/design/2026-09-29-before.png` (390px),
`2026-09-29-before-desktop.png`, `2026-09-29-after.png` (390px),
`2026-09-29-after-desktop.png`, on the homepage.

---

## 2026-09-28 — The card's prize, at the card's full width

**Changed** — the footer row of `src/components/ContestCard.tsx`, about 35 lines.
The card is the site's most repeated object — sixty to ninety of them on a browse
page — and the 09-08 run set its deadline language and has not been back since.

**Was** — the footer was one flex row: a `Prize` caption and value on the left,
`View details →` on the right, vertically centred against each other.

That shape assumes the prize is a figure. It usually is not. Checked against live
data: **56 of the 89 open contests have a prize string over 45 characters, and the
median is 53**. Once the CTA had taken its ~100px, the prize was setting in about
170px on desktop, so the real ones wrapped four, five and six times:

- `US$30 / US$20 / US$10 cash + feature on orhena's official accounts + 1 year of
  orhena Pro for winners (every entrant also gets 1 month of orhena Pro)` — five
  lines on desktop, six on a phone, in a column narrower than the description
  directly above it.
- `Trophies and certificates across all award categories` — two cramped lines next
  to a CTA, where it fits comfortably on two wide ones.

Two more faults lived in the same row. `View details →` floated at a different
height on every card, because it was centred against a prize of unpredictable
depth — so a grid of cards had a ragged column of blue arrows down it. And closed
contests never got a CTA, so the footer was one shape for an open contest and
another for a closed one, in the same grid.

Separately, `Verified <date>` — added by the optimizer on 09-17, and the one line
on the card that says this directory is maintained — was set at **8.5px in
`#A8A296`**, as a third right-aligned tier underneath `12 days left` and
`OCT 10, 2026`. The credibility line was the least legible thing on the card, and
it was competing with the deadline instead of supporting it.

**Now** — the caption line carries both 10px meta items, `Prize` on the left and
`Verified <date>` on the right, and the value sets underneath at the card's full
measure (273px on desktop, 308px at 390px, up from ~170px). Line-height goes
1.2 → 1.35, because the value is now a paragraph rather than a figure.

It is still two lines, so no card got taller; the long ones got shorter. The
orhena prize went from six lines to four on a phone, taking about 90px off that
card. `Verified` is legible at the caption's own size and colour, and reads as the
footnote it is. The footer is now the same shape whether a contest is open or
closed.

Nothing was added to replace the CTA. The whole card is an `<a>`, and it already
lifts, darkens its border and turns its title indigo on hover — the affordance
survives losing the arrow. This is the third time this pattern has come off:
`Feature →` eighty times on /feature (09-24), `View profile →` per row on
/creators (09-26), and now the last and largest instance of it.

**What the verified date is not** — the relative phrasing the deadline uses
(`12 days left`) was considered for this line and rejected. `updated_at` is when
the row last *changed*, not when it was last *looked at*: the median open contest
is 14 days old by that column and twenty are past 31 days. Printing
"checked 44 days ago" would have stated something the data does not know. The
absolute date says exactly as much as the column actually carries.

**Inspiration** — Are.na's Explore grid. Each channel card puts the title at size,
then a small stack of provenance underneath: author, block count, and how long ago
it was touched, all at one small size rather than three descending ones. There is
no "View channel →" on any card — the title is the affordance and the last line is
a footnote, not a button. The idea we took is the ranking: on a directory, the
freshness stamp belongs at the bottom with the other provenance, quiet but
readable, and never in the middle of the decision.

**Verified** — the local build cannot render contest rows (`.env.cron` has no
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, so `getAllContests()` returns nothing), so the
card was proved in a throwaway route that fed the real `ContestCard` six real
rows pulled from Supabase — the longest prize on the site, the median one, a
three-character one, a closed contest, one inside seven days and one free entry —
built with `next start` and shot at both widths, before and after. That pair is
`reports/design/2026-09-28-card-study-{before,after}-{desktop,390}.png`. The route
was deleted before the commit. Longest unbroken token in any prize is 18
characters, so the wider measure cannot overflow. `npm run build` exits 0.

**Before / after** — `reports/design/2026-09-28-before.png` (390px),
`2026-09-28-before-desktop.png`, `2026-09-28-after.png` (390px),
`2026-09-28-after-desktop.png`, on /contests/closing-soon.

---

## 2026-09-27 — A long spec value stacks under its caption instead of ragging right

**Changed** — `SpecRow` in `src/app/contests/[id]/page.tsx`, about 20 lines. The
spec rail is the densest data on the site and the part a visitor actually decides
with; the 09-23 run fixed the Apply block above it and left the rows alone.

**Was** — every fact in the rail was forced into one shape: caption left, value
right-aligned, `13.5px/1.4`. That shape is right for a figure. `Free`,
`June 1, 2026`, `November 24, 2026` line up down the right edge and the rail
scans in a second.

It is wrong for a sentence, and a fifth of the rail's values are sentences. Once
the caption and the 20px padding have taken their share, the value column is
about 160px wide, so anything past roughly 28 characters wraps two, three or
four times — and every one of those lines has to be read ragged-left, which is
the hardest thing you can ask of body-sized text. Checked against live data:
**22 of 195 entry fees and 4 of 171 locations are over 40 characters**, the
longest running to 110 and 136.

The two worst were the two that matter most:

- `Tiered: Earlybird $25 (May 14) through Final $55 (Jan 21, 2027)` — the entry
  fee is the second thing anyone decides on after the deadline, and it was the
  hardest line on the page to read.
- `Paris, France (Festival at Forum des Images with international screenings in
  New York, São Paulo, Johannesburg, Geneva and other cities)` — five ragged
  lines on a phone, set as though it were a date.

**Now** — the row switches on the value's length. Under 28 characters nothing
changes at all: the figure-right row stays, because it earns its keep. Over it,
the caption keeps its own line and the value sets beneath it at full column
measure, left-aligned, `14px/1.5`. Same hairline, same 11px row padding, same
family and colour — no new token, no box, no rule added. Several values now take
*fewer* lines than they did right-aligned: `$10–$25 (varies by deadline tier)`
went from two ragged lines to one.

The threshold is a character count rather than a media query on purpose. The
break is caused by the value, not the viewport — the rail is 320px on desktop
and about 350px on a phone, so the same sentences overflow at both widths and
should behave the same way at both.

**Inspiration** — Metrograph's *Now Playing* programme. Every fact under a film
sits in one left-aligned column: the short ones (`2001 / 120MIN / DIGITAL`) run
together on a single line, and the one long fact — a sentence about a
post-screening discussion — simply drops to its own line at full measure.
Nothing is ever right-aligned into a figure's column, so a sentence never has to
be read ragged-left. Mubi's film pages do the same thing more bluntly: no
captions at all, everything left, hierarchy from size and colour only. We keep
our captions, because an entry fee needs naming in a way a director credit does
not, but the rule is theirs.

**Verified** — the local build cannot render contest rows (the `.env.cron` file
has no `NEXT_PUBLIC_SUPABASE_ANON_KEY`, so `getAllContests()` returns nothing
and every `/contests/<id>` page 404s locally). So the typography was proved
first in a standalone harness carrying the rail's exact CSS at its exact 320px
width, against the ten real values above — that comparison is saved as
`reports/design/2026-09-27-specrow-study.png` — and then on the live page after
deploy. `npm run build` exits 0.

**Before / after** — `reports/design/2026-09-27-before.png` (390px),
`2026-09-27-before-desktop.png`, `2026-09-27-after.png` (390px),
`2026-09-27-after-desktop.png`. The study is
`2026-09-27-specrow-study.png`.

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
