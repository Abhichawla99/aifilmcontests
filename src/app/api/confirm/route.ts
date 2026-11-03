import { NextRequest, NextResponse } from 'next/server'
import { track } from '@vercel/analytics/server'
import { confirmByToken } from '@/lib/subscribers'
import { deliverPack } from '@/lib/pack'

// The click in the confirm email, posted by /confirm once the page has loaded.
// A POST from the page rather than the link itself, so a mail scanner that
// fetches every link in an email doesn't confirm people who never clicked.
export async function POST(request: NextRequest) {
  const { token } = await request.json().catch(() => ({}))
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }
  const result = await confirmByToken(token)
  if (!result.success) return NextResponse.json({ error: result.message }, { status: 404 })

  if (!result.packSent) {
    // Wait for it: Vercel freezes the function once the response goes out.
    const sent = await deliverPack([{ email: result.email, name: result.name, token: result.token }])
      .catch(err => ({ success: false, error: err as unknown }))
    if (!sent.success) console.error('[Pack] send on confirm failed:', sent.error)
    await track('confirm', { pack: sent.success ? 'sent' : 'failed' }).catch(() => {})
  }
  return NextResponse.json({ ok: true, name: result.name })
}
