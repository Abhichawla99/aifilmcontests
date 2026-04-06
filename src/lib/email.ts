import { Resend } from 'resend'

const FROM_EMAIL = process.env.FROM_EMAIL || 'contests@updates.aifilmcontests.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifilmcontests.com'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder')
}

// ─── Deliverability headers ────────────────────────────────────────────────────
//
// List-Unsubscribe       — tells Gmail/Outlook this is a legitimate list email
//                          and surfaces the native "Unsubscribe" button
// List-Unsubscribe-Post  — RFC 8058: enables Gmail's one-click unsubscribe
//                          Gmail POSTs "List-Unsubscribe=One-Click" to the URL
//
// Together these are the #1 technical signal that keeps email out of spam.

function listUnsubscribeHeaders(unsubUrl: string) {
  return {
    'List-Unsubscribe': `<${unsubUrl}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    'X-Entity-Ref-ID': `aifilmcontests-${Date.now()}`, // prevents Gmail threading all emails together
  }
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const emailBase = `background-color:#09090f;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',sans-serif;margin:0;padding:0;`
const wrap = `max-width:580px;margin:0 auto;padding:40px 24px;`
const wordmark = `<span style="font-size:15px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#4f46e5;font-family:sans-serif;">AI Film Contests</span>`

function hr() {
  return `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:32px 0;">`
}

function footer(unsubscribeLink: string) {
  return `
    <div style="color:#3f3f46;font-size:12px;text-align:center;line-height:1.8;">
      <a href="${SITE_URL}" style="color:#3f3f46;text-decoration:none;">${SITE_URL}</a>
      &nbsp;·&nbsp;
      <a href="${unsubscribeLink}" style="color:#3f3f46;text-decoration:underline;">Unsubscribe</a>
    </div>
  `
}

function unsubscribeUrl(token?: string | null) {
  return token
    ? `${SITE_URL}/unsubscribe?token=${token}`
    : `${SITE_URL}/unsubscribe`
}

function contestCard(c: {
  name: string
  organizer: string
  prize: string
  deadline: string
  description: string
  url: string
}, opts: { isNew?: boolean; daysLeft?: number } = {}) {
  const badge = opts.isNew
    ? `<span style="background:#4f46e5;color:#fff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:2px 8px;border-radius:4px;margin-left:8px;">New</span>`
    : opts.daysLeft != null
    ? `<span style="color:#ef4444;font-size:12px;font-weight:700;margin-left:8px;">🔴 ${opts.daysLeft}d left</span>`
    : ''

  const deadline = new Date(c.deadline).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return `
    <div style="border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px 22px;margin-bottom:12px;">
      <div style="margin-bottom:4px;">
        <span style="color:#71717a;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;">${c.organizer}</span>
        ${badge}
      </div>
      <div style="font-size:17px;font-weight:700;margin-bottom:6px;color:#fff;">${c.name}</div>
      <div style="color:#a1a1aa;font-size:14px;line-height:1.55;margin-bottom:14px;">${c.description}</div>
      <div>
        <span style="color:#4f46e5;font-weight:700;font-size:15px;">${c.prize}</span>
        <span style="color:#52525b;font-size:13px;margin-left:12px;">Due ${deadline}</span>
        &nbsp;&nbsp;
        <a href="${c.url}" style="color:#4f46e5;font-size:13px;font-weight:600;text-decoration:none;">Apply →</a>
      </div>
    </div>`
}

// ─── Welcome email ─────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(
  email: string,
  name?: string | null,
  token?: string | null,
) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Dev] Welcome email → ${email}`)
    return { success: true }
  }

  const firstName = name?.split(' ')[0] ?? null
  const greeting = firstName ? `Hey ${firstName},` : 'Hey,'
  const unsub = unsubscribeUrl(token)

  try {
    await getResend().emails.send({
      from: `AI Film Contests <${FROM_EMAIL}>`,
      to: email,
      subject: "You're on the list — AI Film Contests",
      headers: listUnsubscribeHeaders(unsub),
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${emailBase}">
<div style="${wrap}">

  <div style="margin-bottom:36px;">${wordmark}</div>

  <h1 style="font-size:26px;font-weight:700;margin:0 0 6px 0;line-height:1.25;">${greeting}</h1>
  <h2 style="font-size:26px;font-weight:400;margin:0 0 20px 0;line-height:1.25;color:#a1a1aa;">You're officially on the list.</h2>

  <p style="color:#a1a1aa;font-size:15px;line-height:1.65;margin-bottom:28px;">
    We track every AI film competition and verify them daily against live sources.
    You'll get notified when new ones open and reminded before deadlines close.
  </p>

  <div style="border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px 22px;margin-bottom:24px;">
    <div style="font-size:12px;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:14px;">What you'll receive</div>
    <div style="color:#d4d4d8;font-size:14px;line-height:2.2;">
      ✦&nbsp;&nbsp;Alert when a new contest opens<br>
      ✦&nbsp;&nbsp;Deadline reminder 7 days before close<br>
      ✦&nbsp;&nbsp;Weekly digest every Monday<br>
      ✦&nbsp;&nbsp;No noise — only when something matters
    </div>
  </div>

  <!-- Inbox tip — asking for a reply is the strongest positive signal to Gmail -->
  <div style="border:1px solid rgba(79,70,229,0.3);border-radius:10px;padding:20px 22px;margin-bottom:28px;background:rgba(79,70,229,0.07);">
    <div style="font-size:13px;font-weight:700;color:#818cf8;letter-spacing:0.02em;margin-bottom:8px;">⚡ One quick step — takes 5 seconds</div>
    <p style="color:#d4d4d8;font-size:15px;font-weight:600;margin:0 0 8px 0;line-height:1.4;">
      Reply to this email to make sure every alert lands in your inbox.
    </p>
    <p style="color:#a1a1aa;font-size:14px;line-height:1.65;margin:0 0 10px 0;">
      Even a simple "got it" is enough. Replying tells Gmail and Outlook that you want our emails —
      so future contest alerts skip Promotions and go straight to your <strong style="color:#e4e4e7;">Primary</strong> inbox every time.
    </p>
    <p style="color:#71717a;font-size:13px;line-height:1.6;margin:0;">
      The more you reply, the better your delivery stays. We send updates worth replying to — so keep them coming.
    </p>
  </div>

  <a href="${SITE_URL}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.02em;">Browse Open Contests →</a>

  ${hr()}
  ${footer(unsub)}

</div>
</body>
</html>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('[Email] Welcome failed:', error)
    return { success: false, error }
  }
}

// ─── New contest alert ─────────────────────────────────────────────────────────

export async function sendNewContestAlerts(
  subscribers: string[],
  contests: Array<{
    name: string
    organizer: string
    prize: string
    deadline: string
    url: string
    description: string
  }>
) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Dev] New contest alert → ${subscribers.length} subs, ${contests.length} contests`)
    return { success: true }
  }
  if (!subscribers.length || !contests.length) return { success: true }

  const plural = contests.length > 1
  const subject = plural
    ? `${contests.length} new AI film contests just opened`
    : `New contest: ${contests[0].name}`

  const cards = contests.map(c => contestCard(c, { isNew: true })).join('')
  const unsub = unsubscribeUrl()

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${emailBase}">
<div style="${wrap}">
  <div style="margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;">
    ${wordmark}
    <span style="background:#4f46e5;color:#fff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:4px;">${plural ? contests.length + ' New' : '1 New'}</span>
  </div>
  <h1 style="font-size:22px;font-weight:700;margin:0 0 6px 0;">${plural ? `${contests.length} new contests just opened` : 'A new contest just opened'}</h1>
  <p style="color:#71717a;font-size:14px;margin:0 0 24px 0;">Verified against live sources today.</p>
  ${cards}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="color:#4f46e5;font-size:13px;font-weight:600;text-decoration:none;">View all open contests →</a>
  </div>
  ${hr()}
  ${footer(unsub)}
