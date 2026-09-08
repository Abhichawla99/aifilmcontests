# Optimizer backlog

One item per day, in order. The optimizer robot takes the first unchecked item,
ships it, and marks it `[x] YYYY-MM-DD` in the same commit as the change.
`[!] blocked: <reason>` means the build failed twice and the item was skipped.

- [x] 2026-09-08 Featured creators, part 1: `src/data/creators.ts` (slug, name, type, location, website, oneLiner, bio, tags, workLinks[], contests[], featuredSince) seeded with Ruminate X. Build `/creators` (grid of cards) and `/creators/[slug]` (profile with a dofollow link to the website, a "Featured creator" pill, work links, and a "Get featured" mailto CTA). Add /creators to the homepage nav/footer and sitemap.ts. Person/Organization JSON-LD on the profile.
- [ ] Featured creators, part 2: the backlink loop. Badge at `/badge/featured-creator.svg` (dark, indigo accent, "Featured on AI Film Contests") and a copy-paste embed snippet on every profile. Add a "Why be featured" section on /creators.
- [ ] Featured creators, recurring: if `reports/creator-candidates.md` has an unchecked candidate, add the top one to creators.ts and tick it there. At most twice a week; otherwise continue down this list. Never invent a creator or a fact about them.
- [ ] `/contests/closing-soon`: open contests with a deadline within 14 days, sorted by deadline, with the compact subscribe form. Link from homepage nav/footer and add to sitemap.ts.
- [ ] `/contests/free`: open contests whose entry fee is free (Free, None, $0, No fee). Same layout.
- [ ] `/contests/cash-prizes`: open contests whose prize contains a currency amount. Same layout.
- [ ] `/contests/new`: contests added in the last 14 days (created_at). Same layout.
- [ ] `/contests/student`: open contests whose eligibility mentions students. Same layout.
- [ ] Trust signal: show "Verified <date>" (from updated_at) on ContestCard and on the contest page near the deadline.
- [ ] Every /topics, /guide, /tools, /vs, /prize, /location, /categories page ends with the compact subscribe form if it does not already.
- [ ] Contest page: an inline "Get a reminder 3 days before this deadline" subscribe block next to the deadline.
- [ ] Paid featured listings: when a contest has featuredUntil in the future, show a "Featured" pill on ContestCard and the contest page.
- [ ] Mobile pass at 375px: homepage hero, ticker and subscribe form must not overflow; tap targets at least 40px.
- [ ] Performance: lazy-load or disable MouseOrbs and BackgroundFX on mobile; make sure no image is unoptimized.
- [ ] Default Open Graph image (`app/opengraph-image.tsx`) so shared links show a card.
- [ ] Contest page: "Related contests" block with 3 open contests sharing a tool or category.
- [ ] FAQPage JSON-LD on the homepage: what counts as an AI film, are there free contests, how alerts work.
- [ ] `/feature` page: a short "How it works" (pay, we pin it within a day, 30 days) and a real example screenshot of the spotlight.
- [ ] IndexNow key file and an IndexNow ping for new pages (then note it for the seo robot in robots/RESEARCH_QUERIES.md).

When the backlog is empty: check Vercel Analytics for the aifilmcontests project (top
pages, where signups come from) and add three evidence-based items instead of guessing.
- [x] 2026-09-08 Apply the contest-page pattern to /guide/[slug] and /topics/[slug]: tinted header band, prose at a real measure, a sticky rail holding the contests the article cites, and the subscribe block. See DESIGN_LOG.md 2026-09-08 (2).
- [x] 2026-09-08 Same for /tools/[slug], /vs/[slug], /prize/[slug], /location/[slug] and /categories/[slug] — these share InnerLayout, so most of the work is one component.
- [x] 2026-09-08 /creators/[slug]: give creator profiles the same header band treatment, tinted by their work rather than a contest category.
