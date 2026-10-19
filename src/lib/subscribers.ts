import { promises as dns } from 'node:dns'
import { unstable_cache } from 'next/cache'
import { supabaseAdmin } from './supabase'
import { isBlockedEmailDomain } from './blocked-email-domains'

// Nonexistent or mail-less domains (typos like "ruseashighscholl.com") resolve
// to no MX records at all — reject those before they ever reach the send queue.
// A DNS hiccup (timeout, SERVFAIL) is not evidence the domain is bad, so only
// ENOTFOUND/ENODATA (the resolver actually answered "no mail server") block
// signup; anything else fails open rather than turning a real address away.
async function domainAcceptsMail(domain: string): Promise<boolean> {
  try {
    const records = await dns.resolveMx(domain)
    return records.length > 0
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code
    if (code === 'ENOTFOUND' || code === 'ENODATA') return false
    return true
  }
}

// How many confirmed subscribers there are, for copy like "630+ AI filmmakers
// get our alerts". Decoration, so it is read at most once every fifteen
// minutes and shared through Next's data cache: a database that will not
// answer costs the first caller five seconds and everyone else nothing until
// the next window. Null means the count could not be read; print no number
// rather than a zero.
//
// A plain fetch, on purpose. An explicit `cache: 'no-store'` inside an
// unstable_cache callback counts as dynamic usage while a page is being
// statically generated (see src/lib/supabase.ts), and this has to stay safe
// to call from any page, static or not.
export const getConfirmedSubscriberCount = unstable_cache(
  async (): Promise<number | null> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return null
    try {
      const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/subscribers?select=id&confirmed=eq.true`, {
        method: 'HEAD',
        headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'count=exact' },
        signal: AbortSignal.timeout(5_000),
      })
      // PostgREST answers a counted HEAD with "Content-Range: */632" (or "0-24/632").
      const total = Number(res.headers.get('content-range')?.split('/')[1])
      return res.ok && Number.isFinite(total) ? total : null
    } catch (err) {
      console.error('subscriber count failed:', err instanceof Error ? err.message : String(err))
      return null
    }
  },
  ['subscribers', 'confirmed-count'],
  { revalidate: 900, tags: ['subscribers'] },
)

export interface Subscriber {
  email: string
  name: string | null
  createdAt: string
  confirmed: boolean
  unsubscribeToken: string | null
}

export async function getSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .select('email, name, created_at, confirmed, unsubscribe_token')
    .eq('confirmed', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Supabase] Failed to fetch subscribers:', error.message)
    return []
  }

  return data.map(row => ({
    email: row.email,
    name: row.name ?? null,
    createdAt: row.created_at,
    confirmed: row.confirmed,
    unsubscribeToken: row.unsubscribe_token ?? null,
  }))
}

export async function addSubscriber(
  email: string,
  name: string | null = null,
  consentGivenAt: string = new Date().toISOString(),
  source: string | null = null,
): Promise<{ success: boolean; message: string; token?: string }> {
  const cleanEmail = email.toLowerCase().trim()
  const domain = cleanEmail.split('@')[1]

  if (isBlockedEmailDomain(cleanEmail)) {
    return {
      success: false,
      message: "That looks like a phone carrier's text-message gateway, which can't receive a real email. Please use a regular email address.",
    }
  }
  if (domain && !(await domainAcceptsMail(domain))) {
    return {
      success: false,
      message: "We couldn't find a mail server for that domain — please double-check it for a typo.",
    }
  }

  const base = {
    email: cleanEmail,
    name,
    confirmed: true,
    consent_given_at: consentGivenAt,
  }
  // `source` = the page they signed up on (e.g. /topics/best-ai-film-festivals-for-pika-users).
  // The column only exists after the 2026-09-07 migration, so retry without it.
  let { data, error } = await supabaseAdmin
    .from('subscribers')
    .insert(source ? { ...base, source: source.slice(0, 200) } : base)
    .select('unsubscribe_token')
    .single()
  if (error && source && /source|schema cache|column/i.test(error.message)) {
    ;({ data, error } = await supabaseAdmin
      .from('subscribers')
      .insert(base)
      .select('unsubscribe_token')
      .single())
  }

  if (error) {
    if (error.code === '23505') {
      return { success: false, message: 'This email is already subscribed.' }
    }
    console.error('[Supabase] Failed to add subscriber:', error.message)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }

  return {
    success: true,
    message: "You're subscribed. We'll alert you when new contests open.",
    token: data?.unsubscribe_token ?? undefined,
  }
}

export async function unsubscribeByToken(
  token: string,
): Promise<{ success: boolean; message: string }> {
  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .update({ confirmed: false })
    .eq('unsubscribe_token', token)
    .select('email')
    .single()

  if (error || !data) {
    return { success: false, message: 'Invalid or expired unsubscribe link.' }
  }

  return { success: true, message: `${data.email} has been unsubscribed.` }
}

export async function unsubscribeByEmail(
  email: string,
): Promise<{ success: boolean; message: string }> {
  const { error } = await supabaseAdmin
    .from('subscribers')
    .update({ confirmed: false })
    .eq('email', email.toLowerCase().trim())

  if (error) {
    console.error('[Supabase] Failed to unsubscribe by email:', error.message)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }

  return { success: true, message: "You've been unsubscribed." }
}