</div>
</body>
</html>`

  try {
    const batchSize = 49 // 1 in `to` + 49 in `bcc` = 50 per Resend batch
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      const { data, error } = await getResend().emails.send({
        from: `AI Film Contests <${FROM_EMAIL}>`,
        to: batch[0],
        bcc: batch.length > 1 ? batch.slice(1) : undefined,
        subject,
        headers: listUnsubscribeHeaders(unsub),
        html,
      })
      if (error) {
        console.error('[Email] Contest alert Resend error:', error)
        return { success: false, error }
      }
      console.log('[Email] Contest alert sent, id:', data?.id)
    }
    return { success: true, sent: subscribers.length }
  } catch (error) {
    console.error('[Email] Contest alert failed:', error)
    return { success: false, error }
  }
}

// ─── Deadline reminder (7 days) ────────────────────────────────────────────────

export async function sendDeadlineReminders(
  subscribers: string[],
  urgentContests: Array<{
    name: string
    organizer: string
    prize: string
    deadline: string
    url: string
    description: string
    daysLeft: number
  }>
) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Dev] Deadline reminder → ${subscribers.length} subs, ${urgentContests.length} contests`)
    return { success: true }
  }
  if (!subscribers.length || !urgentContests.length) return { success: true }

  const sorted = [...urgentContests].sort((a, b) => a.daysLeft - b.daysLeft)
  const subject = sorted.length === 1
    ? `⏰ ${sorted[0].daysLeft} days left: ${sorted[0].name}`
    : `⏰ ${sorted.length} contests closing this week`

  const cards = sorted.map(c => contestCard(c, { daysLeft: c.daysLeft })).join('')
  const unsub = unsubscribeUrl()

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${emailBase}">
<div style="${wrap}">
  <div style="margin-bottom:28px;">${wordmark}</div>
  <h1 style="font-size:22px;font-weight:700;margin:0 0 6px 0;">${sorted.length === 1 ? 'This contest closes soon' : `${sorted.length} contests closing this week`}</h1>
  <p style="color:#71717a;font-size:14px;margin:0 0 24px 0;">Don't miss your window to submit.</p>
  ${cards}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="color:#4f46e5;font-size:13px;font-weight:600;text-decoration:none;">See all deadlines →</a>
  </div>
  ${hr()}
  ${footer(unsub)}
