import { CraftGuidePage, craftGuideMetadata } from '@/components/CraftGuidePage'

const SLUG = 'ai-commercial-storyboard-and-shot-list'

export const metadata = craftGuideMetadata(SLUG)

export default function Page() {
  return <CraftGuidePage slug={SLUG} />
}
