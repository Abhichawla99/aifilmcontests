'use client'

import { useState } from 'react'
import EmailSubscribe from './EmailSubscribe'

export default function DeadlineReminder({ contestName }: { contestName: string }) {
  const [open, setOpen] = useState(false)

  if (open) {
    return (
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #ECE9E2' }}>
        <p style={{ fontSize: 12, color: '#7A7469', marginBottom: 8, lineHeight: 1.5 }}>
          We&apos;ll email you 3 days before {contestName} closes.
        </p>
        <EmailSubscribe compact />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      style={{
        marginTop: 14, width: '100%', textAlign: 'left',
        fontSize: 12.5, color: '#4f46e5', fontWeight: 600,
        fontFamily: 'Space Grotesk, sans-serif', background: 'none', border: 'none',
        padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      }}
    >
      🔔 Get a reminder 3 days before this deadline
    </button>
  )
}
