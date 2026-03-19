import { supabaseAdmin } from './supabase'

export interface Subscriber {
  email: string
  name: string | null
  createdAt: string
  confirmed: boolean
}

export async function getSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .select('email, name, created_at, confirmed')
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
  }))
}

export async function addSubscriber(
  email: string,
  name: string | null = null,
): Promise<{ success: boolean; message: string }> {
  const { error } = await supabaseAdmin
    .from('subscribers')
    .insert({ email: email.toLowerCase().trim(), name, confirmed: true })

  if (error) {
    if (error.code === '23505') {
      return { success: false, message: 'This email is already subscribed.' }
    }
    console.error('[Supabase] Failed to add subscriber:', error.message)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }

  return { success: true, message: "You're subscribed. We'll alert you when new contests open." }
}