</div>
</body>
</html>`

  try {
    const batchSize = 49
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      const { data, error } = await getResend().emails.send({
        from: `AI Film Contests <${FROM_EMAIL}>`,
        to: batch[0],
        bcc: batch.length > 1 ? batch.slice(1) : undefined,
        subject,
        headers: listUnsubscribeHeaders(unsub),
        html,
      })
      if (error) {
        console.error('[Email] Deadline reminder Resend error:', error)
        return { success: false, error }
      }
      console.log('[Email] Deadline reminder sent, id:', data?.id)
    }
    return { success: true, sent: subscribers.length }
  } catch (error) {
    console.error('[Email] Deadline reminder failed:', error)
    return { success: false, error }
  }
}

// ─── 3-day expiring contest alert ──────────────────────────────────────────────

export async function sendExpiringContestAlerts(
  subscribers: string[],
  expiringContests: Array<{
    name: string
    organizer: string
    prize: string
    deadline: string
    url: string
    description: string
    daysLeft: number
  }>
) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Dev] Expiring alert → ${subscribers.length} subs, ${expiringContests.length} contests`)
    return { success: true }
  }
  if (!subscribers.length || !expiringContests.length) return { success: true }

  const sorted = [...expiringContests].sort((a, b) => a.daysLeft - b.daysLeft)
  const subject = sorted.length === 1
    ? `🚨 ${sorted[0].daysLeft}d left to enter: ${sorted[0].name}`
    : `🚨 ${sorted.length} contests closing in 3 days`

  const cards = sorted.map(c => contestCard(c, { daysLeft: c.daysLeft })).join('')
  const unsub = unsubscribeUrl()

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${emailBase}">
<div style="${wrap}">
  <div style="margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;">
    ${wordmark}
    <span style="background:#dc2626;color:#fff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:4px;">Closing Soon</span>
  </div>
  <h1 style="font-size:22px;font-weight:700;margin:0 0 6px 0;">${sorted.length === 1 ? 'Last chance — this contest closes in 3 days' : `${sorted.length} contests are about to close`}</h1>
  <p style="color:#ef4444;font-size:14px;font-weight:600;margin:0 0 24px 0;">Submit now or miss the deadline entirely.</p>
  ${cards}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.02em;">Submit before it's too late →</a>
  </div>
  ${hr()}
  ${footer(unsub)}
