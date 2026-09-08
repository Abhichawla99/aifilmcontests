// ── The light "paper + pastel" design language (Sep 2026 redesign) ────────────
// Notion-ish: warm paper ground, ink text, one pastel tint per category, and an
// emoji language of our own — film-flavoured, not the 🚀✨⚡ every AI tool uses.

export const paper = '#FBFAF8'
export const ink = '#1B1916'

export interface CategoryStyle {
  label: string
  emoji: string
  bg: string      // card / chip background tint
  border: string  // hairline on that tint
  text: string    // readable label colour on the tint
}

export const categoryStyles: Record<string, CategoryStyle> = {
  'short-film':  { label: 'Short Film',  emoji: '🎞️', bg: '#E7F1F8', border: '#CFE2EF', text: '#31536B' },
  feature:       { label: 'Feature',     emoji: '📽️', bg: '#F3F0F9', border: '#E1DAF0', text: '#4C3F72' },
  animation:     { label: 'Animation',   emoji: '🎠', bg: '#FAF0F5', border: '#F0DBE8', text: '#6E3B57' },
  experimental:  { label: 'Experimental',emoji: '🫧', bg: '#EDF4EE', border: '#D8E8DA', text: '#3B5E41' },
  documentary:   { label: 'Documentary', emoji: '🗺️', bg: '#FBF4DE', border: '#F0E3BC', text: '#6B5A22' },
  'music-video': { label: 'Music Video', emoji: '🪩', bg: '#FDEEEC', border: '#F5D9D5', text: '#7C3A31' },
  commercial:    { label: 'Commercial',  emoji: '🏮', bg: '#FAEEE3', border: '#F0DDC8', text: '#7A4A1F' },
  advertising:   { label: 'Advertising', emoji: '🎟️', bg: '#F2EFEA', border: '#E3DED4', text: '#5B5344' },
}

export const fallbackCategory: CategoryStyle =
  { label: 'Contest', emoji: '🎬', bg: '#F4F2EE', border: '#E5E1D8', text: '#57524A' }

export function categoryStyle(cat?: string): CategoryStyle {
  return (cat && categoryStyles[cat]) || fallbackCategory
}

/** Muted paper treatment for closed contests, whatever their category. */
export const closedStyle: CategoryStyle =
  { label: 'Closed', emoji: '🌒', bg: '#F4F3F0', border: '#E7E5DF', text: '#8B867C' }

/** The robots write freeform category strings (140+ distinct values in the DB).
    Normalize anything to one of the eight canonical styles; dedupe at the call site. */
export function normalizeCategory(raw: string): CategoryStyle {
  const k = raw.toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/^ai-?/, '')
  if (categoryStyles[k]) return categoryStyles[k]
  const has = (re: RegExp) => re.test(k)
  if (has(/short|micro|vertical|trailer|1-minute|minute/)) return categoryStyles['short-film']
  if (has(/feature|long|medium/)) return categoryStyles['feature']
  if (has(/anim/)) return categoryStyles['animation']
  if (has(/doc/)) return categoryStyles['documentary']
  if (has(/music|song/)) return categoryStyles['music-video']
  if (has(/advert|ads\b|^ads/)) return categoryStyles['advertising']
  if (has(/commercial|brand|fashion|product/)) return categoryStyles['commercial']
  if (has(/experiment|art|generative|conceptual|media|digital|hybrid|xr|vr\b|ar\b|360|spatial|metaverse|interactive|gam|design|world|image|motion|writing|philosophy|native|assisted|generated/)) return categoryStyles['experimental']
  if (has(/narrative|drama|comedy|horror|sci|thriller|fantasy|action|film|video|cinema|story/)) return categoryStyles['short-film']
  return fallbackCategory
}

/** A stable pastel for a page that has no category of its own (guides, topics).
    Hashed from the slug so a given article always wears the same colour, and the
    library of ~30 SEO pages reads as varied rather than random. */
export function tintForSlug(slug: string): CategoryStyle {
  const keys = Object.keys(categoryStyles)
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return categoryStyles[keys[h % keys.length]]
}
