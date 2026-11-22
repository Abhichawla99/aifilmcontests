import { CraftGuidePage, craftGuideMetadata } from '@/components/CraftGuidePage'

const SLUG = 'follow-up-cadence-after-pitching-a-brand'

export const metadata = craftGuideMetadata(SLUG)

export default function Page() {
  return <CraftGuidePage slug={SLUG} />
}
