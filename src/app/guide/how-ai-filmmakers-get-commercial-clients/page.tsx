import { CraftGuidePage, craftGuideMetadata } from '@/components/CraftGuidePage'

const SLUG = 'how-ai-filmmakers-get-commercial-clients'

export const metadata = craftGuideMetadata(SLUG)

export default function Page() {
  return <CraftGuidePage slug={SLUG} />
}
