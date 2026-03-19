import { supabaseAdmin } from './supabase'

export interface Subscriber {
  email: string
  createdAt: string
  confirmed: boolean
}

export async function getSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .select('email, created_at, confirmed')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Supabase] Failed to fetch subscribers:', error.message)
    return []
  }

  return data.map(row => ({
    email: row.email,
    createdAt: row.created_at,
    confirmed: row.confirmed,
  }))
}

export async function addSubscriber(email: string): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.toLowerCase().trim()

  const { error } = await supabaseAdmin
    .from('subscribers')
    .insert({ email: normalizedEmail, confirmed: true })

  if (error) {
    // Postgres unique violation code
    if (error.code === '23505') {
      return { success: false, message: 'This email is already subscribed.' }
    }
    console.error('[Supabase] Failed to add subscriber:', error.message)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }

  return { success: true, message: 'Successfully subscribed! You\'ll get alerts for new contests.' }
}
