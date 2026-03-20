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
  // Extract first JSON array found anywhere in the text
  const match = text.match(/\[[\s\S]*?\]/)
  if (!match) return []
  try {
    const parsed = JSON.parse(match[0])
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // Try to find a larger array if the first match failed
    const greedyMatch = text.match(/\[[\s\S]*\]/)
    if (greedyMatch) {
      try {
        const parsed = JSON.parse(greedyMatch[0])
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch { /* continue */ }
    }
    return []
  }
}

// Strip HTML to readable plain text, capped at maxLen chars
function htmlToText(html: string, maxLen = 9000): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen)
}

// Fetch a URL and return stripped plain text. Returns null on any error/block.
async function fetchPageText(url: string): Promise<{ text: string; method: 'direct' } | { text: null; method: 'blocked'; reason: string }> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 12000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
      },
    })
    clearTimeout(timer)
    if (res.status === 403 || res.status === 429 || res.status === 503) {
      return { text: null, method: 'blocked', reason: `HTTP ${res.status}` }
    }
    if (!res.ok) {
      return { text: null, method: 'blocked', reason: `HTTP ${res.status}` }
    }
    const ct = res.headers.get('content-type') ?? ''
    if (!ct.includes('html') && !ct.includes('text')) {
      return { text: null, method: 'blocked', reason: `Non-HTML content-type: ${ct}` }
    }
    const html = await res.text()
    // Detect Cloudflare / JS challenge pages (< 2000 chars of real text is a red flag)
    const text = htmlToText(html)
    if (text.length < 500) {
      return { text: null, method: 'blocked', reason: 'Page too short (likely bot challenge)' }
    }
    return { text, method: 'direct' }
  } catch (err) {
    const msg = String(err)
    const reason = msg.includes('abort') ? 'Timeout (12s)' : msg.slice(0, 60)
    return { text: null, method: 'blocked', reason }
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
    throw new Error(`OpenRouter ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

// ── The contest extraction schema (used in both Phase 3a and 3b prompts) ───────
function extractionSchema(today: string) {
  return `Return ONLY a valid JSON array. Each contest object must have ALL of these exact fields:
{
  "id": "descriptive-kebab-slug-2026",
  "name": "Exact contest name as written on the page",
  "organizer": "Organisation running it",
  "description": "2-3 sentences: what AI tools are required, the theme, where winners screen",
  "deadline": "YYYY-MM-DD",
  "submission_open": null,
  "prize": "Exact prize from the page e.g. $10,000 Grand Prize",
  "prize_details": ["First place: $X"],
  "url": "https://exact-url",
  "status": "open",
  "categories": ["short-film"],
  "ai_tools_allowed": ["Tool name or Any AI tools"],
  "eligibility": "Who can enter and restrictions",
  "entry_fee": "Free or exact fee",
  "featured": false,
  "tags": [],
  "location": null,
  "event_date": null
}

ABSOLUTE RULES:
- Only include a contest if deadline > ${today} AND both deadline and prize are explicitly stated
- featured: true ONLY for prizes > $10,000 or from Runway/Kling/Luma/Google/major festivals
- Return [] if nothing qualifies. ONLY the JSON array — zero other text.`
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
  pagesReadDirectly?: number
  pagesBlockedFallback?: number
  log: string[]
}> {
  const today = new Date().toISOString().slice(0, 10)
  const runLog: string[] = []
  const info = (msg: string) => { console.log(`[Research] ${msg}`); runLog.push(msg) }

  // ── Load existing contests for dedup ─────────────────────────────────────────
  const { data: existing } = await supabaseAdmin.from('contests').select('id, name, url')
  const existingIds = (existing ?? []).map(c => c.id)
  const existingNames = (existing ?? []).map(c => c.name.toLowerCase().trim())
  const existingUrls = (existing ?? []).map(c => (c.url ?? '').toLowerCase().replace(/\/$/, ''))

  // Show short names list for dedup reference (not full prompt — just IDs)
  const dbList = (existing ?? []).map(c => `${c.id}: ${c.name}`).join('\n')

  info(`Loaded ${existing?.length ?? 0} existing contests for dedup`)

  // ══════════════════════════════════════════════════════════════════════════════
  // PHASE 1 — Perplexity discovers candidate contest URLs
  // KEY: We do NOT ask Perplexity to dedup against our DB in this phase.
  // We want ALL AI film contest URLs it can find — code handles dedup.
  // ══════════════════════════════════════════════════════════════════════════════
  let candidates: Array<{ name: string; url: string }> = []

  try {
    info('Phase 1: Searching for AI film contest URLs...')
    const p1 = await callOpenRouter(
      [
        {
          role: 'system',
          content: `You are a research assistant for aifilmcontests.com. Today is ${today}.
Search the web and return ALL AI film contests and video competitions you can find that are currently open for submissions in 2025-2026.
Include contests run by AI companies (Runway, Kling, Luma, Hailuo, Pika, Sora, Stability, ElevenLabs), film festivals with AI categories, brand-sponsored AI video challenges, and independent AI filmmaking awards.
Return ONLY a JSON array: [{"name":"Contest Name","url":"https://exact-url"}]
Up to 20 results. No explanation, no markdown.`,
        },
        {
          role: 'user',
          content: `Search for all of these and return the URLs:
1. "AI film festival 2025 2026 open submissions"
2. "AI film competition open call 2026 prize"
3. "generative AI short film contest submissions 2026"
4. "AI video competition cash prize 2026 open"
5. "Runway Kling Luma AI film award 2026"
6. "AI filmmaking challenge grant 2026"
7. "film festival AI category open call 2026"
8. "AI generated video contest winner prize 2026"

Return every AI film contest you find as [{"name":"...","url":"..."}]`,
        },
      ],
      'perplexity/sonar-pro',
      2000,
    )

    const raw = parseJsonArray(p1)
    info(`Phase 1 raw response: ${raw.length} items returned by Perplexity`)

    // Dedup in code (not in prompt — Perplexity was too conservative)
    const allCandidates = (raw as Array<{ name?: string; url?: string }>).filter(c => {
      if (!c.url || !c.name) return false
      const url = c.url.toLowerCase().replace(/\/$/, '')
      const name = c.name.toLowerCase().trim()
      // Skip if URL or name exactly matches what's already in DB
      if (existingUrls.includes(url)) return false
      if (existingNames.includes(name)) return false
      return true
    }).map(c => ({ name: c.name!, url: c.url! }))

    candidates = allCandidates.slice(0, 20)
    info(`Phase 1 after dedup: ${candidates.length} new candidates (${raw.length - candidates.length} already in DB)`)
  } catch (err) {
    const errMsg = `Phase 1 failed: ${String(err)}`
    info(errMsg)
    return { ok: false, date: today, newContestsFound: 0, addedToDb: [], model: 'perplexity/sonar-pro + gpt-4o-mini', error: errMsg, log: runLog }
  }

  if (candidates.length === 0) {
    info('Phase 1 found no new candidates — all known AI film contests are already in the database')
    return { ok: true, date: today, newContestsFound: 0, addedToDb: [], model: 'perplexity/sonar-pro + gpt-4o-mini', phase1Candidates: 0, pagesReadDirectly: 0, pagesBlockedFallback: 0, log: runLog }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PHASE 2 — Attempt to fetch each candidate page directly
  // Many sites block bots (Cloudflare etc). We split into:
  //   - "fetched": pages we successfully read → Phase 3a (GPT-4o-mini)
  //   - "blocked": pages we couldn't read   → Phase 3b (Perplexity fallback)
  // ══════════════════════════════════════════════════════════════════════════════
  info(`Phase 2: Fetching ${candidates.length} pages directly...`)
  const fetchResults = await Promise.allSettled(
    candidates.map(async c => ({
      name: c.name,
      url: c.url,
      ...(await fetchPageText(c.url)),
    }))
  )

  const fetched: Array<{ name: string; url: string; text: string }> = []
  const blocked: Array<{ name: string; url: string; reason: string }> = []

  for (const r of fetchResults) {
    if (r.status === 'fulfilled') {
      if (r.value.method === 'direct' && r.value.text) {
        fetched.push({ name: r.value.name, url: r.value.url, text: r.value.text })
      } else {
        blocked.push({ name: r.value.name, url: r.value.url, reason: (r.value as { reason?: string }).reason ?? 'Unknown' })
      }
    }
  }

  info(`Phase 2: ${fetched.length} pages read directly, ${blocked.length} blocked (${blocked.map(b => `${b.name}: ${b.reason}`).join(', ') || 'none'})`)

  // ══════════════════════════════════════════════════════════════════════════════
  // PHASE 3a — Extract from directly-fetched pages using GPT-4o-mini
  // The model sees ACTUAL page text — cannot hallucinate deadline or prize.
  // ══════════════════════════════════════════════════════════════════════════════
  let extractedFromFetch: Record<string, unknown>[] = []

  if (fetched.length > 0) {
    info(`Phase 3a: Extracting data from ${fetched.length} directly-fetched pages...`)
    const pageBlock = fetched
      .map((p, i) => `=== PAGE ${i + 1}: ${p.name}\nURL: ${p.url}\n\n${p.text}\n===`)
      .join('\n\n')

    try {
      const p3a = await callOpenRouter(
        [
          {
            role: 'system',
            content: `You extract AI film contest data from actual web page text. Today is ${today}.
Only include contests where the deadline AND prize amount are explicitly written on the page. Skip any page where you cannot find both.
${extractionSchema(today)}`,
          },
          {
            role: 'user',
            content: `Extract contest data from these pages. Only include where deadline AND prize are clearly stated:\n\n${pageBlock}`,
          },
        ],
        'openai/gpt-4o-mini',
        4000,
      )
      extractedFromFetch = parseJsonArray(p3a)
      info(`Phase 3a extracted ${extractedFromFetch.length} contests from ${fetched.length} pages`)
    } catch (err) {
      info(`Phase 3a failed: ${String(err)} — continuing with Phase 3b`)
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PHASE 3b — Ask Perplexity to visit the blocked URLs directly
  // Perplexity has its own crawler and CAN read pages that block our fetch.
  // ══════════════════════════════════════════════════════════════════════════════
  let extractedFromPerplexity: Record<string, unknown>[] = []

  if (blocked.length > 0) {
    info(`Phase 3b: Asking Perplexity to visit ${blocked.length} blocked pages...`)
    const urlList = blocked.map((b, i) => `${i + 1}. ${b.name}: ${b.url}`).join('\n')

    try {
      const p3b = await callOpenRouter(
        [
          {
            role: 'system',
            content: `You visit specific web pages and extract AI film contest information. Today is ${today}.
Visit each URL listed and extract the contest details. Only include contests with explicit deadline AND prize on the page.
${extractionSchema(today)}`,
          },
          {
            role: 'user',
            content: `Visit each of these pages and extract the contest data:
${urlList}

Go to each URL, read the actual page content, and return the JSON array.`,
          },
        ],
        'perplexity/sonar-pro',
        4000,
      )
      extractedFromPerplexity = parseJsonArray(p3b)
      info(`Phase 3b extracted ${extractedFromPerplexity.length} contests from ${blocked.length} blocked pages`)
    } catch (err) {
      info(`Phase 3b failed: ${String(err)}`)
    }
  }

  // ── Combine, validate, deduplicate ────────────────────────────────────────────
  const allExtracted = [...extractedFromFetch, ...extractedFromPerplexity]
  info(`Total extracted before validation: ${allExtracted.length}`)

  const newContests = allExtracted
    .filter((c: Record<string, unknown>) => {
      if (!c.id || !c.name || !c.deadline || !c.url) return false
      if (existingIds.includes(c.id as string)) return false
      if (existingNames.includes((c.name as string).toLowerCase().trim())) return false
      const dl = new Date(c.deadline as string)
      if (isNaN(dl.getTime()) || dl <= new Date()) return false
      return true
    })
    // Deduplicate within batch (same URL or same name)
    .filter((c, idx, arr) => {
      const url = (c.url as string).toLowerCase().replace(/\/$/, '')
      const name = (c.name as string).toLowerCase().trim()
      return arr.findIndex(x =>
        (x.url as string).toLowerCase().replace(/\/$/, '') === url ||
        (x.name as string).toLowerCase().trim() === name
      ) === idx
    })
    .map(sanitize)

  info(`After validation + dedup: ${newContests.length} new contests ready to insert`)
  if (newContests.length > 0) {
    info(`Contests to add: ${newContests.map(c => `"${c.name}"`).join(', ')}`)
  }

  // ── Write to Supabase ─────────────────────────────────────────────────────────
  let addedIds: string[] = []
  let upsertError: string | undefined

  if (newContests.length > 0) {
    const { data: upserted, error: upsertErr } = await supabaseAdmin
      .from('contests')
      .upsert(newContests, { onConflict: 'id' })
      .select('id, name')

    if (upsertErr) {
      info(`Upsert FAILED: ${upsertErr.message}`)
      upsertError = upsertErr.message
    } else {
      addedIds = (upserted ?? []).map(c => c.id)
      info(`Upsert SUCCESS: added ${addedIds.length} contests: ${addedIds.join(', ')}`)
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
        info(`Emailed ${subs.length} subscribers about ${newContestData.length} new contests`)
      }
    } catch (err) {
      info(`Subscriber email failed: ${String(err)}`)
    }
  }

  return {
    ok: true,
    date: today,
    newContestsFound: newContests.length,
    addedToDb: addedIds,
    model: 'perplexity/sonar-pro + gpt-4o-mini',
    phase1Candidates: candidates.length,
    pagesReadDirectly: fetched.length,
    pagesBlockedFallback: blocked.length,
    log: runLog,
    ...(upsertError ? { upsertError } : {}),
  }
}
