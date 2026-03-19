import { Resend } from 'resend'

const FROM_EMAIL = process.env.FROM_EMAIL || 'contests@aifilmcontests.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifilmcontests.com'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder')
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const emailBase = `
  background-color: #09090f;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
  -webkit-text-size-adjust: 100%;
`

const container = `
  max-width: 580px;
  margin: 0 auto;
  padding: 40px 24px;
`

const rule = `
  border: none;
  border-top: 1px solid rgba(255,255,255,0.07);
  margin: 32px 0;
`

const footer = `
  color: #3f3f46;
  font-size: 12px;
  line-height: 1.7;
  text-align: center;
`

const badge = (label: string, color: string) => `
  <span style="display:inline-block; background:${color}; color:#fff; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:3px 10px; border-radius:4px;">${label}</span>
`

function contestCard(contest: {
  name: string
  organizer: string
  prize: string
  deadline: string
  description: string
  url: string
  daysLeft?: number
  isNew?: boolean
  isUrgent?: boolean
}) {
  const urgentBadge = contest.isUrgent
    ? `<span style="color:#ef4444; font-size:12px; font-weight:700; margin-left:8px;">🔴 ${contest.daysLeft}d left</span>`
    : contest.isNew
    ? badge('New', '#4f46e5')
    : ''

  return `
    <div style="border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:20px 22px; margin-bottom:12px;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
        <span style="color:#71717a; font-size:12px; letter-spacing:0.04em; text-transform:uppercase;">${contest.organizer}</span>
        <span style="color:#a1a1aa; font-size:12px;">${urgentBadge}</span>
      </div>
      <div style="font-size:17px; font-weight:700; margin-bottom:6px; color:#fff;">${contest.name}</div>
      <div style="color:#a1a1aa; font-size:14px; line-height:1.55; margin-bottom:14px;">${contest.description}</div>
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <div>
          <span style="color:#4f46e5; font-weight:700; font-size:15px;">${contest.prize}</span>
          <span style="color:#52525b; font-size:13px; margin-left:12px;">Due ${new Date(contest.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <a href="${contest.url}" style="color:#4f46e5; font-size:13px; font-weight:600; text-decoration:none;">Apply →</a>
      </div>
    </div>
  `
}

