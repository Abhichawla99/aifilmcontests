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

// Strip HTML to readable plain text, capped at maxLen chars
function htmlToText(html: string, maxLen = 8000): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen)
}

// Fetch a URL and return stripped plain text. Returns null on any failure.
async function fetchPageText(url: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 12000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    })
    clearTimeout(timer)
    if (!res.ok) {
      console.log(`[Research] Fetch ${url} → HTTP ${res.status}`)
      return null
    }
    const ct = res.headers.get('content-type') ?? ''
    if (!ct.includes('html') && !ct.includes('text')) return null
    const html = await res.text()
    return htmlToText(html)
  } catch (err) {
    console.log(`[Research] Fetch failed ${url}:`, String(err).slice(0, 80))
    return null
  }
}

async function callOpenRouter(
  messages: Array<{ role: string; content: string }>,
  model: string,
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
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.1 }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter ${res.status}: ${err}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
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
  pagesRead?: number
}> {
  const today = new Date().toISOString().slice(0, 10)

  // ── Load existing contests for dedup ─────────────────────────────────────────
  const { data: existing } = await supabaseAdmin.from('contests').select('id, name, url')
  const existingIds = (existing ?? []).map(c => c.id)
  const existingNames = (existing ?? []).map(c => c.name.toLowerCase().trim())
  const existingUrls = (existing ?? []).map(c => (c.url ?? '').toLowerCase().replace(/\/$/, ''))
  const dbList = (existing ?? []).map(c => `- ${c.id}: ${c.name}`).join('\n')

  // ══════════════════════════════════════════════════════════════════════════════
  // PHASE 1 — Perplexity discovers candidate contest URLs via web search
  // We only ask for URLs + names here — fast, cheap, high recall.
  // ══════════════════════════════════════════════════════════════════════════════
  let candidates: Array<{ name: string; url: string }> = []

  try {
    const p1 = await callOpenRouter(
      [
        {
          role: 'system',
          content: `You are a research assistant for aifilmcontests.com. Today is ${today}.

ALREADY IN OUR DATABASE (skip these):
${dbList}

Search the web for AI film contests that are currently open for submissions and NOT in our database.
Return ONLY a JSON array: [{"name":"Contest Name","url":"https://exact-url"}]
Up to 15 results. Return [] if nothing new. No markdown, no explanation, just the array.`,
        },
        {
          role: 'user',
          content: `Search for new AI film contests using these queries:
1. "AI film festival 2026 open submissions"
2. "AI film competition 2026 open call deadline"
3. "generative AI short film contest submissions open 2026"
4. "AI filmmaking award open call 2026 prize"
5. "Runway Kling Luma Hailuo Pika film competition 2026 submissions"
6. "AI generated video contest 2026 cash prize"

Return the JSON array of {name, url} for any new AI film contest you find that is NOT already in our database.`,
        },
      ],
      'perplexity/sonar-pro',
      1500,
    )

    const raw = parseJsonArray(p1)
    candidates = (raw as Array<{ name?: string; url?: string }>)
      .filter(c => {
        if (!c.url || !c.name) return false
        const url = c.url.toLowerCase().replace(/\/$/, '')
        const name = c.name.toLowerCase().trim()
        if (existingUrls.includes(url)) return false
        if (existingNames.includes(name)) return false
        return true
      })
      .map(c => ({ name: c.name!, url: c.url! }))
      .slice(0, 15)

    console.log(`[Research] Phase 1: ${candidates.length} candidates`)
  } catch (err) {
    return { ok: false, date: today, newContestsFound: 0, addedToDb: [], model: 'perplexity/sonar-pro + gpt-4o-mini', error: `Phase 1 failed: ${String(err)}` }
  }

  if (candidates.length === 0) {
    return { ok: true, date: today, newContestsFound: 0, addedToDb: [], model: 'perplexity/sonar-pro + gpt-4o-mini', phase1Candidates: 0 }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PHASE 2 — Actually fetch each candidate page ourselves (100% real content)
  // We do this in parallel so 15 pages takes ~10–15s total.
  // ══════════════════════════════════════════════════════════════════════════════
  const fetched = await Promise.allSettled(
    candidates.map(async c => ({
      name: c.name,
      url: c.url,
      text: await fetchPageText(c.url),
    }))
  )

  const pagesWithContent = fetched
    .filter((r): r is PromiseFulfilledResult<{ name: string; url: string; text: string | null }> => r.status === 'fulfilled' && r.value.text !== null)
    .map(r => r.value)

  console.log(`[Research] Phase 2: ${pagesWithContent.length}/${candidates.length} pages fetched successfully`)

  if (pagesWithContent.length === 0) {
    return { ok: true, date: today, newContestsFound: 0, addedToDb: [], model: 'perplexity/sonar-pro + gpt-4o-mini', phase1Candidates: candidates.length, pagesRead: 0 }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PHASE 3 — Extract structured data from real page content using gpt-4o-mini
  // The model sees ACTUAL page text — no hallucination possible on deadline/prize.
  // ══════════════════════════════════════════════════════════════════════════════
  const pageBlock = pagesWithContent
    .map((p, i) => `--- PAGE ${i + 1}: ${p.name}\nURL: ${p.url}\n\n${p.text}\n---`)
    .join('\n\n')

  let newContests: Record<string, unknown>[] = []

  try {
    const p3 = await callOpenRouter(
      [
        {
          role: 'system',
          content: `You are a data extraction agent for aifilmcontests.com. Today is ${today}.

You will receive the actual text content of several web pages. For each page, extract the contest details IF AND ONLY IF:
1. AI-generated content is a CORE requirement (not optional alongside traditional filmmaking)
2. The submission deadline is clearly stated on the page AND is after ${today}
3. A prize amount is clearly stated on the page
4. This is a real, live contest (not past, not cancelled)

Return ONLY a valid JSON array. Each contest object must have ALL of these exact fields:
{
  "id": "descriptive-kebab-slug-year",
  "name": "Exact contest name as written on the page",
  "organizer": "Exact organisation name as written on the page",
  "description": "2-3 sentences describing: what AI tools are required or encouraged, the theme/subject matter, and where/how winners are screened or exhibited. Based only on what the page says.",
  "deadline": "YYYY-MM-DD",
  "submission_open": null,
  "prize": "Exact prize text from the page, e.g. $10,000 Grand Prize",
  "prize_details": ["First place: $X", "Runner-up: $Y"],
  "url": "https://the-exact-url-of-this-page",
  "status": "open",
  "categories": ["short-film"],
  "ai_tools_allowed": ["Tool name if specific, or Any AI tools"],
  "eligibility": "Who can enter and any restrictions, exactly as stated on the page",
  "entry_fee": "Free, or the exact fee from the page",
  "featured": false,
  "tags": [],
  "location": null,
  "event_date": null
}

ABSOLUTE RULES — violating these is worse than returning []:
- If the deadline is not EXPLICITLY written on the page: skip this contest entirely
- If the prize is not EXPLICITLY written on the page: skip this contest entirely
- If the page is a past contest or a 404 / error page: skip it
- featured: true ONLY for total prizes exceeding $10,000 USD, or contests run by Runway, Kling, Luma, Google DeepMind, or major international film festivals
- Return ONLY the JSON array. Zero other text.`,
        },
        {
          role: 'user',
          content: `Extract contest data from these pages. Only include contests where deadline AND prize are explicitly stated:\n\n${pageBlock}`,
        },
      ],
      'openai/gpt-4o-mini',
      4000,
    )

    const raw = parseJsonArray(p3)
    newContests = raw
      .filter((c: Record<string, unknown>) => {
        if (!c.id || !c.name || !c.deadline || !c.url) return false
        if (existingIds.includes(c.id as string)) return false
        if (existingNames.includes((c.name as string).toLowerCase().trim())) return false
        const dl = new Date(c.deadline as string)
        if (isNaN(dl.getTime()) || dl <= new Date()) return false
        return true
      })
      .map(sanitize)

    console.log(`[Research] Phase 3: ${newContests.length} contests extracted and validated`)
  } catch (err) {
    return {
      ok: false,
      date: today,
      newContestsFound: 0,
      addedToDb: [],
      model: 'perplexity/sonar-pro + gpt-4o-mini',
      error: `Phase 3 extraction failed: ${String(err)}`,
      phase1Candidates: candidates.length,
      pagesRead: pagesWithContent.length,
    }
  }

  // ── Write to Supabase ─────────────────────────────────────────────────────────
  let addedIds: string[] = []
  let upsertError: string | undefined

  if (newContests.length > 0) {
    console.log('[Research] Upserting:', newContests.map(c => `${c.id} (${c.name})`))
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
    model: 'perplexity/sonar-pro + gpt-4o-mini',
    phase1Candidates: candidates.length,
    pagesRead: pagesWithContent.length,
    ...(upsertError ? { upsertError } : {}),
  }
}
