import { NextRequest, NextResponse } from 'next/server'
import { addSubscriber } from '@/lib/subscribers'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, consent } = body

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

    const result = await addSubscriber(email, name || null, new Date().toISOString())
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 409 })
    }

    // Non-blocking — don't let email failure break signup
    sendWelcomeEmail(email, name || null, result.token).catch(err =>
      console.error('[Email] Welcome send failed:', err)
    )

    return NextResponse.json({ success: true, message: result.message })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
