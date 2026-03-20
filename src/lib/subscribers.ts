import { supabaseAdmin } from './supabase'

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
): Promise<{ success: boolean; message: string; token?: string }> {
  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .insert({
      email: email.toLowerCase().trim(),
      name,
      confirmed: true,
      consent_given_at: consentGivenAt,
    })
    .select('unsubscribe_token')
    .single()

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