</div>
</body>
</html>`

  try {
    const batchSize = 49
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      const { data, error } = await getResend().emails.send({
        from: `AI Film Contests <${FROM_EMAIL}>`,
        to: batch[0],
        bcc: batch.length > 1 ? batch.slice(1) : undefined,
        subject,
        headers: listUnsubscribeHeaders(unsub),
        html,
      })
      if (error) {
        console.error('[Email] Expiring alert Resend error:', error)
        return { success: false, error }
      }
      console.log('[Email] Expiring alert sent, id:', data?.id)
    }
    return { success: true, sent: subscribers.length }
  } catch (error) {
    console.error('[Email] Expiring alert failed:', error)
    return { success: false, error }
  }
}

// ─── Weekly digest (Mondays) ───────────────────────────────────────────────────

export async function sendWeeklyDigest(
  subscribers: string[],
  openContests: Array<{
    name: string
    organizer: string
    prize: string
    deadline: string
    url: string
    description: string
  }>
) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Dev] Weekly digest → ${subscribers.length} subs, ${openContests.length} open`)
    return { success: true }
  }
  if (!subscribers.length || !openContests.length) return { success: true }

  const sorted = [...openContests].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  )
  const subject = `${sorted.length} AI film contest${sorted.length !== 1 ? 's' : ''} open right now`
  const cards = sorted.map(c => contestCard(c)).join('')
  const unsub = unsubscribeUrl()

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${emailBase}">
<div style="${wrap}">
  <div style="margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;">
    ${wordmark}
    <span style="color:#52525b;font-size:12px;">Weekly digest</span>
  </div>
  <h1 style="font-size:22px;font-weight:700;margin:0 0 6px 0;">${sorted.length} contest${sorted.length !== 1 ? 's' : ''} open right now</h1>
  <p style="color:#71717a;font-size:14px;margin:0 0 24px 0;">Sorted by deadline. All verified against live sources.</p>
  ${cards}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 26px;border-radius:8px;font-size:14px;font-weight:600;">View all contests →</a>
  </div>
  ${hr()}
  ${footer(unsub)}
</div>
</body>
</html>`

  try {
    const batchSize = 49
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      const { data, error } = await getResend().emails.send({
        from: `AI Film Contests <${FROM_EMAIL}>`,
        to: batch[0],
        bcc: batch.length > 1 ? batch.slice(1) : undefined,
        subject,
        headers: listUnsubscribeHeaders(unsub),
        html,
      })
      if (error) {
        console.error('[Email] Weekly digest Resend error:', error)
        return { success: false, error }
      }
      console.log('[Email] Weekly digest sent, id:', data?.id)
    }
    return { success: true, sent: subscribers.length }
  } catch (error) {
    console.error('[Email] Weekly digest failed:', error)
    return { success: false, error }
  }
}
