// SMS-to-email gateways: they accept mail but turn it into a text message,
// so a contest alert either never arrives or arrives unreadable. Confirmed as
// a real bounce source in the 2026-10-04 weekly review (see OPTIMIZER_BACKLOG.md).
// Shared between the client-side form guard (EmailSubscribe.tsx) and the
// server-side check in subscribers.ts, so keep this list free of server-only code.
export const BLOCKED_EMAIL_DOMAINS = new Set([
  'tmomail.net', // T-Mobile
  'vtext.com', // Verizon
  'vzwpix.com', // Verizon (MMS)
  'txt.att.net', // AT&T
  'mms.att.net', // AT&T (MMS)
  'messaging.sprintpcs.com', // Sprint
  'pm.sprint.com', // Sprint
  'mymetropcs.com', // MetroPCS
  'tmo.blackberry.net', // T-Mobile BlackBerry
  'mmst5.tracfone.com', // Tracfone
])

export function isBlockedEmailDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase().trim()
  return !!domain && BLOCKED_EMAIL_DOMAINS.has(domain)
}
