import { NextRequest, NextResponse } from 'next/server'
import { addSubscriber } from '@/lib/subscribers'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const result = await addSubscriber(email, name || null)
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 409 })
    }

    await sendWelcomeEmail(email, name || null)
    return NextResponse.json({ success: true, message: result.message })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
