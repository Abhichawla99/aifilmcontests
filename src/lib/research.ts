import { supabaseAdmin } from './supabase'
import { sendNewContestAlerts } from './email'

// ── Only these columns exist in the contests table ────────────────────────────
const VALID_COLUMNS = [
  'id', 'name', 'organizer', 'description', 'deadline', 'submission_open',
  'prize', 'prize_details', 'url', 'status', 'categories', 'ai_tools_allowed',
  'eligibility', 'entry_fee', 'featured', 'tags', 'location', 'event_date',
] as const

function sanitize(c: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const key of VALID_COLUMNS) {
    if (key in c) out[key] = c[key]
  }
  return out
}

async function openRouter(
  messages: Array<{ role: string; content: string }>,
  maxTokens = 4000,
): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://aifilmcontests.com',
      'X-Title': 'AI Film Contests Research Agent',
    },
    body: JSON.stringify({
      model: 'perplexity/sonar-pro',
      messages,
      max_tokens: maxTokens,
      temperature: 0.1,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter ${res.status}: ${err}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

function parseJsonArray(text: string): Record<string, unknown>[] {
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) return []
  try {
    const parsed = JSON.parse(match[0])
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function runResearch(): Promise<{
  ok: boolean
  date: string
  newContestsFound: number
  addedToDb: string[]
  model: string
  error?: string
  upsertError?: string
  phase1Candidates?: number
}> {
  const today = new Date().toISOString().slice(0, 10)

  // ── Load existing contests ────────────────────────────────────────────────────
  const { data: existing } = await supabaseAdmin
    .from('contests')
    .select('id, name, url')

  const existingIds = (existing ?? []).map(c => c.id)
  const existingNames = (existing ?? []).map(c => c.name.toLowerCase().trim())
  const existingUrls = (existing ?? []).map(c => (c.url ?? '').toLowerCase().replace(/\/$/, ''))

  const dbList = (existing ?? [])
    .map(c => `- ${c.id}: ${c.name}`)
    .join('\n')

  // ══════════════════════════════════════════════════════════════════════════════
  // PHASE 1 — Search broadly and return candidate URLs
  // Perplexity is excellent at web search; we ask it for raw links only (fast).
  // ══════════════════════════════════════════════════════════════════════════════

  let candidates: Array<{ name: string; url: string }> = []

  try {
    const p1Content = await openRouter(
      [
        {
          role: 'system',
          content: `You are a research agent for aifilmcontests.com. Today is ${today}.

ALREADY IN OUR DATABASE — do NOT suggest these:
${dbList}

Search the web for AI film contests that are open or opening soon and are NOT in the list above.
Return ONLY a JSON array: [{"name":"Contest Name","url":"https://exact-url"}]
Maximum 12 results. Return [] if nothing new. No markdown, no explanation.`,
        },
        {
          role: 'user',
          content: `Search for new AI film contests using these queries:
1. "AI film festival 2026 open submissions"
2. "AI film competition 2026 open call deadline"
3. "generative AI short film contest open 2026"
4. "AI filmmaking award submissions open 2026"
5. "Runway Kling Luma Hailuo Pika film competition 2026"
6. "AI generated film contest 2026 prize"

For each result that looks like a real, new AI film contest: include it. Filter out anything already in our database. Return the JSON array only.`,
        },
      ],
      1500,
    )

    const raw = parseJsonArray(p1Content)
    candidates = raw
      .filter((c): c is { name: string; url: string } => {
        if (!c.url || !c.name) return false
        const url = (c.url as string).toLowerCase().replace(/\/$/, '')
        const name = (c.name as string).toLowerCase().trim()
        if (existingUrls.includes(url)) return false
        if (existingNames.includes(name)) return false
        return true
      })
      .slice(0, 12)

    console.log(`[Research] Phase 1: ${candidates.length} candidates`)
  } catch (err) {
    return {
      ok: false,
      date: today,
      newContestsFound: 0,
      addedToDb: [],
      model: 'perplexity/sonar-pro',
      error: `Phase 1 failed: ${String(err)}`,
    }
  }

  if (candidates.length === 0) {
    return { ok: true, date: today, newContestsFound: 0, addedToDb: [], model: 'perplexity/sonar-pro', phase1Candidates: 0 }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PHASE 2 — Visit each candidate URL and extract structured data
  // We give Perplexity the exact URLs and ask it to read each page carefully.
  // ══════════════════════════════════════════════════════════════════════════════

  const urlList = candidates
    .map((c, i) => `${i + 1}. ${c.name}\n   URL: ${c.url}`)
    .join('\n\n')

  let newContests: Record<string, unknown>[] = []

  try {
    const p2Content = await openRouter(
      [
        {
          role: 'system',
          content: `You are a data extraction agent for aifilmcontests.com. Today is ${today}.

For each URL below, visit the page and extract the contest details. Only include a contest if:
1. AI-generated content is a CORE requirement (not optional)
2. The deadline is after ${today}
3. The page loaded and you can read real content
4. Both prize amount and deadline are explicitly stated on the page

Return ONLY a valid JSON array. Each object must have ALL these fields with correct types:
{
  "id": "kebab-case-unique-slug-2026",
  "name": "Exact Official Contest Name as written on the page",
  "organizer": "Exact organisation name from the page",
  "description": "2-3 sentences from the actual page. Mention: required AI tools, theme/genre, screening/exhibition.",
  "deadline": "YYYY-MM-DD",
  "submission_open": null,
  "prize": "Exact prize string from page, e.g. $10,000 Grand Prize",
  "prize_details": ["First place: $X", "Second place: $X"],
  "url": "https://the-exact-url-you-visited",
  "status": "open",
  "categories": ["short-film"],
  "ai_tools_allowed": ["Tool name, or Any AI tools"],
  "eligibility": "Who can enter and any restrictions — from the page",
  "entry_fee": "Free or exact fee amount from the page",
  "featured": false,
  "tags": [],
  "location": null,
  "event_date": null
}

HARD RULES:
- NEVER invent a deadline. If it's not on the page, skip the contest entirely.
- NEVER invent a prize. Only write what is explicitly on the page.
- If the page says "prizes to be announced", omit that contest.
- featured: true ONLY for prizes > $10,000 or from Runway/Kling/Luma/Google/major film festivals.
- Return [] if no contests pass validation.
- Return ONLY the JSON array. Zero other text.`,
        },
        {
          role: 'user',
          content: `Visit each of these pages and extract the contest data:

${urlList}

Go to each URL, read the actual page content carefully, and return a JSON array of valid contests. Skip any page that returns an error or where you cannot confirm the deadline and prize from the actual page content.`,
        },
      ],
      6000,
    )

    const raw = parseJsonArray(p2Content)
    newContests = raw
      .filter((c: Record<string, unknown>) => {
        if (!c.id || !c.name || !c.deadline || !c.url) return false
        if (existingIds.includes(c.id as string)) return false
        if (existingNames.includes((c.name as string).toLowerCase().trim())) return false
        const dl = new Date(c.deadline as string)
        if (isNaN(dl.getTime()) || dl <= new Date()) return false
        return true
      })
      .map(sanitize) // strip any fields not in our DB schema

    console.log(`[Research] Phase 2: ${newContests.length} contests validated`)
  } catch (err) {
    return {
      ok: false,
      date: today,
      newContestsFound: 0,
      addedToDb: [],
      model: 'perplexity/sonar-pro',
      error: `Phase 2 failed: ${String(err)}`,
      phase1Candidates: candidates.length,
    }
  }

  // ── Write to Supabase ─────────────────────────────────────────────────────────
  let addedIds: string[] = []
  let upsertError: string | undefined

  if (newContests.length > 0) {
    console.log('[Research] Upserting:', newContests.map(c => c.id))
    const { data: upserted, error: upsertErr } = await supabaseAdmin
      .from('contests')
      .upsert(newContests, { onConflict: 'id' })
      .select('id, name')

    if (upsertErr) {
      console.error('[Research] Upsert failed:', upsertErr.message)
      upsertError = upsertErr.message
    } else {
      addedIds = (upserted ?? []).map(c => c.id)
      console.log('[Research] Added:', addedIds)
    }
  }

  // ── Email subscribers about new contests ──────────────────────────────────────
  if (addedIds.length > 0) {
    try {
      const { data: newContestData } = await supabaseAdmin
        .from('contests')
        .select('name, organizer, prize, deadline, url, description')
        .in('id', addedIds)

      const { data: subs } = await supabaseAdmin
        .from('subscribers')
        .select('email')
        .eq('confirmed', true)

      if (newContestData?.length && subs?.length) {
        await sendNewContestAlerts(subs.map(s => s.email), newContestData)
      }
    } catch (err) {
      console.error('[Research] Notification failed:', err)
    }
  }

  return {
    ok: true,
    date: today,
    newContestsFound: newContests.length,
    addedToDb: addedIds,
    model: 'perplexity/sonar-pro',
    phase1Candidates: candidates.length,
    ...(upsertError ? { upsertError } : {}),
  }
}
