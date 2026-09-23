'use client'

import { useState } from 'react'
import EmailSubscribe from './EmailSubscribe'

export default function DeadlineReminder({ contestName }: { contestName: string }) {
  const [open, setOpen] = useState(false)

  if (open) {
    return (
      <div className="dlr-open">
        <p className="dlr-open-note">
          We&apos;ll email you 3 days before {contestName} closes.
        </p>
        <EmailSubscribe compact />
      </div>
    )
  }

  return (
    <button type="button" className="dlr-trigger" onClick={() => setOpen(true)}>
      Get a reminder 3 days before this deadline
    </button>
  )
}
