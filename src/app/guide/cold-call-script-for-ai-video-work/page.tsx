import { CraftGuidePage, craftGuideMetadata } from '@/components/CraftGuidePage'

const SLUG = 'cold-call-script-for-ai-video-work'

export const metadata = craftGuideMetadata(SLUG)

export default function Page() {
  return <CraftGuidePage slug={SLUG} />
}
