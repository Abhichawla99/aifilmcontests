import { NextRequest, NextResponse } from 'next/server'
import { unsubscribeByToken, unsubscribeByEmail } from '@/lib/subscribers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, email } = body

    if (token) {
      const result = await unsubscribeByToken(token)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    }

    if (email) {
      const result = await unsubscribeByEmail(email)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    }

    return NextResponse.json({ error: 'token or email required' }, { status: 400 })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
