import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import AdminDashboard from './AdminDashboard'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — AI Film Contests', robots: 'noindex' }

export default async function AdminPage() {
  const [
    { data: contests },
    { count: totalSubs },
    { count: confirmedSubs },
  ] = await Promise.all([
    supabaseAdmin
      .from('contests')
      .select('id, name, organizer, status, deadline, prize, featured, url, created_at')
      .order('status')
      .order('deadline'),
    supabaseAdmin.from('subscribers').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('subscribers').select('*', { count: 'exact', head: true }).eq('confirmed', true),
  ])

  const open = (contests ?? []).filter(c => c.status === 'open').length
  const upcoming = (contests ?? []).filter(c => c.status === 'upcoming').length
  const closed = (contests ?? []).filter(c => c.status === 'closed').length

  return (
    <AdminDashboard
      contests={contests ?? []}
      stats={{ open, upcoming, closed, total: (contests ?? []).length, totalSubs: totalSubs ?? 0, confirmedSubs: confirmedSubs ?? 0 }}
    />
  )
}
