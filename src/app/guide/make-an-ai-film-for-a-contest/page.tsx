import { CraftGuidePage, craftGuideMetadata } from '@/components/CraftGuidePage'

const SLUG = 'make-an-ai-film-for-a-contest'

export const metadata = craftGuideMetadata(SLUG)

export default function Page() {
  return <CraftGuidePage slug={SLUG} />
}
