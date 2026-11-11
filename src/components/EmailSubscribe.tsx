'use client'

import { useId, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isBlockedEmailDomain } from '@/lib/blocked-email-domains'

const EMAIL_SYNTAX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Burnt orange, the ground's one alarm colour — already reserved for a deadline
   inside seven days and for this block's own kicker. Nothing else on paper uses it. */
const ALARM = '#C2410C'
const ALARM_RING = '0 0 0 3px rgba(194,65,12,0.12)'

/* Which control the form is refusing over. `null` covers the two failures no
   control on the form can fix — a dead network, an error back from the API — so
   those keep today's behaviour exactly: the block prints, nothing is marked. */
type ErrorField = 'email' | 'consent' | null

function SubscribeError({ message, id }: { message: string; id?: string }) {
  return (
    <div id={id} role="alert" style={{ marginTop: 12, borderLeft: `2px solid ${ALARM}`, padding: '1px 0 1px 12px' }}>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: ALARM, marginBottom: 3 }}>
        Not subscribed yet
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.5, color: '#3E3A33', margin: 0 }}>{message}</p>
    </div>
  )
}

export default function EmailSubscribe({ compact = false, openCount }: { compact?: boolean; openCount?: number }) {
  const router = useRouter()
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [consent, setConsent] = useState(false)
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [field,   setField]   = useState<ErrorField>(null)

  /* Several of these render on one page (the homepage has the hero rail and the
     subscribe band), so the alert needs an id unique to its own instance before
     an input is allowed to point at it. */
  const alertId = useId()
  const emailRef   = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)

  const fail = (where: ErrorField, text: string) => {
    setStatus('error')
    setMessage(text)
    setField(where)
    /* A refused press should put the cursor on the control that refused it.
       Until now the only answer was a paragraph below the button, which on the
       full form sits two rows under the checkbox it is talking about. */
    if (where === 'email') emailRef.current?.focus()
    if (where === 'consent') consentRef.current?.focus()
  }

  /* The checkbox already cleared the error the moment you ticked it. The email
     field did not, so a corrected address sat under a block still calling it
     invalid. Same rule for both now, and only for the control being blamed. */
  const clearIfBlaming = (where: Exclude<ErrorField, null>) => {
    if (status === 'error' && field === where) { setStatus('idle'); setMessage(''); setField(null) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanEmail = email.trim()
    if (!cleanEmail) return
    if (!EMAIL_SYNTAX.test(cleanEmail)) {
      fail('email', 'Please enter a valid email address.')
      return
    }
    if (isBlockedEmailDomain(cleanEmail)) {
      fail('email', "That looks like a phone carrier's text-message gateway, which can't receive a real email. Please use a regular email address.")
      return
    }
    if (!consent) {
      fail('consent', 'Please agree to receive email alerts to continue.')
      return
    }
    setStatus('loading')
    setMessage('')
    setField(null)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          consent,
          source: typeof window !== 'undefined' ? window.location.pathname : null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        // Send them somewhere with contests on it, not a thank-you line —
        // see /subscribed, which shows the next open contests instead.
        router.push('/subscribed')
      } else {
        fail(null, data.error || 'Something went wrong.')
      }
    } catch {
      fail(null, 'Network error. Please try again.')
    }
  }

  const emailInvalid   = status === 'error' && field === 'email'
  const consentInvalid = status === 'error' && field === 'consent'

  /* Inline, so it beats `.input:focus`'s indigo: a field that is both focused
     and refused should read as one state, not two. Clearing the error hands the
     field straight back to the stylesheet's indigo ring. */
  const invalidInput = emailInvalid ? { borderColor: ALARM, boxShadow: ALARM_RING } : null
  const invalidBox   = consentInvalid ? { outline: `1.5px solid ${ALARM}`, outlineOffset: 2 } : null
  const errorProps = (invalid: boolean) =>
    invalid ? { 'aria-invalid': true as const, 'aria-describedby': alertId } : {}

  if (compact) {
    return (
      <div className="w-full">
        {typeof openCount === 'number' && (
          <p style={{ fontSize: 12, color: '#6F6A61', marginBottom: 10, lineHeight: 1.55 }}>
            New contests within a day of opening, a last call before deadlines close, and the free creator pack —{' '}
            <strong style={{ color: '#1B1916' }}>{openCount} open right now</strong>.
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {/* The button keeps its 100px and the field takes whatever is left, which
              on a phone is not enough: measured on the live site at 390px the field
              is 200px wide, 174px of that text area, and a 21-character address sets
              at 176px — you cannot read back what you typed before you send it.
              What decides this is the row's width, not the viewport's, because the
              same form sits in a 451px rail on desktop. So it wraps on a flex basis
              rather than a media query: the field asks for 18rem, and any row that
              cannot seat 18rem + gap + button drops the button onto its own line and
              lets the field take the whole width. That is every phone placement
              (308px on a contest page, 335px on a hub, 350px in a guide) and no
              desktop one (451px and up still seat the pair, unchanged). */}
          <div className="flex flex-wrap gap-2">
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); clearIfBlaming('email') }}
              placeholder="your@email.com"
              aria-label="Email address"
              required
              className="input"
              {...errorProps(emailInvalid)}
              style={{ padding: '9px 12px', fontSize: '13px', flex: '1 1 18rem', minWidth: 0, ...invalidInput }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn"
              style={{ flex: '0 0 auto' }}
            >
              {status === 'loading' ? '...' : 'Get the pack'}
            </button>
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
            <input
              ref={consentRef}
              type="checkbox"
              checked={consent}
              onChange={e => { setConsent(e.target.checked); clearIfBlaming('consent') }}
              {...errorProps(consentInvalid)}
              style={{ marginTop: '2px', accentColor: '#4f46e5', flexShrink: 0, ...invalidBox }}
            />
            {/* Grey is the right weight for a line nobody should have to read
                twice. The moment it is the one thing holding the form up, it
                stops being that line. */}
            <span style={{ fontSize: '11px', color: consentInvalid ? '#1B1916' : '#6F6A61', lineHeight: 1.5 }}>
              I agree to receive email alerts about AI film contests. Unsubscribe anytime.
            </span>
          </label>
        </form>
        {status === 'error' && <SubscribeError id={alertId} message={message} />}
      </div>
    )
  }

  // Full form
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="First name"
          aria-label="First name"
          className="input"
        />
        <input
          ref={emailRef}
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); clearIfBlaming('email') }}
          placeholder="Email address"
          aria-label="Email address"
          required
          className="input"
          {...errorProps(emailInvalid)}
          style={invalidInput ?? undefined}
        />

        {/* Consent checkbox — unchecked by default, required for GDPR */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', cursor: 'pointer', padding: '2px 0' }}>
          <input
            ref={consentRef}
            type="checkbox"
            checked={consent}
            onChange={e => { setConsent(e.target.checked); clearIfBlaming('consent') }}
            {...errorProps(consentInvalid)}
            style={{ marginTop: '2px', accentColor: '#4f46e5', flexShrink: 0, width: '14px', height: '14px', ...invalidBox }}
          />
          <span style={{ fontSize: '12px', color: consentInvalid ? '#1B1916' : '#6F6A61', lineHeight: 1.55 }}>
            I agree to receive email alerts about AI film contests.{' '}
            <a href="/unsubscribe" style={{ color: consentInvalid ? '#1B1916' : '#6F6A61', textDecoration: 'underline', textUnderlineOffset: 2 }}>
              Unsubscribe anytime.
            </a>
          </span>
        </label>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn w-full justify-center"
          style={{ padding: '11px 18px' }}
        >
          {status === 'loading' ? (
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending your link...
            </span>
          ) : 'Get alerts + the free creator pack'}
        </button>
      </form>
      {status === 'error' && <SubscribeError id={alertId} message={message} />}
    </div>
  )
}
