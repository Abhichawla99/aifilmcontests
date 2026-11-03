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

/** Where a signup stands after the form: new, or already here but never
    confirmed (or unsubscribed and back), which both get a confirm link. */
export type SignupState = 'new' | 'pending' | 'returning'

/** A confirm email is sent at most once in this window, however often the form is sent. */
const CONFIRM_RESEND_MINUTES = 10

// The confirm columns arrive with supabase/migrations/2026-11-03-confirm.sql.
// Until it has run, writes leave them out rather than breaking signup.
const isMissingColumn = (msg: string) => /confirm|pack_sent|schema cache|column/i.test(msg)

/**
 * A new signup is pending until they click the link in the confirm email
 * (buildConfirmEmail); nothing else is sent to them before that. sendConfirm
 * says whether to send that email now.
 */
export async function addSubscriber(
  email: string,
  name: string | null = null,
  consentGivenAt: string = new Date().toISOString(),
  source: string | null = null,
): Promise<{ success: boolean; message: string; token?: string; state?: SignupState; sendConfirm?: boolean }> {
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

  const now = new Date().toISOString()
  const sent = { success: true, message: 'Check your inbox and click the link to get your creator pack.' }
  const base = {
    email: cleanEmail,
    name,
    confirmed: false,
    consent_given_at: consentGivenAt,
    confirm_sent_at: now,
  }
  // `source` = the page they signed up on (e.g. /topics/best-ai-film-festivals-for-pika-users).
  // Each retry drops a column an older database may not have yet.
  const attempts: Array<Record<string, unknown>> = [
    source ? { ...base, source: source.slice(0, 200) } : base,
    base,
    { email: cleanEmail, name, confirmed: false, consent_given_at: consentGivenAt },
  ]
  let data: { unsubscribe_token: string | null } | null = null
  let error: { code?: string; message: string } | null = null
  for (const row of attempts) {
    ;({ data, error } = await supabaseAdmin.from('subscribers').insert(row).select('unsubscribe_token').single())
    if (!error || !isMissingColumn(error.message)) break
  }

  if (error?.code === '23505') return existingSignup(cleanEmail, name, now, sent)
  if (error) {
    console.error('[Supabase] Failed to add subscriber:', error.message)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
  return { ...sent, token: data?.unsubscribe_token ?? undefined, state: 'new', sendConfirm: true }
}

/** The email is already in the table. On the list: say so. Pending, or
    unsubscribed and back: another confirm link, unless one just went out. */
async function existingSignup(
  email: string,
  name: string | null,
  now: string,
  sent: { success: boolean; message: string },
): Promise<{ success: boolean; message: string; token?: string; state?: SignupState; sendConfirm?: boolean }> {
  const { data: row, error } = await supabaseAdmin
    .from('subscribers')
    .select('confirmed, confirmed_at, confirm_sent_at, unsubscribe_token')
    .eq('email', email)
    .maybeSingle()
  if (error || !row) {
    if (error) console.error('[Supabase] Failed to read existing subscriber:', error.message)
    return { success: false, message: 'This email is already subscribed.' }
  }
  if (row.confirmed) return { success: false, message: "You're already on the list." }

  const state: SignupState = row.confirmed_at ? 'returning' : 'pending'
  const last = row.confirm_sent_at ? new Date(row.confirm_sent_at).getTime() : 0
  if (Date.now() - last < CONFIRM_RESEND_MINUTES * 60_000) {
    return { ...sent, token: row.unsubscribe_token ?? undefined, state, sendConfirm: false }
  }
  const { error: upErr } = await supabaseAdmin
    .from('subscribers')
    .update(name ? { confirm_sent_at: now, name } : { confirm_sent_at: now })
    .eq('email', email)
  if (upErr) console.error('[Supabase] Failed to stamp confirm_sent_at:', upErr.message)
  return { ...sent, token: row.unsubscribe_token ?? undefined, state, sendConfirm: true }
}

/**
 * The click in the confirm email. Puts them on the list and says whether the
 * creator pack still has to go out. A second click is fine: it changes nothing.
 */
export async function confirmByToken(token: string): Promise<
  | { success: true; email: string; name: string | null; token: string; packSent: boolean }
  | { success: false; message: string }
> {
  const { data: row, error } = await supabaseAdmin
    .from('subscribers')
    .select('email, name, confirmed, confirmed_at, pack_sent_at, unsubscribe_token')
    .eq('unsubscribe_token', token)
    .maybeSingle()
  if (error || !row) {
    if (error) console.error('[Supabase] confirm lookup failed:', error.message)
    return { success: false, message: "That link doesn't match a signup. Sign up again and we'll send a new one." }
  }
  if (!row.confirmed) {
    const { error: upErr } = await supabaseAdmin
      .from('subscribers')
      .update({ confirmed: true, confirmed_at: row.confirmed_at ?? new Date().toISOString() })
      .eq('unsubscribe_token', token)
    if (upErr) {
      console.error('[Supabase] confirm failed:', upErr.message)
      return { success: false, message: 'Something went wrong. Try the link again in a minute.' }
    }
  }
  return { success: true, email: row.email, name: row.name ?? null, token, packSent: !!row.pack_sent_at }
}

/** The creator pack went out to these addresses. */
export async function markPackSent(emails: string[]): Promise<void> {
  if (!emails.length) return
  const { error } = await supabaseAdmin
    .from('subscribers')
    .update({ pack_sent_at: new Date().toISOString() })
    .in('email', emails)
  if (error) console.error('[Supabase] markPackSent failed:', error.message)
}

/** Signups from one to seven days ago who never clicked and haven't had the
    one reminder. Younger than a day is too soon; older than a week, let go. */
export async function pendingForReminder(now = new Date()): Promise<Array<{ email: string; name: string | null; token: string }>> {
  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .select('email, name, unsubscribe_token')
    .eq('confirmed', false)
    .is('confirmed_at', null)
    .is('confirm_reminded_at', null)
    .lt('created_at', new Date(now.getTime() - 20 * 3_600_000).toISOString())
    .gt('created_at', new Date(now.getTime() - 7 * 86_400_000).toISOString())
  if (error) {
    console.error('[Supabase] pending reminder read failed:', error.message)
    return []
  }
  return (data ?? [])
    .filter(r => r.unsubscribe_token)
    .map(r => ({ email: r.email, name: r.name ?? null, token: r.unsubscribe_token as string }))
}

export async function markReminded(emails: string[]): Promise<void> {
  if (!emails.length) return
  const { error } = await supabaseAdmin
    .from('subscribers')
    .update({ confirm_reminded_at: new Date().toISOString() })
    .in('email', emails)
  if (error) console.error('[Supabase] markReminded failed:', error.message)
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
