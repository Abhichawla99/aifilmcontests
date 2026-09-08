/* Hand-drawn line illustrations, original work for this site.
   House style: 2px ink strokes on paper, slight wobble, halftone shading,
   one pastel spot fill per drawing. Film-flavoured, never generic tech icons.
   Server components — no JS ships for these. */

const INK = '#1B1916'

function Halftone({ id, opacity = 0.32 }: { id: string; opacity?: number }) {
  return (
    <defs>
      <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="1.6" cy="1.6" r="1.05" fill={INK} opacity={opacity} />
      </pattern>
    </defs>
  )
}

const stroke = {
  fill: 'none',
  stroke: INK,
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/* ── 1. The clapperboard: everything, in one place ─────────────────────────── */
export function ClapperDrawing({ tint = '#CFE2EF' }: { tint?: string }) {
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%" role="img" aria-label="A film clapperboard resting on a stack of contest listings">
      <Halftone id="ht-clap" />
      {/* listing cards behind, slightly askew */}
      <g transform="rotate(-4 100 92)">
        <rect x="38" y="74" width="124" height="52" rx="6" {...stroke} fill="#fff" />
        <path d="M50 90h58M50 102h44M50 114h68" {...stroke} strokeWidth={1.6} opacity={0.45} />
      </g>
      <g transform="rotate(3 100 88)">
        <rect x="44" y="66" width="118" height="50" rx="6" {...stroke} fill="#fff" />
        <path d="M56 82h52M56 94h38" {...stroke} strokeWidth={1.6} opacity={0.45} />
      </g>
      {/* clapperboard, tilted */}
      <g transform="rotate(-8 100 60)">
        {/* slate */}
        <rect x="52" y="42" width="96" height="52" rx="5" {...stroke} fill={tint} />
        <rect x="52" y="42" width="96" height="52" rx="5" fill="url(#ht-clap)" stroke="none" opacity={0.5} />
        <path d="M64 62h50M64 76h34" {...stroke} strokeWidth={1.7} />
        {/* hinged stick with stripes */}
        <path d="M50 34l98-12 3 15-98 12z" {...stroke} fill="#fff" />
        <path d="M68 31l-5 14M88 28l-5 14M108 25l-5 14M128 22l-5 14" {...stroke} strokeWidth={1.8} />
        <circle cx="50" cy="40" r="3.2" {...stroke} fill="#fff" />
      </g>
    </svg>
  )
}

/* ── 2. The calendar: deadlines you can trust ──────────────────────────────── */
export function CalendarDrawing({ tint = '#F0E3BC' }: { tint?: string }) {
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%" role="img" aria-label="A calendar page with one deadline circled, checked against a source">
      <Halftone id="ht-cal" />
      <g transform="rotate(-3 100 78)">
        <rect x="46" y="34" width="108" height="96" rx="7" {...stroke} fill="#fff" />
        {/* header band */}
        <path d="M46 55a7 7 0 017-7h94a7 7 0 017 7v6H46z" {...stroke} fill={tint} />
        <rect x="46" y="41" width="108" height="20" fill="url(#ht-cal)" stroke="none" opacity={0.45} />
        {/* rings */}
        <path d="M72 28v14M100 28v14M128 28v14" {...stroke} />
        {/* date grid, drawn loosely */}
        <g opacity={0.55}>
          <path d="M62 76h12M86 76h12M110 76h12M134 76h6M62 94h12M110 94h12M134 94h6M62 112h12M86 112h12M134 112h6" {...stroke} strokeWidth={1.7} />
        </g>
        {/* the circled day */}
        <circle cx="92" cy="94" r="13" fill="none" stroke="#C2410C" strokeWidth={2.4} strokeLinecap="round" strokeDasharray="60 8" />
        <path d="M87 94l4 4 7-8" fill="none" stroke="#C2410C" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* small verified stamp */}
      <g transform="rotate(12 152 116)">
        <circle cx="152" cy="116" r="16" {...stroke} fill="#fff" />
        <path d="M145 116l5 5 10-11" {...stroke} strokeWidth={2.4} />
      </g>
    </svg>
  )
}

/* ── 3. The envelope: told before it closes ────────────────────────────────── */
export function EnvelopeDrawing({ tint = '#F5D9D5' }: { tint?: string }) {
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%" role="img" aria-label="An alert card flying out of an envelope">
      <Halftone id="ht-env" />
      {/* motion lines */}
      <path d="M18 58h22M12 74h30M22 90h18" {...stroke} strokeWidth={1.8} opacity={0.45} />
      {/* card flying out */}
      <g transform="rotate(-12 118 52)">
        <rect x="82" y="26" width="76" height="46" rx="6" {...stroke} fill="#fff" />
        <path d="M94 44h40M94 56h26" {...stroke} strokeWidth={1.7} opacity={0.5} />
        <circle cx="146" cy="38" r="5" fill="#C2410C" stroke="none" />
      </g>
      {/* envelope */}
      <g transform="rotate(4 106 104)">
        <rect x="52" y="78" width="108" height="60" rx="6" {...stroke} fill={tint} />
        <rect x="52" y="78" width="108" height="60" rx="6" fill="url(#ht-env)" stroke="none" opacity={0.45} />
        <path d="M52 84l54 36 54-36" {...stroke} />
        <path d="M52 132l38-28M160 132l-38-28" {...stroke} strokeWidth={1.7} opacity={0.6} />
      </g>
    </svg>
  )
}

/* ── 4. A small doodle for the sign-up block ───────────────────────────────── */
export function FilmmakerDoodle() {
  return (
    <svg viewBox="0 0 120 130" width="100%" height="100%" role="img" aria-label="A filmmaker holding a camera">
      {/* hair + head */}
      <path d="M42 40c0-11 8-19 19-19s19 8 19 19" {...stroke} />
      <path d="M42 40c-3-14 6-24 19-24s22 9 19 24" fill={INK} stroke="none" />
      <path d="M45 40a16 16 0 0032 0v9a16 16 0 01-32 0z" {...stroke} fill="#fff" />
      <circle cx="55" cy="45" r="1.9" fill={INK} />
      <circle cx="68" cy="45" r="1.9" fill={INK} />
      <path d="M57 53c3 2.5 6 2.5 9 0" {...stroke} strokeWidth={1.8} />
      {/* body */}
      <path d="M46 66c-8 4-13 13-13 24v22h56V90c0-11-5-20-13-24" {...stroke} fill="#fff" />
      <path d="M61 60v8" {...stroke} />
      {/* camera held up */}
      <g transform="rotate(-8 88 78)">
        <rect x="70" y="66" width="36" height="24" rx="4" {...stroke} fill="#E7F1F8" />
        <circle cx="88" cy="78" r="7" {...stroke} fill="#fff" />
        <path d="M78 62h8l2 4H76z" {...stroke} fill="#fff" />
      </g>
      <path d="M46 78l22-4" {...stroke} />
      {/* little burst of energy */}
      <path d="M104 46l6-8M110 54l9-3M100 38l2-9" {...stroke} strokeWidth={1.8} opacity={0.7} />
    </svg>
  )
}
