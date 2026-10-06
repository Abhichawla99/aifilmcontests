import { promises as dns } from 'node:dns'
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