// ─── Welcome email ─────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(email: string, name?: string | null) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Dev] Welcome email → ${email}`)
    return { success: true }
  }

  const firstName = name?.split(' ')[0] ?? null
  const greeting = firstName ? `Hey ${firstName},` : 'Hey,'

  try {
    await getResend().emails.send({
      from: `AI Film Contests <${FROM_EMAIL}>`,
      to: email,
      subject: 'You\'re on the list — AI Film Contests',
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${emailBase}">
<div style="${container}">

  <div style="margin-bottom:36px;">
    <span style="font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#4f46e5;">AI Film Contests</span>
  </div>

  <h1 style="font-size:26px; font-weight:700; margin:0 0 8px 0; line-height:1.25;">${greeting}</h1>
  <h2 style="font-size:26px; font-weight:700; margin:0 0 20px 0; line-height:1.25; color:#a1a1aa;">You're officially on the list.</h2>

  <p style="color:#a1a1aa; font-size:15px; line-height:1.65; margin-bottom:28px;">
    We track every AI film competition, festival, and open call — and verify them daily against live sources. You'll get notified when new ones open, and reminded before deadlines close.
  </p>

  <div style="border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:20px 22px; margin-bottom:28px;">
    <div style="font-size:13px; font-weight:600; color:#71717a; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:14px;">What you'll receive</div>
    <div style="color:#d4d4d8; font-size:14px; line-height:2.1;">
      ✦ &nbsp;Alert when a new contest opens<br>
      ✦ &nbsp;Deadline reminder 7 days before close<br>
      ✦ &nbsp;Weekly digest every Monday (open contests only)<br>
      ✦ &nbsp;No noise — only when something matters
    </div>
  </div>

  <a href="${SITE_URL}" style="display:inline-block; background:#4f46e5; color:#fff; text-decoration:none; padding:13px 28px; border-radius:8px; font-size:14px; font-weight:600; letter-spacing:0.02em;">Browse Open Contests →</a>

  <hr style="${rule}">
  <div style="${footer}">
    <a href="${SITE_URL}" style="color:#3f3f46; text-decoration:none;">${SITE_URL}</a> &nbsp;·&nbsp; Reply "unsubscribe" to opt out
  </div>

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
    console.log(`[Dev] New contest alert → ${subscribers.length} subscribers, ${contests.length} contests`)
    return { success: true }
  }
  if (!subscribers.length || !contests.length) return { success: true }

  const plural = contests.length > 1
  const subject = plural
    ? `${contests.length} new AI film contests just opened`
    : `New contest: ${contests[0].name}`

  const cards = contests.map(c => contestCard({ ...c, isNew: true })).join('')

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${emailBase}">
<div style="${container}">

  <div style="margin-bottom:28px; display:flex; align-items:center; justify-content:space-between;">
    <span style="font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#4f46e5;">AI Film Contests</span>
    ${badge(plural ? `${contests.length} New` : '1 New', '#4f46e5')}
  </div>

  <h1 style="font-size:22px; font-weight:700; margin:0 0 6px 0;">
    ${plural ? `${contests.length} new contests just opened` : 'A new contest just opened'}
  </h1>
  <p style="color:#71717a; font-size:14px; margin:0 0 24px 0;">Verified against live sources today.</p>

  ${cards}

  <div style="text-align:center; margin-top:24px;">
    <a href="${SITE_URL}" style="color:#4f46e5; font-size:13px; font-weight:600; text-decoration:none;">View all open contests →</a>
  </div>

  <hr style="${rule}">
  <div style="${footer}">
    <a href="${SITE_URL}" style="color:#3f3f46; text-decoration:none;">${SITE_URL}</a> &nbsp;·&nbsp; Reply "unsubscribe" to opt out
  </div>

</div>
</body>
</html>
  `

  try {
    // Batch in 50s (Resend limit)
    const batchSize = 50
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      await getResend().emails.send({
        from: `AI Film Contests <${FROM_EMAIL}>`,
        to: FROM_EMAIL,
        bcc: batch,
        subject,
        html,
      })
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
    console.log(`[Dev] Deadline reminder → ${subscribers.length} subscribers, ${urgentContests.length} contests`)
    return { success: true }
  }
  if (!subscribers.length || !urgentContests.length) return { success: true }

  const subject = urgentContests.length === 1
    ? `⏰ ${urgentContests[0].daysLeft} days left: ${urgentContests[0].name}`
    : `⏰ ${urgentContests.length} contests closing this week`

  const cards = urgentContests
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .map(c => contestCard({ ...c, isUrgent: true }))
    .join('')

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${emailBase}">
<div style="${container}">

  <div style="margin-bottom:28px;">
    <span style="font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#4f46e5;">AI Film Contests</span>
  </div>

  <h1 style="font-size:22px; font-weight:700; margin:0 0 6px 0;">
    ${urgentContests.length === 1 ? 'This contest closes soon' : `${urgentContests.length} contests closing this week`}
  </h1>
  <p style="color:#71717a; font-size:14px; margin:0 0 24px 0;">Don't miss your window to submit.</p>

  ${cards}

  <div style="text-align:center; margin-top:24px;">
    <a href="${SITE_URL}" style="color:#4f46e5; font-size:13px; font-weight:600; text-decoration:none;">See all deadlines →</a>
  </div>

  <hr style="${rule}">
  <div style="${footer}">
    <a href="${SITE_URL}" style="color:#3f3f46; text-decoration:none;">${SITE_URL}</a> &nbsp;·&nbsp; Reply "unsubscribe" to opt out
  </div>

</div>
</body>
</html>
  `

  try {
    const batchSize = 50
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      await getResend().emails.send({
        from: `AI Film Contests <${FROM_EMAIL}>`,
        to: FROM_EMAIL,
        bcc: batch,
        subject,
        html,
      })
    }
    return { success: true, sent: subscribers.length }
  } catch (error) {
    console.error('[Email] Deadline reminder failed:', error)
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
    daysLeft?: number
  }>
) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Dev] Weekly digest → ${subscribers.length} subscribers, ${openContests.length} open contests`)
    return { success: true }
  }
  if (!subscribers.length || !openContests.length) return { success: true }

  const subject = `${openContests.length} AI film contests open right now`

  // Sort: urgent first
  const sorted = [...openContests].sort((a, b) =>
    new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  )
  const cards = sorted.map(c => contestCard(c)).join('')

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${emailBase}">
<div style="${container}">

  <div style="margin-bottom:28px; display:flex; align-items:center; justify-content:space-between;">
    <span style="font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#4f46e5;">AI Film Contests</span>
    <span style="color:#52525b; font-size:12px;">Weekly digest</span>
  </div>

  <h1 style="font-size:22px; font-weight:700; margin:0 0 6px 0;">
    ${openContests.length} contest${openContests.length !== 1 ? 's' : ''} open right now
  </h1>
  <p style="color:#71717a; font-size:14px; margin:0 0 24px 0;">Sorted by deadline. All verified against live sources.</p>

  ${cards}

  <div style="text-align:center; margin-top:24px;">
    <a href="${SITE_URL}" style="display:inline-block; background:#4f46e5; color:#fff; text-decoration:none; padding:12px 26px; border-radius:8px; font-size:14px; font-weight:600;">View all contests →</a>
  </div>

  <hr style="${rule}">
  <div style="${footer}">
    <a href="${SITE_URL}" style="color:#3f3f46; text-decoration:none;">${SITE_URL}</a> &nbsp;·&nbsp; Reply "unsubscribe" to opt out
  </div>

</div>
</body>
</html>
  `

  try {
    const batchSize = 50
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      await getResend().emails.send({
        from: `AI Film Contests <${FROM_EMAIL}>`,
        to: FROM_EMAIL,
        bcc: batch,
        subject,
        html,
      })
    }
    return { success: true, sent: subscribers.length }
  } catch (error) {
    console.error('[Email] Weekly digest failed:', error)
    return { success: false, error }
  }
}
