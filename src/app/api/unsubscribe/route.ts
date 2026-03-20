import { NextRequest, NextResponse } from 'next/server'
import { unsubscribeByToken, unsubscribeByEmail } from '@/lib/subscribers'

// Standard POST — from our own unsubscribe form (JSON body)
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    // RFC 8058 one-click unsubscribe — Gmail POSTs application/x-www-form-urlencoded
    // with body "List-Unsubscribe=One-Click" and the token in the URL query string
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const token = request.nextUrl.searchParams.get('token')
      if (token) {
        const result = await unsubscribeByToken(token)
        // Gmail expects a 200 response — it ignores the body
        return new NextResponse(null, { status: result.success ? 200 : 400 })
      }
      return new NextResponse(null, { status: 400 })
    }

    // Our own form sends JSON
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

// GET — for manual one-click links in email clients that use GET instead of POST
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/unsubscribe', request.url))
  }
  await unsubscribeByToken(token)
  return NextResponse.redirect(new URL('/unsubscribe?done=1', request.url))
}
