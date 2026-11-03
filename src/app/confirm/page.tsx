import type { Metadata } from 'next'
import { Suspense } from 'react'
import InnerLayout from '@/components/InnerLayout'
import ConfirmPack from './ConfirmPack'

// Where the link in the confirm email lands. Not a page for Google.
export const metadata: Metadata = {
  title: 'Confirm your email | AI Film Contests',
  robots: { index: false, follow: false },
}

export default function ConfirmPage() {
  return (
    <InnerLayout>
      <div className="max-w-5xl mx-auto px-5 py-12">
        <Suspense fallback={null}>
          <ConfirmPack />
        </Suspense>
      </div>
    </InnerLayout>
  )
}
