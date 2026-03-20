import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/supabase'

// Vercel Cron — runs at 8:15 AM UTC daily
// Uses Claude with web_search to find new AI film contests and add them to Supabase.
// Also sends subscriber alerts for anything new found.

export const maxDuration = 300 // 5 minutes (Vercel Pro)

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  // Get existing contest IDs so Claude knows what's already in the DB
  const { data: existing } = await supabaseAdmin
    .from('contests')
    .select('id, name, url')
    .order('created_at', { ascending: false })

  const existingIds = (existing ?? []).map(c => c.id)
  const existingNames = (existing ?? []).map(c => c.name.toLowerCase())
  const today = new Date().toISOString().slice(0, 10)

  const systemPrompt = `You are a research agent for aifilmcontests.com. Your job is to find NEW AI film contests not already in our database and return them as structured JSON.

Today is ${today}.

EXISTING contests in our database (do NOT add these):
${existingIds.map((id, i) => `- ${id} (${(existing ?? [])[i]?.name})`).join('\n')}

YOUR TASK:
1. Search the web for new AI film contests using the search queries I'll give you
2. For each promising result, fetch the URL and read the actual page
3. Only include contests where:
   - AI-generated content is a CORE requirement (not just "AI is allowed")
   - The deadline is in the future (after ${today})
   - The page is live and the contest is real
   - It is NOT already in our database above

OUTPUT: Return a JSON array of new contest objects. Each must have ALL these fields:
{
  "id": "kebab-case-unique-id",
  "name": "Official Contest Name",
  "organizer": "Who runs it",
  "description": "1-2 sentences. Key facts: AI requirement, theme, screening location.",
  "deadline": "YYYY-MM-DD",  // MUST come from the actual page — never guess
  "submission_open": null,   // or "YYYY-MM-DD" if stated
  "prize": "Short prize summary e.g. $10,000 Grand Prize",
  "prize_details": ["Specific prize 1", "Specific prize 2"],
  "url": "https://exact-url-you-fetched",
  "status": "open",          // or "upcoming" if not yet open
  "categories": ["short-film"], // from: short-film, feature, animation, experimental, documentary, music-video, commercial, advertising
  "ai_tools_allowed": ["Specific tools or Any AI tools"],
  "eligibility": "Who can enter",
  "entry_fee": "Free or exact fee",
  "featured": false,         // true only for $10k+ prizes or major platforms
  "tags": [],
  "location": null,          // or "City, Country"
  "event_date": null         // or "YYYY-MM-DD"
}

STRICT RULES:
- If you cannot find a deadline on the actual page, do NOT include that contest
- If the URL returns 404, do NOT include that contest
- If it's already in the database, do NOT include it
- Return an empty array [] if nothing new is found — that's perfectly fine
- Return ONLY valid JSON array, no other text`

  const userMessage = `Search for new AI film contests using these queries:
1. "AI film festival 2026 submissions open deadline"
2. "generative AI short film contest 2026 prize"
3. "AI filmmaking competition 2026 open call"
4. "site:filmfreeway.com AI film 2026"
5. "Runway Kling Luma Hailuo Pika AI film competition 2026"

For each search: read the results, fetch any pages that look like genuine new AI film contests, verify the page is live, extract the exact deadline and prize, then add to your output JSON if not already in our database.`

  let newContests: Record<string, unknown>[] = []

  try {
    // Use extended thinking + web search via tool use
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: [{ type: 'web_search_20250305', name: 'web_search' }] as any,
    })

    // Extract the final text response which should be JSON
    const finalText = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('')

    // Parse the JSON array from the response
    const jsonMatch = finalText.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed)) {
        // Filter out any that already exist (safety check)
        newContests = parsed.filter((c: Record<string, unknown>) => {
          if (!c.id || existingIds.includes(c.id as string)) return false
          if (existingNames.includes((c.name as string || '').toLowerCase())) return false
          return true
        })
      }
    }
  } catch (err) {
    console.error('[Cron/Research] Claude API error:', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }

  // Write new contests to Supabase
  let addedIds: string[] = []
  if (newContests.length > 0) {
    const { data: upserted, error: upsertErr } = await supabaseAdmin
      .from('contests')
      .upsert(newContests, { onConflict: 'id' })
      .select('id, name')

    if (upsertErr) {
      console.error('[Cron/Research] Upsert failed:', upsertErr.message)
    } else {
      addedIds = (upserted ?? []).map(c => c.id)
      console.log(`[Cron/Research] Added ${addedIds.length} new contests:`, addedIds)
    }
  }

  // Send subscriber alerts for new contests
  if (addedIds.length > 0) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifilmcontests.com'
      await fetch(`${baseUrl}/api/notify-new-contests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
        body: JSON.stringify({ contestIds: addedIds }),
      })
    } catch (err) {
      console.error('[Cron/Research] Notification failed:', err)
    }
  }

  return NextResponse.json({
    ok: true,
    date: today,
    newContestsFound: newContests.length,
    addedToDb: addedIds,
  })
}
