import { NextRequest, NextResponse } from 'next/server'
import { track } from '@vercel/analytics/server'
import { addSubscriber } from '@/lib/subscribers'
import { sendWelcomeEmail, starterPicks } from '@/lib/email'
import { getContestsByStatus } from '@/lib/contests-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, consent, source } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }
    if (!consent) {
      return NextResponse.json({ error: 'You must agree to receive email alerts to subscribe.' }, { status: 400 })
    }

    const safeSource = typeof source === 'string' && source.startsWith('/') ? source.split('?')[0].slice(0, 200) : null
    const result = await addSubscriber(email, name || null, new Date().toISOString(), safeSource)
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 409 })
    }

    // Wait for it: Vercel freezes the function once the response goes out, which
    // was cutting welcome emails off mid-send. A failed email still doesn't fail signup.
    // The contests to start with. A failed read sends the welcome without them.
    const open = await getContestsByStatus('open')
      .catch(err => { console.error('[Email] starter picks failed:', err); return [] })
    const welcome = await sendWelcomeEmail(email, name || null, result.token, starterPicks(open), open.length)
      .catch(err => ({ success: false, error: err }))
    if (!welcome.success) console.error('[Email] Welcome send failed:', welcome.error)

    await track('subscribe', { source: safeSource ?? 'unknown' }).catch(() => {})
    return NextResponse.json({ success: true, message: result.message })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
