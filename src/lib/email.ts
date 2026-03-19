import { Resend } from 'resend'

const FROM_EMAIL = process.env.FROM_EMAIL || 'contests@aifilmcontests.com'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder')
}
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifilmcontests.com'

export async function sendWelcomeEmail(email: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Dev] Welcome email would be sent to: ${email}`)
    return { success: true }
  }

  try {
    await getResend().emails.send({
      from: `AI Film Contests <${FROM_EMAIL}>`,
      to: email,
      subject: '🎬 Welcome to AI Film Contests - You\'re In!',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to AI Film Contests</title>
</head>
<body style="background-color: #0a0a0f; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 2px; border-radius: 16px;">
        <div style="background: #0a0a0f; border-radius: 14px; padding: 20px 40px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            🎬 AI Film Contests
          </h1>
        </div>
      </div>
    </div>

    <h2 style="font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 16px;">
      You're officially on the list! 🎉
    </h2>

    <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
      Thanks for subscribing to AI Film Contests. You'll be the first to know whenever new competitions, grants, and opportunities in the creative AI filmmaking world are announced.
    </p>

    <div style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(236, 72, 153, 0.15)); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
      <h3 style="margin: 0 0 12px 0; font-size: 18px; color: #8b5cf6;">What to expect:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #d4d4d8; line-height: 2;">
        <li>Instant alerts when new contests open</li>
        <li>Deadline reminders (1 week before close)</li>
        <li>Grant and funding opportunities</li>
        <li>Festival submission windows</li>
        <li>Special early-bird opportunities</li>
      </ul>
    </div>

    <div style="text-align: center; margin-bottom: 32px;">
      <a href="${SITE_URL}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 700; font-size: 16px;">
        Browse All Contests →
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 32px 0;">

    <p style="color: #52525b; font-size: 12px; text-align: center;">
      You're receiving this because you subscribed at <a href="${SITE_URL}" style="color: #8b5cf6;">${SITE_URL}</a><br>
      To unsubscribe, reply to this email with "unsubscribe"
    </p>
  </div>
</body>
</html>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error }
  }
}

export async function sendNewContestNotification(
  subscribers: string[],
  contest: { name: string; organizer: string; deadline: string; prize: string; url: string; description: string }
) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Dev] Contest notification would be sent to ${subscribers.length} subscribers`)
    return { success: true }
  }

  try {
    // Send in batches of 50 (Resend batch limit)
    const batchSize = 50
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      await getResend().emails.send({
        from: `AI Film Contests <${FROM_EMAIL}>`,
        to: FROM_EMAIL,
        bcc: batch,
        subject: `🎬 New Contest: ${contest.name} — ${contest.prize}`,
        html: `
<!DOCTYPE html>
<html>
<body style="background-color: #0a0a0f; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <span style="background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 6px 16px; border-radius: 50px; font-size: 13px; font-weight: 600;">
        🆕 NEW CONTEST ALERT
      </span>
    </div>

    <h1 style="font-size: 28px; font-weight: 800; margin-bottom: 8px;">${contest.name}</h1>
    <p style="color: #8b5cf6; font-size: 16px; margin-bottom: 16px;">by ${contest.organizer}</p>

    <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">${contest.description}</p>

    <div style="display: grid; gap: 12px; margin-bottom: 32px;">
      <div style="background: rgba(124, 58, 237, 0.1); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 12px; padding: 16px;">
        <div style="color: #8b5cf6; font-size: 12px; font-weight: 600; margin-bottom: 4px;">PRIZE</div>
        <div style="font-size: 20px; font-weight: 700;">${contest.prize}</div>
      </div>
      <div style="background: rgba(236, 72, 153, 0.1); border: 1px solid rgba(236, 72, 153, 0.3); border-radius: 12px; padding: 16px;">
        <div style="color: #ec4899; font-size: 12px; font-weight: 600; margin-bottom: 4px;">DEADLINE</div>
        <div style="font-size: 18px; font-weight: 700;">${new Date(contest.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
      </div>
    </div>

    <div style="text-align: center;">
      <a href="${SITE_URL}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 700; font-size: 16px;">
        View Contest Details →
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 32px 0;">
    <p style="color: #52525b; font-size: 12px; text-align: center;">
      <a href="${SITE_URL}" style="color: #8b5cf6;">${SITE_URL}</a> · Reply "unsubscribe" to opt out
    </p>
  </div>
</body>
</html>
        `,
      })
    }
    return { success: true }
  } catch (error) {
    console.error('Failed to send contest notification:', error)
    return { success: false, error }
  }
}
